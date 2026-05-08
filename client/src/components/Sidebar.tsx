import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PlusCircle, Search, Settings, X } from 'lucide-react';
import { api } from '../api';
import type { Note } from '../types';
import './Sidebar.css';

interface SidebarProps {
  notes: Note[];
  onNoteCreated: (note: Note) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ notes, onNoteCreated, isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateNote = async () => {
    try {
      const newNote = await api.createNote();
      onNoteCreated(newNote);
      navigate(`/notes/${newNote.id}`);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredNotes = notes.filter(note => 
    (note.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (note.plainText || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Inkwell</h2>
          <div className="sidebar-actions">
            <button className="icon-btn" onClick={onClose} style={{ marginRight: '8px' }}>
              <X size={20} className="mobile-only" />
            </button>
            <button className="icon-btn" onClick={handleCreateNote}>
              <PlusCircle size={20} />
            </button>
          </div>
        </div>
        
        <div className="sidebar-search">
          <div className="search-box">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="notes-list">
          {filteredNotes.map(note => (
            <Link 
              key={note.id} 
              to={`/notes/${note.id}`}
              className={`note-item ${id === note.id ? 'active' : ''}`}
              onClick={onClose}
            >
              <div className="note-item-title">{note.title || 'Untitled Note'}</div>
              <div className="note-item-preview">
                {note.plainText ? note.plainText.substring(0, 80) : 'No content...'}
              </div>
              <div className="note-item-date">
                {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
            </Link>
          ))}
          {notes.length > 0 && filteredNotes.length === 0 && (
            <div className="empty-notes">
              No notes match your search.
            </div>
          )}
          {notes.length === 0 && (
            <div className="empty-notes">
              No notes yet. Click the + button to create one.
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <button className="nav-btn">
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </div>
      <div className="sidebar-overlay" onClick={onClose} />
    </>
  );
}
