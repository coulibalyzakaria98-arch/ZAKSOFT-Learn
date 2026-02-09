import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { getFunctions, httpsCallable } from 'firebase/functions';

// A basic toolbar for the editor
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="menu-bar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        Paragraph
      </button>
    </div>
  );
};

const SmartNotes = ({ chapterId, initialContent = '' }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
  });

  const handleSave = async () => {
    if (!editor) return;

    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    const functions = getFunctions();
    const saveNote = httpsCallable(functions, 'saveNote');
    const content = editor.getHTML();

    try {
      const result = await saveNote({ chapterId, content });
      if (result.data.success) {
        setSaveSuccess(true);
      } else {
        setError('Failed to save note.');
      }
    } catch (err) {
      console.error('Error saving note:', err);
      setError('An error occurred while saving the note.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3s
    }
  };

  return (
    <div className="smart-notes-container">
      <h3>Mes Notes Personnelles</h3>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <div className="save-button-container">
        <button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Note'}
        </button>
        {saveSuccess && <span className="save-success">Note saved!</span>}
        {error && <span className="save-error">{error}</span>}
      </div>
    </div>
  );
};

export default SmartNotes;