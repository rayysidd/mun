Check it out here : [https://diplomate.vercel.app/](https://mun-rayysidds-projects.vercel.app/auth)

## 🏛️ DiploMate (Work in Progress)

### 📌 Overview

**DiploMate** is an AI-powered research and speech-generation tool built to support Model United Nations delegates. It helps users craft committee- and agenda-specific speeches, anticipate rebuttals, and analyze diplomatic stances — all tailored to the delegate's country.

> ✅ Core AI functionality is implemented. UI and dashboard features are currently under development.

---

### ✅ Completed Features

* 🌍 **Country Stance Analyzer** — Generates detailed stance based on selected country, committee, and agenda
* 🗣️ **Opening Speech Generator** — Creates formal, context-aware speeches from user input
* 🧠 **Rebuttal & Accusation Assistant** — Helps prepare responses to likely questions, accusations, and attacks

---

### 🚧 In Progress / Planned

* 📄 Draft resolution generator
* 📤 Export speeches and rebuttals as PDF/Word
* 🔐 User authentication (email-password, JWT)
* 🧾 Editable dashboard for saved content
* 🌐 Real-time data integration (scraping or API-based)
* 📱 Mobile app with sync
* 🧠 RAG (Retrieval-Augmented Generation) to ground AI responses in current global events and UN sources
---

### 🧰 Tech Stack

* **Frontend:** Next.js, TailwindCSS
* **Backend:** Node.js, Express.js, MongoDB
* **Auth:** JWT + bcrypt
* **AI API:** Gemini (Google Generative AI)
---

### 📦 Getting Started (once open-sourced)

```bash
# Clone the repo
git clone https://github.com/yourusername/mun-assistant

# Install dependencies
cd client && npm install
cd ../server && npm install

# Add .env file with API keys and Mongo URI
# Run both frontend and backend
npm run dev (client) | node index.js (server)
```
