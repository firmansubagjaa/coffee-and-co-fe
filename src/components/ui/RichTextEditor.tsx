import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Undo, Redo } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ 
    onClick, 
    isActive = false, 
    disabled = false,
    children 
}) => (
    <button
        type="button"
        onClick={(e) => { e.preventDefault(); onClick(); }}
        disabled={disabled}
        className={cn(
            "p-2 rounded-lg hover:bg-coffee-100 dark:hover:bg-coffee-700 text-coffee-700 dark:text-coffee-300 transition-colors",
            isActive && "bg-coffee-200 dark:bg-coffee-600 text-coffee-900 dark:text-coffee-100 font-bold",
            disabled && "opacity-50 cursor-not-allowed"
        )}
    >
        {children}
    </button>
);

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, className }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
        attributes: {
            class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none min-h-[200px] p-4 text-coffee-900 dark:text-coffee-100'
        }
    }
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("border border-coffee-200 dark:border-coffee-700 rounded-xl overflow-hidden bg-white dark:bg-coffee-900", className)}>
      <div className="flex flex-wrap gap-1 p-2 bg-coffee-50 dark:bg-coffee-800 border-b border-coffee-100 dark:border-coffee-700">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-coffee-200 dark:bg-coffee-600 mx-1 self-center" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-coffee-200 dark:bg-coffee-600 mx-1 self-center" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-coffee-200 dark:bg-coffee-600 mx-1 self-center" />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};