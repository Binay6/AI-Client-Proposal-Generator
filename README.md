# AI Client Proposal Generator

An AI-powered web application that helps turn client requirements or problem statements into structured proposal drafts.

The project was built as a hands-on GenAI application, combining an AI-powered workflow with a React frontend and Node.js/Express backend.

## 🚀 What it demonstrates

- **AI-assisted proposal generation** from client requirements
- Structured proposal output for sections such as problem statement, solution, benefits and timeline
- **React** frontend for the user interface
- **Node.js + Express** backend for application/API logic
- API-based AI integration
- Proposal export functionality
- A deployed web application for trying the project

## 🧠 GenAI Focus

This project is an early step in my GenAI engineering journey.

The emphasis is not only on calling an LLM, but on building an actual application around an AI workflow:

**User requirements → AI generation → structured proposal → refinement → export**

Future iterations will focus on stronger prompting, reliability, evaluation, document grounding and more production-oriented AI architecture.

## 🛠️ Tech Stack

**Frontend**
- React
- JavaScript
- CSS / UI components

**Backend**
- Node.js
- Express

**AI / APIs**
- LLM API integration
- Axios

**Document / Export**
- jsPDF

## 📁 Project Structure

```text
AI-Client-Proposal-Generator/
├── client/          # React frontend
├── server/          # Node.js + Express backend
└── README.md
```

## 🌐 Live Demo

[Open the deployed application](https://ai-client-proposal-generator.vercel.app)

## ▶️ Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/Binay6/AI-Client-Proposal-Generator.git
cd AI-Client-Proposal-Generator
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure environment variables

Create your own environment file locally for the backend and add the required API configuration.

**Do not commit API keys or other secrets to GitHub.**

### 5. Start the application

Start the backend and frontend using the project's development scripts.

## 🔮 Future Improvements

- Retrieval-augmented proposal generation
- Grounding proposals in approved company/project knowledge
- Better output evaluation and validation
- More robust document generation
- Improved error handling and observability
- Production-oriented deployment architecture

## 📌 Why I Built This

This project represents the transition from learning GenAI concepts to applying them in software.

It is one of the projects I am using to build toward **GenAI / AI Engineering** roles.

---

**Author:** [Binay Maity](https://github.com/Binay6)
