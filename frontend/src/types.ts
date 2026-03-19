export type Role = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
}

export interface Theme {
  id: string;
  name: string;
  mode: 'light' | 'dark';
  background: string;
  panel: string;
  panelGlow: string;
  titleBar: string;
  text: string;
  muted: string;
  prompt: string;
  accent: string;
  border: string;
  selection: string;
}
