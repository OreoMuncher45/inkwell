import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import NoteEditor from './pages/NoteEditor';
import { api } from './api';
import type { Note } from './types';
import './index.css';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadNotes();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await api.getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Failed to load notes', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleNoteCreated = (newNote: Note) => {
    setNotes(prev => [newNote, ...prev]);
  };

  const handleNoteUpdated = (updatedNote: Note) => {
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  };

  const handleNoteDeleted = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1 className="editorial-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Inkwell</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            Capture your thoughts in an editorial masterpiece.
          </p>
          <button className="login-btn" onClick={handleLogin}>
            <LogIn size={20} style={{ marginRight: '10px' }} />
            Sign in with Google
          </button>
          <button 
            className="nav-btn" 
            style={{ marginTop: '1rem', justifyContent: 'center' }}
            onClick={() => setUser({ email: 'guest@local' } as any)}
          >
            Continue as Guest (Local Only)
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar 
          notes={notes} 
          onNoteCreated={handleNoteCreated} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <Routes>
          <Route path="/" element={
            <Home 
              notes={notes} 
              onToggleSidebar={() => setIsSidebarOpen(true)}
              onNoteCreated={handleNoteCreated}
            />
          } />
          <Route path="/notes/:id" element={
            <NoteEditor 
              onNoteUpdated={handleNoteUpdated}
              onNoteDeleted={handleNoteDeleted}
              onToggleSidebar={() => setIsSidebarOpen(true)}
            />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
