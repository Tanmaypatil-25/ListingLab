# ListingLab 🛍️✨
> **AI-Powered E-Commerce Listing Generator for Small Online Sellers & Side Hustlers**  
> *Built for the DEV Challenge: Hacktoberfest 2026 (Week 2 — Side Hustle)*

ListingLab enables small online merchants, crafters, dropshippers, and side-hustlers to quickly turn basic product notes into professional, high-converting product listings tailored for **Shopify**, **Etsy**, **Amazon**, and **eBay** using **100% open-weight AI** models.

---

## 🌟 Key Features

- **Platform-Tailored Strategy**: Automatically optimizes tone, length, keywords, and structural conventions for Shopify, Etsy, Amazon, and eBay.
- **Strict Grounding & Zero Fabrication**: Adheres to strict anti-hallucination rules. It **never** invents dimensions, certifications, battery life, materials, or warranty claims that were not provided.
- **Interchangeable Open-Weight AI Architecture**: Designed around an adapter pattern supporting any OpenAI-compatible inference endpoint for open-weight models (Groq, Ollama, OpenRouter, Hugging Face, Together AI, vLLM).
- **Comprehensive Generated Sections**:
  1. **Product Title** (Platform SEO-optimized)
  2. **Short Hook / Description** (Buy-box overview)
  3. **5 Key Selling Points** (Feature-benefit bullet points)
  4. **Detailed Description** (Formatted multi-paragraph copy)
  5. **Search Keywords & Tags** (Click-to-copy tags)
  6. **Social Media Caption** (Hook, CTA, hashtags)
- **Inline Editing & Full Control**: Every single generated section can be edited directly.
- **1-Click Copy & Multi-Format Export**: Copy individual fields, copy all as formatted Markdown, or download as `.md` or `.json`.
- **1-Click Realistic Example Presets**: Test immediately with preloaded examples (Artisan Ceramic Mug for Etsy, Eco Bamboo Charger for Amazon, Slim Leather Cardholder for Shopify).
- **Graceful Offline / Demo Mode**: Full interactive UI preview even before configuring external AI credentials.

---

## 🏗️ Architecture

```
ListingLab/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/         # Header, Form, Results, EditableField, SetupModal, Tips
│   │   ├── data/               # Realistic presets and demo engine
│   │   ├── services/           # Backend API integration (status, generate)
│   │   ├── types.ts            # Frontend TypeScript types
│   │   ├── App.tsx             # Root state coordinator
│   │   ├── main.tsx            # Vite entry point
│   │   └── index.css           # Tailwind CSS directives & custom styling
│   ├── tailwind.config.js      # Tailored modern color palette & typography
│   ├── vite.config.ts          # Vite configuration with /api proxy to server
│   └── package.json
│
├── server/                     # Backend API & AI Provider Module
│   ├── src/
│   │   ├── ai/
│   │   │   ├── providerInterface.ts       # IAIProvider contract
│   │   │   ├── openaiCompatibleProvider.ts# Generic adapter for open-weight models
│   │   │   ├── providerFactory.ts         # Singleton provider factory
│   │   │   ├── promptBuilder.ts           # Grounded prompt builder & platform rules
│   │   │   └── responseParser.ts          # Robust JSON parsing, fences & fallback text extractor
│   │   ├── middleware/
│   │   │   ├── validator.ts               # Zod input validation & abuse prevention
│   │   │   └── errorHandler.ts            # Unified JSON error handler
│   │   ├── routes/
│   │   │   ├── generate.ts                # POST /api/generate
│   │   │   └── status.ts                  # GET /api/status & health
│   │   ├── config.ts                      # Environment loader & provider defaults
│   │   ├── server.ts                      # Express application factory
│   │   └── index.ts                       # Server bootstrap
│   ├── tests/                             # Vitest unit test suite (validator, parser, prompts)
│   └── package.json
│
├── package.json                # Monorepo root scripts (concurrently dev & build)
├── .env.example                # Template of all environment variables
├── .gitignore                  # Excludes .env, build output, node_modules
└── README.md
```

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- **Node.js** >= 18.0.0 (Node 20+ or 22+ recommended)
- **npm** >= 9.0.0

### 2. Installation
Clone the repository and install dependencies:
```bash
# Clone the repository
git clone https://github.com/your-username/listinglab.git
cd listinglab

# Install root, client, and server dependencies in one command
npm run install:all
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(On Windows PowerShell: `Copy-Item .env.example .env`)*

Configure your chosen open-weight AI provider (see [AI Provider Options](#-open-weight-ai-provider-options) below).

### 4. Running the Development Server
Launch both backend (`localhost:3001`) and frontend (`localhost:5173`) concurrently:
```bash
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🤖 Open-Weight AI Provider Options

