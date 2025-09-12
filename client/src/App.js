// client/src/App.js
import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./App.css";

function Spinner() {
  return <div className="spinner" aria-hidden="true" />;
}

function Section({ title, body }) {
  return (
    <div className="section-card">
      <h3 className="section-title">{title}</h3>
      <div className="section-body"><ReactMarkdown>{body}</ReactMarkdown></div>
    </div>
  );
}

/** Parse ===SECTION_NAME=== markers into sections
 * If no markers found returns null (so we display raw)
 */
function parseSectionsFromText(text) {
  if (!text || typeof text !== "string") return null;
  const regex = /===\s*([A-Z0-9_ ]+)\s*===/g;
  const matches = [];
  let m;
  while ((m = regex.exec(text)) !== null) {
    matches.push({ name: m[1].trim(), index: m.index, length: m[0].length });
  }
  if (matches.length === 0) return null;
  const sections = {};
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const key = matches[i].name;
    sections[key] = text.slice(start, end).trim();
  }
  return sections;
}

export default function App() {
  const [form, setForm] = useState({
    clientName: "",
    projectType: "",
    budget: "",
    timeline: "",
    goals: "",
    tone: "professional",
  });
  const [loading, setLoading] = useState(false);
  const [raw, setRaw] = useState("");
  const [sections, setSections] = useState(null);
  const [error, setError] = useState("");
  const [savedCount, setSavedCount] = useState(() => {
    const arr = JSON.parse(localStorage.getItem("savedProposals") || "[]");
    return arr.length;
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const buildPrompt = (form) => {
    return `
You are an expert enterprise proposal writer. Produce a client proposal using the exact markers shown below.
Do NOT add any extra commentary outside the markers. Use concise professional language.

Client: ${form.clientName || "Client"}
Project Type: ${form.projectType || "Project"}
Budget: ${form.budget || "Not specified"}
Timeline: ${form.timeline || "Not specified"}
Goals: ${form.goals || "Not specified"}
Tone: ${form.tone || "professional"}

Return these sections (use these exact markers):
===EXECUTIVE_SUMMARY===
Give a 2-4 sentence value hook.

===PROBLEM_STATEMENT===
Restate client's problem in 2-4 sentences.

===PROPOSED_SOLUTION===
Describe the proposed technical/business solution (3-6 short paragraphs).

===METHODOLOGY_AND_TIMELINE===
Give phases and approximate durations (Phase 1, Phase 2...).

===BUDGET_AND_ASSUMPTIONS===
High-level cost estimate and assumptions.

===RISK_MITIGATION===
Top 3 risks and mitigations.

===CLOSING===
Short call to action and next step.
`;
  };

  const handleGenerate = async () => {
    setError("");
    setSections(null);
    setRaw("");
    setLoading(true);

    const prompt = buildPrompt(form);

    try {
      const res = await axios.post("http://localhost:5000/api/generate", { prompt }, { timeout: 120000 });
      // Pollinations backend returns text; server returns { result } or { raw/sections }
      const data = res.data;
      const text = data.result || data.raw || data.resultText || JSON.stringify(data);

      setRaw(text);
      const parsed = parseSectionsFromText(text);
      setSections(parsed);
    } catch (err) {
      console.error("Generate error:", err);
      const msg = err.response?.data?.error || err.message || "Unknown error";
      setError("Failed to generate proposal: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(raw || "");
      alert("Proposal copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  const handleSaveLocal = () => {
    const list = JSON.parse(localStorage.getItem("savedProposals") || "[]");
    list.unshift({
      id: Date.now(),
      clientName: form.clientName,
      projectType: form.projectType,
      createdAt: new Date().toISOString(),
      content: raw,
    });
    localStorage.setItem("savedProposals", JSON.stringify(list));
    setSavedCount(list.length);
    alert("Saved locally (browser storage).");
  };

  const handleClear = () => {
    setForm({ clientName: "", projectType: "", budget: "", timeline: "", goals: "", tone: "professional" });
    setRaw("");
    setSections(null);
    setError("");
  };

  return (
    <div className="container">
      <h1>AI Client Proposal Generator</h1>

      <div className="card">
        <div className="form-grid">
          <input name="clientName" value={form.clientName} onChange={handleChange} placeholder="Client name (e.g., Citibank)" />
          <input name="projectType" value={form.projectType} onChange={handleChange} placeholder="Project type (e.g., Backend service)" />
          <input name="budget" value={form.budget} onChange={handleChange} placeholder="Budget (optional)" />
          <input name="timeline" value={form.timeline} onChange={handleChange} placeholder="Timeline (e.g., 3 months)" />
          <select name="tone" value={form.tone} onChange={handleChange}>
            <option value="professional">Professional</option>
            <option value="concise">Concise</option>
            <option value="persuasive">Persuasive</option>
          </select>
          <textarea name="goals" value={form.goals} onChange={handleChange} placeholder="Goals / short RFP details (paste client requirements here)" rows="4" />
        </div>

        <div className="actions">
          <button onClick={handleGenerate} disabled={loading}>{loading ? "Generating..." : "Generate Proposal"}</button>
          {loading && <Spinner />}
          <button onClick={handleCopy} disabled={!raw}>Copy</button>
          <button onClick={handleSaveLocal} disabled={!raw}>Save (Local)</button>
          <button onClick={handleClear}>Clear</button>
          <div className="saved-count">Saved: {savedCount}</div>
        </div>

        {error && <div className="error">{error}</div>}
      </div>

      <div style={{ marginTop: 20 }}>
        {sections ? (
          <>
            <h2>Proposal Sections</h2>
            {Object.keys(sections).map((k) => (
              <Section key={k} title={k.replace(/_/g, " ")} body={sections[k]} />
            ))}
            <h3>Raw Output</h3>
            <pre className="raw-output">{raw}</pre>
          </>
        ) : raw ? (
          <>
            <h2>Generated Proposal</h2>
            <div className="raw-render"><ReactMarkdown>{raw}</ReactMarkdown></div>
          </>
        ) : (
          <p className="hint">Enter details and click <b>Generate Proposal</b>.</p>
        )}
      </div>
    </div>
  );
}
