import type { GenerateApiResponse, ListingFormData, ModelStatus } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)
  ? `${(import.meta.env.VITE_API_URL as string).replace(/\/+$/, '')}/api`
  : '/api';

export class ApiError extends Error {
  public details?: any;
  public status?: number;
  public instructions?: string[];

  constructor(message: string, status?: number, details?: any, instructions?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.instructions = instructions;
  }
}

export async function fetchModelStatus(): Promise<ModelStatus> {
  try {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    return {
      ready: false,
      configured: false,
      provider: 'unknown',
      model: 'unknown',
      endpoint: '',
      isLocal: false,
      message: `Backend server unreachable: ${err.message}. Make sure the Node server is running on port 3001.`,
    };
  }
}

export async function generateListing(input: ListingFormData): Promise<GenerateApiResponse> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data.message || data.error || `Generation failed (HTTP ${res.status})`;
    throw new ApiError(message, res.status, data.details, data.instructions);
  }

  return data as GenerateApiResponse;
}
