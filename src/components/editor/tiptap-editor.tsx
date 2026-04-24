"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { VersePicker } from './verse-picker'

interface MenuBarProps {
  editor: ReturnType<typeof useEditor> | null
  onVerseSelect?: (verse: { reference: string; text: string; version: string }) => void
}

const MenuBar = ({ editor, onVerseSelect }: MenuBarProps) => {
  if (!editor) return null

  return (
    <div className="border border-slate-200 bg-slate-50 rounded-t-2xl p-1.5 flex flex-wrap gap-1 items-center border-b-0">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn(
          "p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-500",
          editor.isActive('bold') && "bg-white text-blue-600 shadow-sm"
        )}
        title="Gras"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(
          "p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-500",
          editor.isActive('italic') && "bg-white text-blue-600 shadow-sm"
        )}
        title="Italique"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={cn(
          "p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-500",
          editor.isActive('strike') && "bg-white text-blue-600 shadow-sm"
        )}
        title="Barré"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-slate-200 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(
          "p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-500",
          editor.isActive('heading', { level: 1 }) && "bg-white text-blue-600 shadow-sm"
        )}
        title="Titre 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          "p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-500",
          editor.isActive('heading', { level: 2 }) && "bg-white text-blue-600 shadow-sm"
        )}
        title="Titre 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-slate-200 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-500",
          editor.isActive('bulletList') && "bg-white text-blue-600 shadow-sm"
        )}
        title="Liste à puces"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-500",
          editor.isActive('orderedList') && "bg-white text-blue-600 shadow-sm"
        )}
        title="Liste numérotée"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn(
          "p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-500",
          editor.isActive('blockquote') && "bg-white text-blue-600 shadow-sm"
        )}
        title="Citation"
      >
        <Quote className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-slate-200 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-400 disabled:opacity-30"
        title="Annuler"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-400 disabled:opacity-30"
        title="Rétablir"
      >
        <Redo className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-slate-200 mx-1" />
      <VersePicker onVerseSelect={onVerseSelect} />
    </div>
  )
}

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  onVerseSelect?: (verse: { reference: string; text: string; version: string }) => void
}

export function TiptapEditor({ content, onChange, placeholder = "Écrivez ici...", className, onVerseSelect }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content,
    immediatelyRender: false, // Avoid SSR hydration mismatches
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-slate prose-sm sm:prose-base max-w-none focus:outline-none min-h-[150px] px-6 py-5 bg-white text-slate-800",
          className
        ),
      },
    },
  })

  const handleVerseSelect = (verse: { reference: string; text: string; version: string }) => {
    if (editor) {
      // Insère le verset formaté sans espaces inutiles
      const verseHTML = `<blockquote class="verse-block"><p class="verse-text">« ${verse.text.trim()} »</p><p class="verse-reference">— ${verse.reference} (${verse.version})</p></blockquote><p></p>`
      editor.chain().focus().insertContent(verseHTML).run()
    }
    onVerseSelect?.(verse)
  }

  return (
    <div className="w-full flex flex-col">
      <MenuBar editor={editor} onVerseSelect={handleVerseSelect} />
      <EditorContent editor={editor} />
    </div>
  )
}