ListingLab is committed to open-weight AI. No closed-source API is required. You can choose between free cloud inference or completely local private inference:

### Option A: Groq Cloud (Recommended — Free, Fast Open-Weight Inference)
Groq provides a free tier with high token throughput for top open-weight models including **openai/gpt-oss-120b**:
1. Get a free API key at [console.groq.com/keys](https://console.groq.com/keys) (instant, no card required).
2. Set in your `.env`:
   ```env
   AI_PROVIDER=groq
   AI_MODEL=openai/gpt-oss-120b
   AI_BASE_URL=https://api.groq.com/openai/v1
   AI_API_KEY=gsk_your_groq_key_here
   ```

### Option B: Local Ollama (100% Free & Private)
Run open-weight models directly on your computer with zero external data transmission:
1. Download Ollama from [ollama.com](https://ollama.com).
2. Run your preferred model:
   ```bash
   ollama run llama3.2
   ```
3. Set in your `.env`:
   ```env
   AI_PROVIDER=ollama
   AI_MODEL=llama3.2
   AI_BASE_URL=http://localhost:11434/v1
   AI_API_KEY=ollama
   ```

### Option C: OpenRouter Free Open-Weight Tier
1. Obtain an OpenRouter key at [openrouter.ai](https://openrouter.ai).
2. Set in your `.env`:
   ```env
   AI_PROVIDER=openrouter
   AI_MODEL=meta-llama/llama-3.3-70b-instruct:free
   AI_BASE_URL=https://openrouter.ai/api/v1
   AI_API_KEY=sk-or-v1-your_openrouter_key
   ```

---

## ⚙️ Environment Variables Reference

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Backend HTTP server port |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin for the React frontend |
| `AI_PROVIDER` | `groq` | Provider selector (`groq`, `ollama`, `openrouter`, `huggingface`, `custom`) |
| `AI_MODEL` | `openai/gpt-oss-120b` | Open-weight model name |
| `AI_BASE_URL` | `https://api.groq.com/openai/v1` | OpenAI-compatible endpoint URL |
| `AI_API_KEY` | *(None)* | API token (kept server-side, never exposed to browser) |
| `AI_TIMEOUT_MS` | `45000` | Request timeout in milliseconds (45s) |

---

## 🧪 Testing & Quality Checks

ListingLab includes automated unit tests covering request validation, platform prompt construction, anti-hallucination instruction enforcement, and structured JSON parsing.

Run the test suite:
```bash
npm test
```

Run production builds for both client and server:
```bash
npm run build
```

---

## 🌐 Production Deployment Guide

ListingLab is ready for seamless deployment as a single-service full-stack app on Render, or as split frontend and backend services:

### Option 1: Single Render Web Service (Recommended)
Deploy both the React frontend and Node backend together on a single Render instance:
- **Service Type**: Web Service
- **Runtime**: Node
- **Root Directory**: *(leave blank — use repository root)*
- **Build Command**: `npm run render-build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `AI_PROVIDER`: `groq`
  - `AI_MODEL`: `openai/gpt-oss-120b`
  - `AI_BASE_URL`: `https://api.groq.com/openai/v1`
  - `AI_API_KEY`: Your secret Groq API key

*How it works in production:*
- The build command builds the client into `client/dist` and the backend into `server/dist`.
- Express automatically detects and serves the static production frontend from `client/dist`.
- Client requests hit `/api` on the same origin (no CORS or Vite proxy required).
- Non-API URLs safely fall back to `index.html` for React client-side routing.
- The server binds to `0.0.0.0` on Render's host-assigned `PORT`.
- All secret credentials stay strictly server-side.

### Option 2: Split Deployment (Vercel Frontend + Render Backend)
- **Frontend (Vercel / Cloudflare Pages)**:
  - Root directory: `client`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variable: `VITE_API_URL=https://your-backend.onrender.com`
- **Backend (Render Web Service)**:
  - Root directory: `server`
  - Build command: `npm run build`
  - Start command: `npm start`
  - Environment variables: `AI_API_KEY`, `CLIENT_ORIGIN=https://your-frontend.vercel.app`

*Free-Tier Consideration: Free-tier instances on Render spin down after 15 minutes of inactivity; allow ~30–50 seconds for cold-start wakeups on the first request.*

---

## 🔒 Security & Data Privacy

- **No Secrets in Frontend**: API keys are strictly loaded and accessed server-side.
- **Input Sanitization**: Request bodies are validated using Zod with payload size and string length constraints.
- **Privacy Notice**: Only the user-entered product details are forwarded to the inference endpoint. No user identifiers, cookies, or payment credentials are sent.

---

## 📜 License

MIT License © 2026 ListingLab contributors. Built for the Hacktoberfest 2026 Week 2 DEV Challenge ("Side Hustle").
