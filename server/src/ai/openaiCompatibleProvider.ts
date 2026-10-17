import { AIProviderConfig, ListingInput } from '../types.js';
import { GenerateResult, IAIProvider } from './providerInterface.js';
import { buildListingPrompt } from './promptBuilder.js';
import { parseAIResponse } from './responseParser.js';

export class OpenAICompatibleProvider implements IAIProvider {
  public readonly name: string;
  public readonly isLocal: boolean;
  public readonly model: string;
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeoutMs: number;

  constructor(config: AIProviderConfig) {
    this.name = `${config.provider} (${config.model})`;
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.isLocal = config.isLocal;
    this.timeoutMs = config.timeoutMs || 45000;
  }

  async generateListing(input: ListingInput): Promise<GenerateResult> {
    const { systemPrompt, userPrompt } = buildListingPrompt(input);

    const endpoint = `${this.baseUrl}/chat/completions`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey && this.apiKey.trim().length > 0) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const payload: any = {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 2048,
    };

    // Include response_format for models/providers that support JSON mode
    // (Groq, vLLM, Ollama support json_object)
    if (!this.name.toLowerCase().includes('huggingface')) {
      payload.response_format = { type: 'json_object' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(
          `AI request timed out after ${this.timeoutMs / 1000}s. The model '${this.model}' at ${this.baseUrl} took too long to respond. You can increase AI_TIMEOUT_MS in .env.`
        );
      }
      if (err.code === 'ECONNREFUSED' || err.message?.includes('fetch failed')) {
        if (this.isLocal) {
          throw new Error(
            `Could not connect to local AI endpoint at ${this.baseUrl}. Make sure Ollama or your local server is running (e.g. run 'ollama serve' and 'ollama run ${this.model}').`
          );
        }
        throw new Error(
          `Network connection failed while contacting inference endpoint ${this.baseUrl}. Check your internet connection or verify the endpoint URL.`
        );
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorText = await response.text();
      let providerDetail = '';

      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          providerDetail = errorJson.error.message;
        } else if (errorJson.message) {
          providerDetail = errorJson.message;
        }
      } catch {
        providerDetail = errorText.substring(0, 200);
      }

      let errorMsg = `Inference provider error (HTTP ${response.status})`;

      if (response.status === 401 || response.status === 403) {
        errorMsg = `Authentication failed with provider '${this.name}'. Please verify that your AI_API_KEY in .env is valid and active.`;
      } else if (response.status === 429) {
        errorMsg = `Rate limit exceeded on provider '${this.name}'. Please wait a moment before trying again or check your account quota.`;
      } else if (response.status === 404) {
        errorMsg = `Model '${this.model}' was not found at endpoint ${this.baseUrl}. The model may be deprecated, misspelled, or unavailable on your account tier. For Groq, use AI_MODEL=openai/gpt-oss-120b. Check active models at https://console.groq.com/docs/models.`;
      } else if (providerDetail) {
        // Redact any credential traces in error responses
        const sanitizedDetail = providerDetail
          .replace(/gsk_[a-zA-Z0-9_-]+/g, '[REDACTED_API_KEY]')
          .replace(/Bearer\s+[a-zA-Z0-9_\-\.]+/gi, 'Bearer [REDACTED]');
        errorMsg += `: ${sanitizedDetail}`;
      }

      throw new Error(errorMsg);
    }

    const data: any = await response.json();
    const messageContent = data.choices?.[0]?.message?.content;

    if (!messageContent) {
      throw new Error('AI provider returned an empty completion content.');
    }

    const listing = parseAIResponse(messageContent);

    return {
      listing,
      rawResponse: messageContent,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      } : undefined,
    };
  }

  async checkHealth(): Promise<{ healthy: boolean; message: string; details?: any }> {
    if (!this.isLocal && (!this.apiKey || this.apiKey.trim().length === 0)) {
      return {
        healthy: false,
        message: `API key not configured. Set AI_API_KEY in .env to connect to ${this.name}.`,
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      // Lightweight test: retrieve models or options
      const headers: Record<string, string> = {};
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const res = await fetch(`${this.baseUrl}/models`, {
        method: 'GET',
        headers,
        signal: controller.signal,
      }).catch(async () => {
        // Fallback for providers without /models endpoint
        return null;
      });

      clearTimeout(timeoutId);

      if (res && res.ok) {
        return {
          healthy: true,
          message: `Connected successfully to ${this.name}`,
        };
      }

      return {
        healthy: true,
        message: `Endpoint ${this.baseUrl} configured with model ${this.model}`,
      };
    } catch (err: any) {
      return {
        healthy: false,
        message: `Failed to reach ${this.baseUrl}: ${err.message}`,
      };
    }
  }
}
