'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  editable?: boolean;
}

export default function TiptapEditor({ content, onChange, onBlur, editable = true }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content,
    editable: editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur: () => {
      if (onBlur) onBlur();
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border-2 border-[#0A1128]/30 rounded-md overflow-hidden">
      {editable && (
        <div className="bg-[#0A1128]/5 border-b-2 border-[#0A1128]/30 p-2 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1 rounded text-sm font-bold ${
              editor.isActive('bold') ? 'bg-[#C5A572] text-white' : 'bg-white text-black hover:bg-[#0A1128]/10'
            }`}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1 rounded text-sm italic ${
              editor.isActive('italic') ? 'bg-[#C5A572] text-white' : 'bg-white text-black hover:bg-[#0A1128]/10'
            }`}
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-3 py-1 rounded text-sm underline ${
              editor.isActive('underline') ? 'bg-[#C5A572] text-white' : 'bg-white text-black hover:bg-[#0A1128]/10'
            }`}
          >
            U
          </button>
          <div className="w-px bg-[#0A1128]/30 mx-1"></div>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('bulletList') ? 'bg-[#C5A572] text-white' : 'bg-white text-black hover:bg-[#0A1128]/10'
            }`}
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('orderedList') ? 'bg-[#C5A572] text-white' : 'bg-white text-black hover:bg-[#0A1128]/10'
            }`}
          >
            1. List
          </button>
          <div className="w-px bg-[#0A1128]/30 mx-1"></div>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-[#C5A572] text-white' : 'bg-white text-black hover:bg-[#0A1128]/10'
            }`}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-[#C5A572] text-white' : 'bg-white text-black hover:bg-[#0A1128]/10'
            }`}
          >
            ↔
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-[#C5A572] text-white' : 'bg-white text-black hover:bg-[#0A1128]/10'
            }`}
          >
            →
          </button>
          <div className="w-px bg-[#0A1128]/30 mx-1"></div>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1 rounded text-sm font-bold ${
              editor.isActive('heading', { level: 2 }) ? 'bg-[#C5A572] text-white' : 'bg-white text-black hover:bg-[#0A1128]/10'
            }`}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1 rounded text-sm font-bold ${
              editor.isActive('heading', { level: 3 }) ? 'bg-[#C5A572] text-white' : 'bg-white text-black hover:bg-[#0A1128]/10'
            }`}
          >
            H3
          </button>
        </div>
      )}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 text-black min-h-[200px] focus:outline-none"
      />
    </div>
  );
}
