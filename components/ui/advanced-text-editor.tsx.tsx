// components/ui/advanced-text-editor.tsx
"use client"

import React from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Youtube from '@tiptap/extension-youtube'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Youtube as YoutubeIcon,
  Highlighter,
  Type,
} from 'lucide-react'

// Import syntax highlighting languages
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import php from 'highlight.js/lib/languages/php'
import css from 'highlight.js/lib/languages/css'
import html from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import sql from 'highlight.js/lib/languages/sql'
import markdown from 'highlight.js/lib/languages/markdown'

// Create lowlight instance
const lowlight = createLowlight()

// Register languages with lowlight
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('python', python)
lowlight.register('java', java)
lowlight.register('cpp', cpp)
lowlight.register('php', php)
lowlight.register('css', css)
lowlight.register('html', html)
lowlight.register('json', json)
lowlight.register('bash', bash)
lowlight.register('sql', sql)
lowlight.register('markdown', markdown)

interface AdvancedTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [linkUrl, setLinkUrl] = React.useState('')
  const [imageUrl, setImageUrl] = React.useState('')
  const [imageAlt, setImageAlt] = React.useState('')
  const [youtubeUrl, setYoutubeUrl] = React.useState('')

  if (!editor) {
    return null
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
    }
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run()
      setImageUrl('')
      setImageAlt('')
    }
  }

  const addYoutube = () => {
    if (youtubeUrl) {
      editor.commands.setYoutubeVideo({
        src: youtubeUrl,
        width: 640,
        height: 480,
      })
      setYoutubeUrl('')
    }
  }

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <div className="border-b border-border p-2 flex flex-wrap items-center gap-1">
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('strike')}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('code')}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('highlight')}
          onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter className="h-4 w-4" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Headings */}
      <div className="flex items-center gap-1">
        <Select
          value={
            editor.isActive('heading', { level: 1 }) ? 'h1' :
            editor.isActive('heading', { level: 2 }) ? 'h2' :
            editor.isActive('heading', { level: 3 }) ? 'h3' :
            editor.isActive('paragraph') ? 'p' : ''
          }
          onValueChange={(value) => {
            if (value === 'h1') {
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            } else if (value === 'h2') {
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            } else if (value === 'h3') {
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            } else if (value === 'p') {
              editor.chain().focus().setParagraph().run()
            }
          }}
        >
          <SelectTrigger className="w-24 h-8">
            <SelectValue placeholder="Style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="p">
              <Type className="h-4 w-4 mr-2 inline" />
              Text
            </SelectItem>
            <SelectItem value="h1">
              <Heading1 className="h-4 w-4 mr-2 inline" />
              H1
            </SelectItem>
            <SelectItem value="h2">
              <Heading2 className="h-4 w-4 mr-2 inline" />
              H2
            </SelectItem>
            <SelectItem value="h3">
              <Heading3 className="h-4 w-4 mr-2 inline" />
              H3
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('blockquote')}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Code Block */}
      <div className="flex items-center gap-1">
        <Select
          value=""
          onValueChange={(language) => {
            if (language === 'remove') {
              editor.chain().focus().clearNodes().run()
            } else {
              editor.chain().focus().toggleCodeBlock({ language }).run()
            }
          }}
        >
          <SelectTrigger className="w-28 h-8">
            <SelectValue placeholder="Code" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="php">PHP</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="bash">Bash</SelectItem>
            <SelectItem value="sql">SQL</SelectItem>
            <SelectItem value="markdown">Markdown</SelectItem>
            <SelectItem value="remove">Remove Code</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Media */}
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <Label htmlFor="link-url">Add Link</Label>
              <Input
                id="link-url"
                placeholder="Enter URL..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <Button onClick={addLink} size="sm" className="w-full">
                Add Link
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <Label htmlFor="image-url">Add Image</Label>
              <Input
                id="image-url"
                placeholder="Image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Input
                placeholder="Alt text (optional)..."
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
              <Button onClick={addImage} size="sm" className="w-full">
                Add Image
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <YoutubeIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <Label htmlFor="youtube-url">Add YouTube Video</Label>
              <Input
                id="youtube-url"
                placeholder="YouTube URL..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              <Button onClick={addYoutube} size="sm" className="w-full">
                Add Video
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="sm"
          onClick={addTable}
        >
          <TableIcon className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function AdvancedTextEditor({
  content,
  onChange,
  placeholder = "Write something...",
  className = "",
}: AdvancedTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  })

  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <div className={`border border-border rounded-md bg-background ${className}`}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      
      {/* Add custom styles for the editor */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        
        .ProseMirror pre {
          background: hsl(var(--muted));
          color: hsl(var(--muted-foreground));
          font-family: 'JetBrains Mono', 'Menlo', 'Monaco', Consolas, 'Liberation Mono', 'Courier New', monospace;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        
        .ProseMirror pre code {
          color: inherit;
          padding: 0;
          background: none;
          font-size: 0.9em;
        }
        
        .ProseMirror code {
          background-color: hsl(var(--muted));
          color: hsl(var(--muted-foreground));
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.85em;
        }
        
        .ProseMirror blockquote {
          border-left: 4px solid hsl(var(--border));
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
        }
        
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1rem 0;
          overflow: hidden;
        }
        
        .ProseMirror table td,
        .ProseMirror table th {
          min-width: 1em;
          border: 1px solid hsl(var(--border));
          padding: 0.5rem;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        
        .ProseMirror table th {
          font-weight: bold;
          text-align: left;
          background-color: hsl(var(--muted));
        }
        
        .ProseMirror .tableWrapper {
          overflow-x: auto;
        }
        
        .ProseMirror .youtube-video {
          margin: 1rem 0;
        }
        
        .ProseMirror mark {
          background-color: yellow;
          color: black;
          padding: 0.1em 0.2em;
        }
        
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        
        .ProseMirror h1,
        .ProseMirror h2,
        .ProseMirror h3,
        .ProseMirror h4,
        .ProseMirror h5,
        .ProseMirror h6 {
          line-height: 1.2;
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        
        .ProseMirror h1 {
          font-size: 2.25rem;
        }
        
        .ProseMirror h2 {
          font-size: 1.875rem;
        }
        
        .ProseMirror h3 {
          font-size: 1.5rem;
        }
        
        .ProseMirror ul,
        .ProseMirror ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        
        .ProseMirror li {
          margin: 0.5rem 0;
        }
        
        .ProseMirror p {
          margin: 1rem 0;
          line-height: 1.6;
        }
        
        .ProseMirror a {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        
        .ProseMirror a:hover {
          text-decoration: none;
        }
      `}</style>
    </div>
  )
}