import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { sendChatMessage } from './api';
import { defaultTheme, themes } from './themes';
import type { ChatMessage } from './types';

function createId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const initialMessages: ChatMessage[] = [
  {
    id: createId(),
    role: 'assistant',
    content: 'webIterm mock session ready.\nType a prompt below to talk to the AI backend.',
  },
];

function splitLines(content: string) {
  return content.split('\n');
}

function getPromptMeta(role: ChatMessage['role']) {
  if (role === 'assistant') {
    return {
      host: 'ai@mock',
      cwd: '/reply',
      symbol: '>',
    };
  }

  return {
    host: 'qunsclaw@webiterm',
    cwd: '~',
    symbol: '$',
  };
}

const CHARS_PER_FRAME = 3;
const FRAME_INTERVAL_MS = 16;

export default function App() {
  const [themeId, setThemeId] = useState(defaultTheme.id);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const terminalBodyRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const theme = themes.find((item) => item.id === themeId) || defaultTheme;
  const isBusy = isFetching || streamingId !== null;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--panel', theme.panel);
    root.style.setProperty('--panel-glow', theme.panelGlow);
    root.style.setProperty('--title-bar', theme.titleBar);
    root.style.setProperty('--text', theme.text);
    root.style.setProperty('--muted', theme.muted);
    root.style.setProperty('--prompt', theme.prompt);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--selection', theme.selection);
    root.style.colorScheme = theme.mode;
  }, [theme]);

  useEffect(() => {
    const body = terminalBodyRef.current;

    if (body) {
      body.scrollTo({
        top: body.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isFetching, streamingId]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const streamAssistantReply = useCallback((fullReply: string) => {
    return new Promise<void>((resolve) => {
      const replyId = createId();
      setStreamingId(replyId);
      setMessages((current) =>
        current.concat({
          id: replyId,
          role: 'assistant',
          content: '',
        }),
      );

      let charIndex = 0;

      function tick() {
        charIndex = Math.min(charIndex + CHARS_PER_FRAME, fullReply.length);
        const partial = fullReply.slice(0, charIndex);

        setMessages((current) =>
          current.map((message) =>
            message.id === replyId
              ? { ...message, content: partial }
              : message,
          ),
        );

        if (charIndex < fullReply.length) {
          requestAnimationFrame(tick);
        } else {
          setStreamingId(null);
          resolve();
        }
      }

      window.setTimeout(() => {
        requestAnimationFrame(tick);
      }, FRAME_INTERVAL_MS);
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = input.trim();

    if (!trimmed || isBusy) {
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const userMessage: ChatMessage = {
      id: createId(),
      role: 'user',
      content: trimmed,
    };

    const nextMessages = messages.concat(userMessage);
    setMessages(nextMessages);
    setInput('');
    setIsFetching(true);

    try {
      const data = await sendChatMessage(
        trimmed,
        nextMessages,
        abortControllerRef.current.signal,
      );
      setIsFetching(false);
      await streamAssistantReply(data.reply);
    } catch (error) {
      setIsFetching(false);
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      setMessages((current) =>
        current.concat({
          id: createId(),
          role: 'assistant',
          content: 'Request failed.\n' + message,
        }),
      );
    } finally {
      inputRef.current?.focus();
    }
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <main className="terminal-frame">
        <header className="terminal-titlebar">
          <div className="window-controls" aria-hidden="true">
            <span className="control control-close" />
            <span className="control control-minimize" />
            <span className="control control-maximize" />
          </div>

          <div className="title-block">
            <p className="title">webIterm</p>
            <p className="subtitle">AI terminal session</p>
          </div>

          <label className="theme-switcher">
            <span>Theme</span>
            <select value={themeId} onChange={(event) => setThemeId(event.target.value)}>
              {themes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </header>

        <section className="terminal-body" ref={terminalBodyRef} onClick={() => inputRef.current?.focus()}>
          <div className="session-meta">
            <span className="badge">session</span>
            <span className="path">~/workspace/webIterm</span>
            <span className="separator">|</span>
            <span className="status">fastapi mock online</span>
          </div>

          <div className="message-stack">
            {messages.map((message) => {
              const prompt = getPromptMeta(message.role);

              return (
                <article key={message.id} className={['message-row', message.role].join(' ')}>
                  <div className="prompt-block">
                    <span className="prompt-user">{prompt.host}</span>
                    <span className="prompt-separator">:</span>
                    <span className="prompt-path">{prompt.cwd}</span>
                    <span className="prompt-symbol">{prompt.symbol}</span>
                  </div>

                  <div className="message-output">
                    {splitLines(message.content).map((line, lineIndex) => (
                      <p key={message.id + '-' + lineIndex} className="output-line">
                        {line || ' '}
                      </p>
                    ))}
                    {streamingId === message.id ? <span className="cursor" aria-hidden="true" /> : null}
                  </div>
                </article>
              );
            })}

            {isFetching ? (
              <article className="message-row assistant pending">
                <div className="prompt-block">
                  <span className="prompt-user">ai@mock</span>
                  <span className="prompt-separator">:</span>
                  <span className="prompt-path">/reply</span>
                  <span className="prompt-symbol">&gt;</span>
                </div>

                <div className="message-output typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              </article>
            ) : null}
          </div>
        </section>

        <form className="input-shell" onSubmit={handleSubmit}>
          <label className="terminal-input-line">
            <span className="prompt-user">qunsclaw@webiterm</span>
            <span className="prompt-separator">:</span>
            <span className="prompt-path">~</span>
            <span className="prompt-symbol">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder='ask ai --prompt "Design a deployment plan"'
              aria-label="Terminal input"
              autoComplete="off"
              spellCheck={false}
              disabled={isBusy}
            />
          </label>
        </form>
      </main>
    </div>
  );
}
