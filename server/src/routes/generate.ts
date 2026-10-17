import { Router, Request, Response, NextFunction } from 'express';
import { validateListingRequest } from '../middleware/validator.js';
import { getAIProvider } from '../ai/providerFactory.js';
import { config, hasValidCredentials } from '../config.js';
import { ListingInput } from '../types.js';

const router = Router();

router.post('/', validateListingRequest, async (req: Request, res: Response, next: NextFunction) => {
  const input = req.body as ListingInput;

  // Check if provider requires credentials that aren't configured
  if (!hasValidCredentials()) {
    res.status(503).json({
      success: false,
      error: 'AI Provider Not Configured',
      message: `The AI provider "${config.ai.provider}" requires an API key, which is not set in your environment.`,
      instructions: [
        '1. Get a free API key for Groq at https://console.groq.com/keys (instant, no card needed).',
        '2. Add AI_API_KEY=your_key to your .env file.',
        '3. Or run Ollama locally with "ollama run llama3.2" and set AI_PROVIDER=ollama in your .env file.',
      ],
      currentProvider: config.ai.provider,
      currentModel: config.ai.model,
    });
    return;
  }

  const startTime = Date.now();
  const provider = getAIProvider();

  try {
    const result = await provider.generateListing(input);
    const durationMs = Date.now() - startTime;

    res.json({
      success: true,
      data: result.listing,
      metadata: {
        provider: config.ai.provider,
        model: config.ai.model,
        isLocal: config.ai.isLocal,
        platform: input.sellingPlatform,
        executionTimeMs: durationMs,
        usage: result.usage,
      },
    });
  } catch (err: any) {
    next(err);
  }
});

export default router;
