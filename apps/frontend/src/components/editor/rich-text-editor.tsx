'use client'

import { useState, useEffect, useRef } from 'react'
import { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { useEditor, EditorContent } from '@tiptap/react'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Code,
  Image as ImageIcon, 
  Link as LinkIcon,
  Undo,
  Redo
} from 'lucide-react'

interface RichTextEditorProps {
  initialValue?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ 
  initialValue = '', 
  onChange, 
  placeholder = '开始编写文章内容...' 
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [showImageForm, setShowImageForm] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const linkFormRef = useRef<HTMLDivElement>(null)
  const imageFormRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-md max-w-full h-auto my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
  })

  // 点击外部关闭弹出表单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        linkFormRef.current && 
        !linkFormRef.current.contains(event.target as Node) &&
        showLinkForm
      ) {
        setShowLinkForm(false)
      }

      if (
        imageFormRef.current && 
        !imageFormRef.current.contains(event.target as Node) &&
        showImageForm
      ) {
        setShowImageForm(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLinkForm, showImageForm])

  if (!editor) {
    return null
  }

  const addLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run()

      setLinkUrl('')
      setShowLinkForm(false)
    }
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
      setShowImageForm(false)
    }
  }

  const toolbarItems = [
    {
      icon: <Bold size={18} />,
      title: '加粗',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      icon: <Italic size={18} />,
      title: '斜体',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: <Heading1 size={18} />,
      title: '标题1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      icon: <Heading2 size={18} />,
      title: '标题2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: <List size={18} />,
      title: '无序列表',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      icon: <ListOrdered size={18} />,
      title: '有序列表',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      icon: <Quote size={18} />,
      title: '引用',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
    {
      icon: <Code size={18} />,
      title: '代码',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
    },
    {
      icon: <LinkIcon size={18} />,
      title: '链接',
      action: () => setShowLinkForm(true),
      isActive: editor.isActive('link'),
    },
    {
      icon: <ImageIcon size={18} />,
      title: '图片',
      action: () => setShowImageForm(true),
      isActive: false,
    },
    {
      icon: <Undo size={18} />,
      title: '撤销',
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
    },
    {
      icon: <Redo size={18} />,
      title: '重做',
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
    },
  ]

  return (
    <div className="rich-text-editor relative">
      <div className="toolbar sticky top-0 z-10 flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {toolbarItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            title={item.title}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              item.isActive ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}
            type="button"
          >
            {item.icon}
          </button>
        ))}
      </div>

      {showLinkForm && (
        <div 
          ref={linkFormRef}
          className="absolute top-12 left-0 z-20 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg flex"
        >
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="输入URL链接..."
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={addLink}
            className="px-2 py-1 bg-blue-500 text-white rounded-r"
            type="button"
          >
            添加
          </button>
        </div>
      )}

      {showImageForm && (
        <div 
          ref={imageFormRef}
          className="absolute top-12 left-0 z-20 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg flex"
        >
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="输入图片URL..."
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={addImage}
            className="px-2 py-1 bg-blue-500 text-white rounded-r"
            type="button"
          >
            添加
          </button>
        </div>
      )}

      <div className="editor-content p-3">
        <EditorContent editor={editor} className="prose dark:prose-invert max-w-none prose-sm sm:prose-base focus:outline-none min-h-[300px]" />
      </div>
    </div>
  )
} 