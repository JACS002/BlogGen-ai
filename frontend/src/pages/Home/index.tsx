import React, { useState, useEffect } from "react";
import {
  Youtube,
  Sparkles,
  ArrowRight,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Copy,
  Edit3,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { marked } from "marked";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

interface FeatureItem {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

// --- HELPER: Limpiar Markdown para SEO Description ---
const stripMarkdown = (markdown: string) => {
  if (!markdown) return "";
  return (
    markdown
      .replace(/#{1,6}\s?/g, "") // Remove headers
      .replace(/(\*\*|__)(.*?)\1/g, "$2") // Remove bold
      .replace(/(\*|_)(.*?)\1/g, "$2") // Remove italic
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // Remove links
      .replace(/`{3}[\s\S]*?`{3}/g, "") // Remove code blocks
      .replace(/`(.+?)`/g, "$1") // Remove inline code
      .replace(/\n/g, " ") // Replace newlines with spaces
      .slice(0, 160) // Cut to 160 chars
      .trim() + "..."
  );
};

const HomePage = () => {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isAuth, setIsAuth] = useState<boolean>(false);

  // Estados del Resultado
  const [blogContent, setBlogContent] = useState<string>("");
  const [blogTitle, setBlogTitle] = useState<string>("");
  const [blogId, setBlogId] = useState<number | null>(null);

  // Estado UI
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isAuthenticated") === "true";
    setIsAuth(loggedIn);
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setBlogContent("");
    setBlogTitle("");
    setBlogId(null);

    if (!isAuth) {
      setError("Please log in to generate viral blogs.");
      return;
    }
    if (!url.trim()) {
      setError("Please paste a YouTube URL to start.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/generate-blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ youtube_url: url }),
      });

      const data = await response.json();

      if (response.ok) {
        setBlogContent(data.content);
        setBlogTitle(data.title);
        setBlogId(data.id);
      } else {
        if (response.status === 401) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("isAuthenticated");
          setIsAuth(false);
        } else {
          // Aquí capturamos el mensaje que enviamos desde Django (ej: "El video es demasiado largo...")
          setError(data.error || "An error occurred on the server.");
        }
        // Aseguramos que el contenido esté vacío para que NO salgan botones
        setBlogContent("");
        setBlogTitle("");
        setBlogId(null);
      }
    } catch (err) {
      console.error("Connection error:", err);
      setError("Could not connect to the server. Is Django running?");
      setBlogContent("");
      setBlogTitle("");
      setBlogId(null);
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNCIONES DE DESCARGA ---
  const handleDownloadMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([blogContent], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${blogTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // 🚀 VERSIÓN SEO OPTIMIZED PARA HOME 🚀
  const handleDownloadHTML = async () => {
    const htmlContent = await marked(blogContent);

    // 1. Extraer miniatura del video actual
    const videoId = url.split("v=")[1]?.split("&")[0];
    const youtubeThumb = videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : "";

    // 2. Generar descripción limpia
    const cleanDescription = stripMarkdown(blogContent);
    const publishedDate = new Date().toISOString();

    // 3. Construir HTML Profesional
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="${cleanDescription}">
        <meta name="author" content="BlogGen AI User">
        
        <meta property="og:type" content="article">
        <meta property="og:title" content="${blogTitle}">
        <meta property="og:description" content="${cleanDescription}">
        <meta property="og:image" content="${youtubeThumb}">
        <meta property="og:url" content="${url}">
        
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${blogTitle}">
        <meta name="twitter:description" content="${cleanDescription}">
        <meta name="twitter:image" content="${youtubeThumb}">

        <title>${blogTitle}</title>

        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": "${blogTitle}",
          "image": "${youtubeThumb}",
          "datePublished": "${publishedDate}",
          "author": {
            "@type": "Person",
            "name": "Content Creator"
          },
          "description": "${cleanDescription}"
        }
        </script>

        <style>
          :root { --primary: #2563eb; --text: #1f2937; --bg: #ffffff; }
          @media (prefers-color-scheme: dark) { :root { --primary: #60a5fa; --text: #f3f4f6; --bg: #111827; } }
          
          body { font-family: system-ui, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: var(--primary); font-size: 2.5rem; line-height: 1.2; margin-bottom: 1rem; }
          h2 { margin-top: 2rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem; }
          a { color: var(--primary); text-decoration: none; }
          a:hover { text-decoration: underline; }
          img { max-width: 100%; height: auto; border-radius: 12px; margin: 20px 0; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
          pre { background: #1e293b; color: #f8fafc; padding: 20px; border-radius: 8px; overflow-x: auto; }
          code { font-family: monospace; background: rgba(37, 99, 235, 0.1); color: var(--primary); padding: 2px 6px; border-radius: 4px; }
          blockquote { border-left: 4px solid var(--primary); padding-left: 1rem; font-style: italic; color: #6b7280; }
          .video-btn { background: #ff0000; color: white; padding: 5px 12px; border-radius: 20px; font-weight: bold; font-size: 0.8rem; display: inline-block; margin-top: 10px; }
        </style>
      </head>
      <body>
        <article>
          <header>
            <h1>${blogTitle}</h1>
            <p style="color: #6b7280; font-size: 0.9rem;">Published recently</p>
            <a href="${url}" target="_blank" class="video-btn">▶ Watch Original Video</a>
            ${youtubeThumb ? `<br><img src="${youtubeThumb}" alt="${blogTitle}">` : ""}
          </header>
          <main>
            ${htmlContent}
          </main>
          <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 0.8rem; color: #9ca3af;">
             <p>Generated with AI BlogGen</p>
          </footer>
        </article>
      </body>
      </html>
    `;

    const element = document.createElement("a");
    const file = new Blob([fullHtml], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = `${blogTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(blogContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-indigo-400 mb-8 font-medium animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Powered by Groq & Llama 3
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tight">
          Turn videos into <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Viral Blogs
          </span>
        </h1>

        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
          Paste a YouTube link and our AI will generate an SEO-optimized
          article, perfectly structured and ready to publish in seconds.
        </p>

        {/* Formulario */}
        <form
          onSubmit={handleGenerate}
          className="relative max-w-2xl mx-auto group mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl">
            <div className="pl-4 text-slate-500">
              <Youtube size={24} />
            </div>
            <input
              type="text"
              placeholder="Paste YouTube link here..."
              className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 px-4 py-3 outline-none w-full"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
                ${isLoading ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50"}`}
            >
              {isLoading ? (
                "Generating..."
              ) : (
                <>
                  Generate <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Mensajes de Error */}
        {error && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 max-w-md mx-auto mb-12">
            <div
              className={`p-4 rounded-xl flex items-center gap-3 text-sm text-left border shadow-lg ${error.includes("log in") ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-300" : "bg-red-500/10 border-red-500/50 text-red-200"}`}
            >
              <AlertCircle size={20} className="shrink-0" />
              <div className="flex-1">{error}</div>
              {error.includes("log in") && (
                <Link
                  to="/login"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition shrink-0"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
        )}

        {/* --- RESULTADO DEL BLOG RENDERIZADO --- */}
        {blogContent && (
          <div className="text-left bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl mx-auto shadow-2xl animate-fade-in-up mb-12 overflow-hidden">
            {/* Header del Resultado: Acciones */}
            <div className="bg-slate-950/50 border-b border-slate-800 p-4 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex items-center gap-2 text-yellow-400 font-semibold">
                <Sparkles size={18} /> Generated successfully
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
                  title="Copy Text"
                >
                  {isCopied ? (
                    <Check size={18} className="text-green-400" />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
                <div className="h-4 w-px bg-slate-800"></div>
                <button
                  onClick={handleDownloadMarkdown}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
                  title="Download Markdown"
                >
                  <FileText size={18} />
                </button>
                <button
                  onClick={handleDownloadHTML}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
                  title="Download SEO HTML"
                >
                  <Download size={18} />
                </button>

                {/* Botón Principal: EDITAR */}
                <Link
                  to={`/blog/${blogId}`}
                  className="ml-2 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition"
                >
                  <Edit3 size={16} /> Edit & Save
                </Link>
              </div>
            </div>

            {/* Contenido Renderizado (Con Tailwind Typography) */}
            <div className="p-8 max-h-[600px] overflow-y-auto custom-scrollbar">
              <div className="prose prose-invert prose-indigo max-w-none prose-headings:font-bold prose-h1:text-3xl prose-p:text-slate-300 prose-a:text-indigo-400">
                <ReactMarkdown>{blogContent}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Social Proof */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <CheckCircle size={14} className="text-indigo-500" /> Auto
            Transcription
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle size={14} className="text-indigo-500" /> Markdown
            Format
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle size={14} className="text-indigo-500" /> SEO Optimized
          </span>
        </div>
      </main>

      {/* Features Grid */}
      <section className="border-t border-slate-900 bg-slate-950/50 backdrop-blur-sm py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Intelligent Extraction",
                desc: "We extract the full video context, not just the words.",
                icon: <FileText className="text-cyan-400" />,
              },
              {
                title: "AI Editing",
                desc: "AI structures content with H1s, H2s, and lists for easy reading.",
                icon: <Sparkles className="text-indigo-400" />,
              },
              {
                title: "Fast Export",
                desc: "Copy content in Markdown or HTML directly to your CMS.",
                icon: <ArrowRight className="text-purple-400" />,
              },
            ].map((feature: FeatureItem, idx: number) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="mb-4 p-3 bg-slate-900 rounded-lg w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
