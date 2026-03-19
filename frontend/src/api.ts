import type { ChatMessage } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';
const REQUEST_TIMEOUT_MS = 30000;

interface ChatResponse {
  reply: string;
}

function isValidChatResponse(data: unknown): data is ChatResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'reply' in data &&
    typeof (data as ChatResponse).reply === 'string'
  );
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  signal?: AbortSignal,
): Promise<ChatResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const combinedSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;

  try {
    const response = await fetch(API_BASE + '/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: history.map((item) => ({
          role: item.role,
          content: item.content,
        })),
      }),
      signal: combinedSignal,
    });

    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }

    const data: unknown = await response.json();

    if (!isValidChatResponse(data)) {
      throw new Error('Invalid response format from server');
    }

    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}
