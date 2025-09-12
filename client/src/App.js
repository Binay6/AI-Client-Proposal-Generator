import React, { useState } from "react";
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post("http://localhost:5000/api/generate", {
        prompt,
      });
      setResponse(res.data.result || "No response received.");
    } catch (err) {
      console.error(err);
      setResponse("Error: Could not generate proposal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>AI Client Proposal Generator</h1>

      <textarea
        rows="4"
        cols="60"
        placeholder="Enter your proposal prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ padding: "10px", fontSize: "16px" }}
      />

      <br />
      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{ marginTop: "10px", padding: "10px 20px", fontSize: "16px" }}
      >
        {loading ? "Generating..." : "Generate Proposal"}
      </button>

      {response && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#f9f9f9",
          }}
        >
          <h2>Generated Proposal:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;
