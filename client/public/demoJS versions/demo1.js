// ================================
// IMPORTS (Required Packages & CSS)
// ================================
import React, { useState } from "react"; // React library + state management
import { jsPDF } from "jspdf"; // Library to export content into PDF
import "./App.css"; // Importing styles from App.css

// ================================
// MAIN APP COMPONENT
// ================================
function App() {
  // ----------------
  // STATE VARIABLES
  // ----------------
  const [raw, setRaw] = useState(""); // Stores the user input text (proposal content)
  const [loading, setLoading] = useState(false); // Shows loading status when generating proposal
  const [saved, setSaved] = useState([]); // Stores all locally saved proposals

  // ----------------
  // HANDLER FUNCTIONS
  // ----------------

  // 1. Handle text input changes
  const handleChange = (e) => {
    setRaw(e.target.value);
  };

  // 2. Simulate "Generate Proposal" (dummy AI generation logic)
  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setRaw("This is a sample AI-generated proposal text...");
      setLoading(false);
    }, 1000);
  };

  // 3. Save proposal locally in memory
  const handleSaveLocal = () => {
    if (raw.trim() === "") return; // Prevent saving empty proposals
    setSaved([...saved, raw]);
    alert("Proposal saved locally!");
  };

  // 4. Export proposal content to PDF
  const handleExportPDF = () => {
    if (!raw) return; // Do nothing if no proposal exists
    const doc = new jsPDF();
    doc.text(raw, 10, 10); // Add proposal text to PDF at position (10,10)
    doc.save("proposal.pdf"); // Trigger download of "proposal.pdf"
  };

  // 5. Copy proposal to clipboard
  const handleCopy = () => {
    if (!raw) return;
    navigator.clipboard.writeText(raw);
    alert("Proposal copied to clipboard!");
  };

  // 6. Clear the current proposal
  const handleClear = () => {
    setRaw("");
  };

  // ================================
  // RENDER (UI Section)
  // ================================
  return (
    <div className="app">
      {/* HEADER SECTION */}
      <header className="header">
        <h1>AI Proposal Generator</h1>
        <p>Create, save, and export business proposals easily.</p>
      </header>

      {/* MAIN CONTENT SECTION */}
      <main className="main-content">
        {/* TEXTAREA: Where user writes or views generated proposals */}
        <textarea
          value={raw}
          onChange={handleChange}
          placeholder="Write or generate your proposal here..."
        />

        {/* ACTION BUTTONS SECTION */}
        <div className="actions">
          {/* Generate Button */}
          <button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate Proposal"}
          </button>

          {/* Copy Button */}
          <button onClick={handleCopy} disabled={!raw}>
            Copy
          </button>

          {/* Save Locally Button */}
          <button onClick={handleSaveLocal} disabled={!raw}>
            Save (Local)
          </button>

          {/* Export PDF Button */}
          <button onClick={handleExportPDF} disabled={!raw}>
            Export PDF
          </button>

          {/* Clear Button */}
          <button onClick={handleClear} disabled={!raw}>
            Clear
          </button>
        </div>

        {/* SAVED PROPOSALS COUNT */}
        <div className="saved-count">
          Saved: {saved.length}
        </div>
      </main>
    </div>
  );
}

// ================================
// EXPORT APP COMPONENT
// ================================
export default App;
