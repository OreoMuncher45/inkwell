import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2, Menu, MoreHorizontal } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { api } from '../api';
import type { Note } from '../types';
import './NoteEditor.css';

interface NoteEditorProps {
  onNoteUpdated: (note: Note) => void;
  onNoteDeleted: (id: string) => void;
  onToggleSidebar: () => void;
}

export default function NoteEditor({ onNoteUpdated, onNoteDeleted, onToggleSidebar }: NoteEditorProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (id) {
      loadNote(id);
    }
  }, [id]);

  const loadNote = async (noteId: string) => {
    setLoading(true);
    try {
      const fetchedNote = await api.getNote(noteId);
      setNote(fetchedNote);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const triggerAutoSave = (updatedNote: Note) => {
    setSaving(true);
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const savedNote = await api.updateNote(updatedNote.id, updatedNote);
        onNoteUpdated(savedNote);
        setSaving(false);
      } catch (error) {
        console.error('Failed to auto-save', error);
        setSaving(false);
      }
    }, 1500);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!note) return;
    const newTitle = e.target.value;
    const updated = { ...note, title: newTitle };
    setNote(updated);
    triggerAutoSave(updated);
  };

  const handleContentChange = (content: string, _delta: any, _source: any, editor: any) => {
    if (!note) return;
    const plainText = editor.getText();
    const updated = { ...note, content, plainText };
    setNote(updated);
    triggerAutoSave(updated);
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            
            const quill = quillRef.current?.getEditor();
            if (quill) {
              const range = quill.getSelection();
              if (range) {
                quill.insertEmbed(range.index, 'image', compressedBase64);
              }
            }
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: '#custom-toolbar',
      handlers: {
        image: imageHandler,
      },
    },
  }), []);

  const handleDelete = async () => {
    if (!note) return;
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await api.deleteNote(note.id);
        onNoteDeleted(note.id);
        navigate('/');
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  if (loading) return <div className="editor-container loading">Loading...</div>;
  if (!note) return <div className="editor-container loading">Note not found.</div>;

  return (
    <div className="editor-container">
      <div className="editor-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="icon-btn mobile-only" onClick={onToggleSidebar}>
            <Menu size={20} />
          </button>
          <div className="save-status">
            {saving ? 'Saving...' : 'Saved'}
          </div>
        </div>
        <button className="icon-btn" onClick={handleDelete} title="Delete Note">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="editor-content-wrapper">
        <input 
          type="text" 
          className="editor-title editorial-text" 
          placeholder="Note Title" 
          value={note.title}
          onChange={handleTitleChange}
        />
        
        <ReactQuill 
          ref={quillRef}
          theme="snow"
          value={note.content}
          onChange={handleContentChange}
          modules={modules}
          placeholder="Start writing your masterpiece..."
          className="advanced-editor"
        />
      </div>

      <div id="custom-toolbar" className={`bottom-toolbar ${showAdvanced ? 'show-advanced' : ''}`}>
        <div className="toolbar-main">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button type="button" className="toolbar-toggle-btn" onClick={() => setShowAdvanced(!showAdvanced)}>
            <MoreHorizontal size={20} />
          </button>
        </div>
        
        <div className="toolbar-advanced">
          <button className="ql-strike" />
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
          <button className="ql-blockquote" />
          <button className="ql-code-block" />
          <button className="ql-link" />
          <button className="ql-image" />
          <select className="ql-header" defaultValue="">
            <option value="1" />
            <option value="2" />
            <option value="3" />
            <option value="" />
          </select>
        </div>
      </div>
    </div>
  );
}
