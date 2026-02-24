# 🎬 CreatorJoy: Automated AI Avatar Pipeline

![Status](https://img.shields.io/badge/Status-Complete-success?style=for-the-badge)
![n8n](https://img.shields.io/badge/n8n-Workflow_Automation-FF6600?style=for-the-badge&logo=n8n)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)

## 📌 Project Overview
This repository contains a fully automated, zero-touch AI video generation pipeline built for **CreatorJoy**. 

The architecture programmatically accepts a YouTube video URL and a topic, extracts the creator's thumbnail, generates a custom AI script, clones the creator's voice, and renders a lip-synced MP4 avatar video. The data is securely logged into a Supabase PostgreSQL database and displayed dynamically on a React frontend dashboard.

## 📺 Video Demo & Walkthrough

**👉 [Click Here to Watch the Full System Walkthrough & Live Demo](https://www.loom.com/share/40232d1b61ca4e719e8c8dfeb8d674e5) 👈**

---

## 🛠️ Tech Stack & Required APIs
To run this pipeline from A to Z, the following services and API keys were utilized:
* **n8n:** Workflow orchestration and automation.
* **Groq API:** Ultra-fast LLM inference (Llama 3 / Mixtral) for script generation.
* **Fal.ai API:** Open-source F5-TTS model for instant, high-fidelity voice cloning.
* **D-ID API:** Enterprise video generation and lip-sync animation (Creative Reality Studio).
* **Supabase:** Serverless PostgreSQL database for logging video records.
* **React + Vite:** Lightning-fast frontend for side-by-side video comparison.

---

## ⚙️ Architecture: Node-by-Node Breakdown
The backend is driven by a 7-step asynchronous n8n pipeline. You can find the complete workflow in the `CreatorJoy_AI_Pipeline.json` file included in this repository.

1. **Trigger (Webhook):** Listens for incoming POST requests containing the `youtube_url` and target `topic`.
2. **Data Extraction (Code Node):** Parses the raw YouTube URL to extract the video ID and automatically formats a high-resolution `maxresdefault.jpg` thumbnail URL to serve as the avatar's face.
3. **AI Scriptwriter (Groq HTTP Request):** Prompts the Groq API to generate a highly targeted, 60-second conversational script based on the Webhook topic.
4. **Voice Synthesizer (Fal.ai HTTP Request):** Sends the generated Groq script and a secure Dropbox audio sample to Fal.ai. Fal.ai maps the syllables and returns a cloned `.wav` audio track.
5. **Video Generation (D-ID POST):** Combines the dynamic YouTube thumbnail and the cloned Fal.ai audio track, sending them to D-ID's rendering servers. Returns a unique tracking `id`.
6. **Buffer (Wait Node):** Pauses the pipeline for 30 seconds to prevent timeout errors while D-ID's GPUs render the deepfake video.
7. **Delivery & Logging (D-ID GET & Supabase):** Fetches the final `.mp4` URL using the tracking ID. A native n8n Supabase node then writes the original YouTube URL, the Topic, and the new MP4 URL directly into the database.

---

## 🚀 Setup Instructions

### 1. Backend (n8n Workflow)
1. Install and launch [n8n](https://n8n.io/).
2. In your n8n workspace, go to the top right options menu and select **Import from File**.
3. Upload the `CreatorJoy_AI_Pipeline.json` file found in this repository.
4. Update the HTTP Request nodes with your own API credentials for Groq, Fal.ai, and D-ID.
5. Click **Execute Workflow** and send a test POST request to the Webhook URL.

### 2. Database (Supabase)
1. Create a new Supabase project.
2. Create a table named `videos` with Row Level Security (RLS) disabled for local testing.
3. Add three `text` columns: `youtube_url`, `topic`, and `video_url`.
4. Add your Supabase Host URL and Anon Key to the final Supabase node in n8n.

### 3. Frontend (React Dashboard)
1. Clone this repository and navigate to the frontend directory:
   ```bash
   cd creatorjoy-frontend
2. Install the necessary dependencies:
   ```bash
   npm install @supabase/supabase-js
  
3. (Security Note): In a production environment, store the Supabase URL and Anon Key in a .env file. For this PoC, ensure they are linked in App.jsx.

4. Start the local development server:
   ```bash
   npm run dev
5. Open http://localhost:5173 to view the live dashboard comparing the original creator to the AI-generated avatar.

### 💡 Engineering Edge Cases Handled
* Enterprise API Safety Constraints: Built the pipeline to be modular. During testing, enterprise APIs (like D-ID) threw 451 CelebrityDetectedError codes to prevent deepfakes of high-profile tech reviewers. Because the pipeline is fully dynamic, the payload can be instantly hot-swapped to an unrestricted niche creator without rewriting a single node.

* Asynchronous Fetching: Implemented a POST/Wait/GET architecture to handle heavy video rendering without crashing the n8n execution environment due to standard HTTP timeouts.
