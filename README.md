# ListingLab

**AI-powered product listing generator for online sellers and side hustlers.**

Turn basic product details into editable, platform-specific e-commerce listings using configurable AI models.

**[Live Demo](https://listinglab-lnle.onrender.com/)** · **[GitHub Repository](https://github.com/Tanmaypatil-25/ListingLab)** · **[Report an Issue](https://github.com/Tanmaypatil-25/ListingLab/issues)**

## Overview

ListingLab helps independent sellers, small businesses, crafters, and entrepreneurs create product listings for marketplaces such as Shopify, Etsy, Amazon, eBay, and WooCommerce.

Enter your product details, select a target platform, and generate listing content that you can review, edit, copy, and export.

Built for the **DEV Challenge: Hacktoberfest 2026 — Week 2, Side Hustle.**

## Features

- **Platform-specific generation:** Adapts listing content and tone to the selected marketplace.
- **Complete listing output:** Generates a product title, short description, five selling points, detailed description, search tags, and a social media caption.
- **Grounded product descriptions:** Instructs the AI to use supplied product information and avoid inventing specifications or unsupported claims.
- **Inline editing:** Modify generated content before using it.
- **Copy and export:** Copy individual sections or the complete listing and export results as Markdown or JSON.
- **Example presets:** Try the application with sample products.
- **Demo mode:** Explore the interface without configuring a live AI provider.
- **Configurable AI providers:** Supports configured OpenAI-compatible inference endpoints, including Groq and local Ollama.
- **Input validation:** Validates requests and handles generation errors.

## Tech Stack

| Component | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Validation | Zod |
| AI integration | OpenAI-compatible API adapter |
| AI inference | Groq (`openai/gpt-oss-120b`) and compatible alternatives |
| Testing | Vitest |
| Deployment | Render |

## Project Structure

```text
ListingLab/
├── client/
│   └── src/
│       ├── components/
│       ├── data/
│       ├── services/
│       ├── App.tsx
│       └── types.ts
├── server/
│   ├── src/
│   │   ├── ai/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── config.ts
│   │   ├── server.ts
│   │   └── index.ts
│   └── tests/
├── package.json
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm 9 or later
- An API key for a supported AI provider, or a local Ollama installation

### 1. Clone the repository

```bash
git clone https://github.com/Tanmaypatil-25/ListingLab.git
cd ListingLab
```

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Configure environment variables

Create a `.env` file from the example.

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux**

```bash
cp .env.example .env
```

For Groq, configure the following values in `.env`:

```env
PORT=3001
CLIENT_ORIGIN=http://localhost:5173

AI_PROVIDER=groq
AI_MODEL=openai/gpt-oss-120b
AI_BASE_URL=https://api.groq.com/openai/v1
AI_API_KEY=your_groq_api_key
AI_TIMEOUT_MS=45000
```

Get an API key from the [Groq Console](https://console.groq.com/keys).

**Never commit your actual `.env` file or expose your API key in frontend code.**

### 4. Run the application

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## AI Provider Configuration

### Groq

Set the provider, model, API base URL, and API key in `.env` as shown above. Model availability and rate limits depend on Groq.

### Local Ollama

Install [Ollama](https://ollama.com/) and download a compatible model:

```bash
ollama run llama3.2
```

Configure `.env` for local inference:

```env
AI_PROVIDER=ollama
AI_MODEL=llama3.2
AI_BASE_URL=http://localhost:11434/v1
AI_API_KEY=ollama
```

Ensure the Ollama service is running and accessible to the backend.

Other providers may work if their endpoints, authentication, model identifiers, and response formats are compatible with the configured adapter.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Checks backend health |
| `GET` | `/api/status` | Returns sanitized provider configuration status |
| `POST` | `/api/generate` | Validates product input and generates a listing |

Refer to the server source code for request and response schemas.

## Testing and Build

Run the automated tests:

```bash
npm test
```

Build the frontend and backend:

```bash
npm run build
```

Tests cover input validation, prompt construction, response parsing, and provider configuration and error handling.

## Deployment

ListingLab is deployed on Render:

**[Open the Live Application](https://listinglab-lnle.onrender.com/)**

To deploy your own instance:

1. Connect your GitHub repository to Render.
2. Create a Web Service using the repository root as the root directory.
3. Set the build command to `npm run render-build`.
4. Set the start command to `npm start`.
5. Configure the required AI environment variables in Render.
6. Deploy and verify the application, API health endpoint, and actual AI generation.

The production server serves the built frontend and API from the same origin.

## Security and Limitations

- API credentials should remain server-side.
- Incoming requests are validated before processing.
- AI-generated content may contain inaccurate information. Review product details and claims before publishing.
- Provider availability, rate limits, and usage costs depend on the selected service.
- Free hosting may introduce cold starts or usage restrictions.

## Contributing

Contributions, bug reports, and feature suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and add tests where appropriate.
4. Run the test suite and production build.
5. Open a pull request describing your changes.

## License

This project is licensed under the MIT License. See the [`LICENSE`](https://github.com/Tanmaypatil-25/ListingLab/blob/main/LICENSE) file for details.
