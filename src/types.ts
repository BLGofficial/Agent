export interface Role {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
  openingMessage: string;
  createdAt: number;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}
