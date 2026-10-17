import { Router, Request, Response } from 'express';
import { config, hasValidCredentials } from '../config.js';
import { getAIProvider } from '../ai/providerFactory.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const configured = hasValidCredentials();
  const provider = getAIProvider();

  let healthMessage = 'Configured and ready.';
  let isReady = configured;

  if (!configured) {
    healthMessage = `Missing API Key for remote provider "${config.ai.provider}". To enable open-weight AI generation, set AI_API_KEY in your .env file or switch to local Ollama.`;
  } else {
    try {
      const health = await provider.checkHealth();
      if (!health.healthy) {
        isReady = false;
        healthMessage = health.message;
      }
    } catch (err: any) {
      healthMessage = `Health check warning: ${err.message}`;
    }
  }

  res.json({
    ready: isReady,
    configured,
    provider: config.ai.provider,
    model: config.ai.model,
    endpoint: config.ai.baseUrl,
    isLocal: config.ai.isLocal,
    message: healthMessage,
    instructions: configured
      ? `Active model: ${config.ai.model} via ${config.ai.provider} (${config.ai.isLocal ? 'Local Inference' : 'Cloud Endpoint'}).`
      : `To connect an open-weight model for free:\n1. Get a free Groq API key at https://console.groq.com/keys\n2. Add AI_API_KEY=your_key to your .env file\n3. Restart the server. Alternatively, run Ollama locally: 'ollama run llama3.2' and set AI_PROVIDER=ollama.`,
  });
});

export default router;
