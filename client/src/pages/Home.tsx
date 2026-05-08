import { useNavigate } from 'react-router-dom';
import { Menu, PlusCircle } from 'lucide-react';
import type { Note } from '../types';
import { api } from '../api';
import './Home.css';

interface HomeProps {
  notes: Note[];
  onToggleSidebar: () => void;
  onNoteCreated: (note: Note) => void;
}

export default function Home({ notes, onToggleSidebar, onNoteCreated }: HomeProps) {
  const navigate = useNavigate();

  const handleCreateNew = async () => {
    try {
      const newNote = await api.createNote();
      onNoteCreated(newNote);
      navigate(`/notes/${newNote.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="home-container">
      <div className="home-topbar">
        <button className="icon-btn mobile-only" onClick={onToggleSidebar}>
          <Menu size={24} />
        </button>
        <h2 className="editorial-text home-title">All Notes</h2>
      </div>
      
      <div className="notes-grid">
        {notes.map(note => (
          <div key={note.id} className="note-card" onClick={() => navigate(`/notes/${note.id}`)}>
            <h3 className="note-card-title">{note.title || 'Untitled Note'}</h3>
            <p className="note-card-preview">
              {note.plainText ? note.plainText.substring(0, 120) + '...' : 'No content...'}
            </p>
            <span className="note-card-date">
              {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="empty-state">
            No notes yet. Create your first masterpiece.
          </div>
        )}
      </div>

      <button className="mobile-fab" onClick={handleCreateNew}>
        <PlusCircle size={24} />
      </button>
    </div>
  );
}
