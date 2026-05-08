import type { Note } from './types';

const API_BASE = '/api';

export const api = {
  async getNotes(): Promise<Note[]> {
    const res = await fetch(`${API_BASE}/notes`);
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
  },

  async getNote(id: string): Promise<Note> {
    const res = await fetch(`${API_BASE}/notes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch note');
    return res.json();
  },

  async createNote(note?: Partial<Note>): Promise<Note> {
    const res = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note || {}),
    });
    if (!res.ok) throw new Error('Failed to create note');
    return res.json();
  },

  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update note');
    return res.json();
  },

  async deleteNote(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/notes/${id}`);
    if (!res.ok) throw new Error('Failed to delete note');
  }
};
