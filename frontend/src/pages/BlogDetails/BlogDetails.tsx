import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Trash2,
  Save,
  Youtube,
  Clock,
  Calendar,
  CheckCircle,
  Loader2,
  AlertTriangle,
  X,
  Check, // Importamos el Check para el éxito
  AlertCircle, // Para el error
} from "lucide-react";
import { Navbar } from "../../components/Navbar";

// --- HELPERS ---
const calculateReadTime = (content: string) => {
  if (!content) return "1 min read";
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "Recently";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

interface SaveStatus {
  type: "success" | "error";
  message: string;
}

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados de Datos
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [metaData, setMetaData] = useState({ youtubeUrl: "", createdAt: "" });

  // Estados de Control de Cambios
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalContent, setOriginalContent] = useState("");

  // Estados de UI
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // Estado para notificaciones visuales (success/error)
  const [saveStatus, setSaveStatus] = useState<SaveStatus | null>(null);

  // 1. Cargar el Blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/blog-posts/${id}/`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );

        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setContent(data.content);
          setMetaData({
            youtubeUrl: data.youtube_url,
            createdAt: data.created_at,
          });
          setOriginalTitle(data.title);
          setOriginalContent(data.content);
        } else {
          console.error("Error fetching blog");
        }
      } catch (error) {
        console.error("Error connecting to server", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Detectar cambios
  const hasUnsavedChanges =
    title !== originalTitle || content !== originalContent;

  // 2. Manejar Guardado (UPDATE) MEJORADO
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null); // Limpiamos mensajes previos

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/blog-posts/${id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title: title,
            content: content,
            youtube_url: metaData.youtubeUrl,
          }),
        },
      );

      if (response.ok) {
        // Actualizamos los originales
        setOriginalTitle(title);
        setOriginalContent(content);

        // MOSTRAR ÉXITO
        setSaveStatus({ type: "success", message: "Saved successfully!" });

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        // MOSTRAR ERROR
        setSaveStatus({ type: "error", message: "Failed to save." });
      }
    } catch (error) {
      console.error("Error saving:", error);
      setSaveStatus({ type: "error", message: "Connection error." });
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Manejar Borrado
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/blog-posts/${id}/`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (response.ok) {
        navigate("/dashboard");
      } else {
        setSaveStatus({ type: "error", message: "Could not delete." });
        setIsDeleting(false);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting:", error);
      setIsDeleting(false);
    }
  };

  // Navegación
  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (hasUnsavedChanges) {
      setShowUnsavedModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  const handleDiscardChanges = () => {
    navigate("/dashboard");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-20 relative">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-10">
        {/* Top Navigation & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <a
            href="/dashboard"
            onClick={handleBackClick}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Dashboard
          </a>

          <div className="flex items-center gap-3">
            {/* --- ÁREA DE NOTIFICACIONES --- */}
            {/* Prioridad 1: Mensajes de Éxito/Error */}
            {saveStatus && (
              <span
                className={`text-xs font-medium animate-fade-in flex items-center gap-1 mr-2 ${
                  saveStatus.type === "success"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {saveStatus.type === "success" ? (
                  <Check size={14} />
                ) : (
                  <AlertCircle size={14} />
                )}
                {saveStatus.message}
              </span>
            )}

            {/* Prioridad 2: Advertencia de Cambios sin guardar (Solo si no hay status activo) */}
            {!saveStatus && hasUnsavedChanges && (
              <span className="text-xs text-yellow-500 font-medium animate-pulse mr-2 flex items-center gap-1">
                <AlertTriangle size={12} />
                Unsaved changes
              </span>
            )}

            <div className="h-6 w-px bg-slate-800 hidden md:block"></div>

            <button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg 
                ${
                  hasUnsavedChanges
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
            >
              {isSaving ? (
                <>
                  {" "}
                  <Loader2 size={16} className="animate-spin" /> Saving...{" "}
                </>
              ) : (
                <>
                  {" "}
                  <Save size={16} /> Save Changes{" "}
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
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Title Editor */}
        <div className="mb-6">
          <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 block">
            Blog Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-4xl md:text-5xl font-bold text-white placeholder-slate-600 outline-none border-b border-transparent focus:border-indigo-500/50 transition-colors pb-2"
            placeholder="Enter blog title..."
          />
        </div>

        {/* Metadata Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
              <Youtube size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-slate-500">Source Video</p>
              <a
                href={metaData.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium truncate block hover:text-indigo-400 hover:underline"
              >
                {metaData.youtubeUrl}
              </a>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Created At</p>
              <p className="text-sm font-medium">
                {formatDate(metaData.createdAt)}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Read Time</p>
              <p className="text-sm font-medium">
                {calculateReadTime(content)}
              </p>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
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

          <div className="flex">
            {/* Line Numbers */}
            <div className="hidden sm:flex flex-col items-end px-4 py-6 text-slate-600 font-mono text-sm bg-slate-950/30 border-r border-slate-800 select-none">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="leading-7">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[600px] bg-slate-900 text-slate-300 p-6 font-mono text-sm leading-7 outline-none resize-none focus:bg-slate-800/50 transition-colors selection:bg-indigo-500/30"
              spellCheck="false"
              placeholder="Start writing your blog content here..."
            ></textarea>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-4 bg-red-500/10 rounded-full text-red-500 mb-2">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Delete Blog?
                </h3>
                <p className="text-slate-400 text-sm">
                  This action cannot be undone. Are you sure?
                </p>
              </div>
              <div className="flex gap-3 w-full mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl font-medium flex justify-center items-center gap-2"
                >
                  {isDeleting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unsaved Changes Modal */}
      {showUnsavedModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setShowUnsavedModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-4 bg-yellow-500/10 rounded-full text-yellow-500 mb-2">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Unsaved Changes
                </h3>
                <p className="text-slate-400 text-sm">
                  You have unsaved changes. Do you want to discard them and
                  leave?
                </p>
              </div>
              <div className="flex gap-3 w-full mt-4">
                <button
                  onClick={() => setShowUnsavedModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium"
                >
                  Keep Editing
                </button>
                <button
                  onClick={handleDiscardChanges}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl font-medium"
                >
                  Discard & Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetails;
