const API_URL = 'http://localhost:3001/api';

export const api = {
  getUser: async () => {
    const res = await fetch(`${API_URL}/user`);
    return res.json();
  },
  updateUser: async (data: { name: string; email: string }) => {
    const res = await fetch(`${API_URL}/user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  getProgress: async () => {
    const res = await fetch(`${API_URL}/progress`);
    return res.json();
  },
  saveSession: async (session: { title: string; tag: string; duration: number; points: number }) => {
    const res = await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    });
    return res.json();
  },
  getQuotes: async () => {
    const res = await fetch(`${API_URL}/quotes`);
    return res.json();
  },
  saveQuote: async (quote: { text: string; author: string }) => {
    const res = await fetch(`${API_URL}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote)
    });
    return res.json();
  },
  deleteQuote: async (id: number) => {
    const res = await fetch(`${API_URL}/quotes/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};
