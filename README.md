# 🏛️ DiploMate – Your AI-Powered MUN Co-Delegate

[![Tech Stack](https://img.shields.io/badge/stack-Full%20Stack-blue?style=flat-square&logo=vercel)]()
[![Status](https://img.shields.io/badge/status-WIP-orange?style=flat-square&logo=github)]()
[![Made with Next.js](https://img.shields.io/badge/frontend-Next.js-black?style=flat-square&logo=next.js)]()
[![Backend](https://img.shields.io/badge/backend-Express.js-green?style=flat-square&logo=node.js)]()
[![AI API](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-lightblue?style=flat-square&logo=google)]()

---

## 📌 Overview

**DiploMate** is a full-stack, AI-powered collaboration platform built for **Model United Nations (MUN)** delegates. It goes far beyond speech generation — DiploMate helps you research deeply, align with your country's stance, collaborate with co-delegates, and prepare compelling, agenda-specific content.

> Think of it as your **researcher**, **writer**, and **diplomatic strategist** — all in one tab.

---

## 🌐 Live Preview

- 🔗 [App Homepage (WIP)](https://diplomate.vercel.app/)
- 🔐 [Direct Auth Page (Dev)](https://mun-rayysidds-projects.vercel.app/auth)

---

## 👨‍💻 Key Features

### 1. 🧑‍💼 Delegate Personalisation  
When you join an event, you’re assigned a **country and committee**. All AI responses — from speeches to rebuttals — are tailored to your position on the given agenda.

### 2. 🧭 Event Workspace  
Each MUN event has its own multi-panel dashboard:
- 📌 **Event Context Panel**: View your agenda, committee, country, and co-delegates.
- 📚 **Knowledge Base Manager**: Add links or raw text as research sources, visible to all delegates.
- 💬 **Chat Panel**: Ask the AI for help — with or without RAG (Retrieval-Augmented Generation).

### 3. ✍️ Speech Creation & Saving  
Generate **formal, structured opening speeches**, draft clauses, and more — grounded in actual context. Save and revisit your drafts at any time.

### 4. 🧠 Rebuttal & Accusation Assistant  
Anticipate common attacks, counterpoints, and tricky questions from other delegates — and prepare responses like a pro.

---

## 🔜 Coming Soon

- 📄 Draft resolution generator
- 📤 Export speeches & rebuttals to PDF/Word
- 🧾 Saved content dashboard
- 🔐 Email-password auth (JWT-secured)
- 🌐 Real-time source ingestion from APIs/web
- 📱 Mobile app with sync
- 🧠 RAG pipeline to ground responses in your knowledge base using vector search (ChromaDB)

---

## 🧰 Tech Stack

| Layer       | Tech                                                                 |
|-------------|----------------------------------------------------------------------|
| Frontend    | [Next.js](https://nextjs.org/), TailwindCSS                         |
| Backend     | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), MongoDB |
| AI Layer    | [FastAPI](https://fastapi.tiangolo.com/), ChromaDB, Sentence Transformers |
| LLM API     | [Gemini 1.5 Flash](https://deepmind.google/technologies/gemini/)     |
| Auth        | JWT, bcrypt                                                          |

---

## 📂 Architecture

```text
.
├── client/               # Next.js frontend (TS + Tailwind)
├── server/               # Node.js backend (Express + MongoDB)
├── server-python/        # FastAPI AI service (query + ingestion)
└── docs/                 # Architecture diagrams, prompts, etc.
