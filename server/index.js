console.log("✅ Starting server...");

const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (process.env.USE_POLLINATIONS === "true") {
      const response = await axios.get(
        `https://text.pollinations.ai/${encodeURIComponent(prompt)}`
      );
      return res.json({ result: response.data });
    } else {
      return res.status(400).json({ error: "No AI provider configured." });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
