import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, minHeight = '200px' }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const toolbar = editor.getModule('toolbar');
      toolbar.container.style.borderTopLeftRadius = '12px';
      toolbar.container.style.borderTopRightRadius = '12px';
    }
  }, []);

  const modules = {
    toolbar: [
      [{ header: [2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'color',
    'background',
    'link',
  ];

  return (
    <div className="rich-text-editor">
      <style>{`
        .rich-text-editor .quill {
          background: white;
          border-radius: 12px;
          overflow: hidden;
        }
        .rich-text-editor .ql-toolbar {
          border: 1px solid #e5e7eb;
          border-bottom: none;
          background: #f9fafb;
        }
        .rich-text-editor .ql-container {
          border: 1px solid #e5e7eb;
          min-height: ${minHeight};
          font-size: 15px;
          font-family: inherit;
        }
        .rich-text-editor .ql-editor {
          min-height: ${minHeight};
          color: #111827;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .rich-text-editor .ql-editor p,
        .rich-text-editor .ql-editor li,
        .rich-text-editor .ql-editor span,
        .rich-text-editor .ql-editor div {
          color: #111827;
        }
        
        /* Heading styles */
        .rich-text-editor .ql-editor h2 {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.2;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: #111827;
          font-family: 'Georgia', 'Times New Roman', serif;
        }
        .rich-text-editor .ql-editor h3 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.3;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          color: #111827;
          font-family: 'Georgia', 'Times New Roman', serif;
        }
        .rich-text-editor .ql-editor h4 {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #111827;
        }
        .rich-text-editor .ql-editor h5 {
          font-size: 1.125rem;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 0.875rem;
          margin-bottom: 0.5rem;
          color: #111827;
        }
        .rich-text-editor .ql-editor h6 {
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.5;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
          color: #111827;
        }
        
        /* Link styles */
        .rich-text-editor .ql-editor a {
          color: #d4af37;
          text-decoration: underline;
          text-decoration-color: #d4af37;
          text-underline-offset: 2px;
          transition: color 0.2s ease;
        }
        .rich-text-editor .ql-editor a:hover {
          color: #b8941f;
          text-decoration-color: #b8941f;
        }
        .rich-text-editor .ql-editor a:visited {
          color: #b8941f;
        }
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
