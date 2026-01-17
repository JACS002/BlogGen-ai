import React, { useState } from "react";
import {
  Youtube,
  Sparkles,
  ArrowRight,
  FileText,
  CheckCircle,
} from "lucide-react";

import { Navbar } from "../../components/Navbar";

const HomePage = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [blogContent, setBlogContent] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setBlogContent("");
    setError("");

    try {
      // Usamos localhost para coincidir con la cookie
      const response = await fetch("http://127.0.0.1:8000/api/generate-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Esto envía la cookie HttpOnly al servidor
        credentials: "include",
        body: JSON.stringify({
          youtube_url: url,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBlogContent(data.content);
        console.log("Datos recibidos:", data);
      } else {
        // Manejo mejorado de errores (por si el token expiró)
        if (response.status === 401) {
          setError(
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
          );
        } else {
          setError(data.error || "Ocurrió un error en el servidor");
        }
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      setError("No se pudo conectar con el servidor. ¿Está encendido Django?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-indigo-400 mb-8 font-medium animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Powered by Django & React
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
          className="relative max-w-2xl mx-auto group mb-12"
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
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
                ${
                  isLoading
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50"
                }`}
            >
              {isLoading ? (
                "Generating..."
              ) : (
                <>
                  Generate
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* VISUALIZACIÓN DEL RESULTADO */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl max-w-2xl mx-auto mb-12 flex items-center gap-2 justify-center">
            ⚠️ {error}
          </div>
        )}

        {blogContent && (
          <div className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="text-yellow-400" size={24} />
              Blog Generado:
            </h2>
            <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-line">
              {blogContent}
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
            ].map((feature, idx) => (
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
    </div>
  );
};

export default HomePage;
