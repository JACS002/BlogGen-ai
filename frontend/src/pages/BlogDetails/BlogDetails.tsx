import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Download,
  Trash2,
  Save,
  Youtube,
  Clock,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { Navbar } from "../../components/Navbar";

// Simulamos datos que vendrían del Backend
const MOCK_BLOG_CONTENT = `
# How AI is Changing Web Development Forever

Artificial Intelligence is not just a buzzword; it's a paradigm shift in how we build, deploy, and maintain web applications. In this video, we explore the impact of LLMs on the daily workflow of a developer.

## The Rise of Coding Assistants

Tools like GitHub Copilot and Cursor are changing the speed at which we write boilerplate code. But is it safe?

1. **Efficiency:** faster prototyping.
2. **Quality:** automatic unit tests.
3. **Risks:** hallucinations and security vulnerabilities.

## Conclusion

The future is hybrid. Developers won't be replaced, but developers who use AI will replace those who don't.
`;

const BlogDetails = () => {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const [content, setContent] = useState(MOCK_BLOG_CONTENT);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Efecto para simular "Carga" de datos
  useEffect(() => {
    console.log(`Fetching blog with ID: ${id}`);
    // Aquí harías el fetch a Django: /api/blogs/${id}/
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulación de guardado en backend
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-20">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-10">
        {/* 1. Top Navigation & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono hidden md:block">
              ID: {id}
            </span>
            <div className="h-6 w-px bg-slate-800 hidden md:block"></div>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-indigo-500/20"
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition border border-slate-700"
            >
              {isCopied ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <Copy size={16} />
              )}
              {isCopied ? "Copied!" : "Copy"}
            </button>

            <button
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* 2. Metadata Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
              <Youtube size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Source Video</p>
              <a
                href="#"
                className="text-sm font-medium truncate hover:text-indigo-400 hover:underline"
              >
                youtu.be/video-id...
              </a>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Created At</p>
              <p className="text-sm font-medium">Oct 24, 2024</p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Read Time</p>
              <p className="text-sm font-medium">5 min read</p>
            </div>
          </div>
        </div>

        {/* 3. Main Editor Area */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
          {/* Header del Editor */}
          <div className="bg-slate-950/50 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              markdown_editor.md
            </span>
          </div>

          {/* Area de Texto */}
          <div className="flex">
            {/* Line Numbers (Decorativo) */}
            <div className="hidden sm:flex flex-col items-end px-4 py-6 text-slate-600 font-mono text-sm bg-slate-950/30 border-r border-slate-800 select-none">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="leading-7">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Textarea Real */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[600px] bg-slate-900 text-slate-300 p-6 font-mono text-sm leading-7 outline-none resize-none focus:bg-slate-800/50 transition-colors selection:bg-indigo-500/30"
              spellCheck="false"
            ></textarea>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogDetails;
