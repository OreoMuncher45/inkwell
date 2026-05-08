import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Initialize DB if it doesn't exist
async function initDb() {
  try {
    await fs.access(DB_PATH);
  } catch (error) {
    await fs.writeFile(DB_PATH, JSON.stringify({ notes: [], tags: [] }, null, 2));
  }
}

async function readDb() {
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

async function writeDb(data: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// API Routes
app.get('/api/notes', async (req, res) => {
  const db = await readDb();
  res.json(db.notes.filter((n: any) => !n.isDeleted).sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
});

app.get('/api/notes/:id', async (req, res) => {
  const db = await readDb();
  const note = db.notes.find((n: any) => n.id === req.params.id);
  if (note && !note.isDeleted) {
    res.json(note);
  } else {
    res.status(404).json({ error: 'Note not found' });
  }
});

app.post('/api/notes', async (req, res) => {
  const db = await readDb();
  const newNote = {
    id: uuidv4(),
    title: req.body.title || 'New Note',
    content: req.body.content || '',
    plainText: req.body.plainText || '',
    tags: req.body.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPinned: false,
    isDeleted: false,
  };
  db.notes.push(newNote);
  await writeDb(db);
  res.status(201).json(newNote);
});

app.put('/api/notes/:id', async (req, res) => {
  const db = await readDb();
  const index = db.notes.findIndex((n: any) => n.id === req.params.id);
  if (index !== -1) {
    db.notes[index] = {
      ...db.notes[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    await writeDb(db);
    res.json(db.notes[index]);
  } else {
    res.status(404).json({ error: 'Note not found' });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  const db = await readDb();
  const index = db.notes.findIndex((n: any) => n.id === req.params.id);
  if (index !== -1) {
    db.notes[index].isDeleted = true;
    db.notes[index].updatedAt = new Date().toISOString();
    await writeDb(db);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Note not found' });
  }
});

// Serve static files from the React app
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

// Catch-all route for SPA
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server
initDb().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`To access from your local network, find your IP and use http://<your-ip>:${PORT}`);
  });
});
