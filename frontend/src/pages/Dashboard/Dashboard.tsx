import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  Youtube,
  Trash2,
  Loader2,
  AlertCircle,
  X, // Importamos X para cerrar el modal si se quiere
  AlertTriangle, // Para el icono de advertencia del modal
} from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Link } from "react-router-dom";
import { Footer } from "../../components/Footer";

// Helpers
const getYouTubeThumbnail = (url: string) => {
  if (!url)
    return "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=60";
  const videoId = url.split("v=")[1]?.split("&")[0];
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=60";
};

const formatDate = (dateString: string) => {
  if (!dateString) return "Recently";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const calculateReadTime = (content: string) => {
  if (!content) return "1 min read";
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

interface Blog {
  id: number;
  title: string;
  thumbnail: string;
  date: string;
  readTime: string;
  status: string;
  youtubeUrl: string;
}

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // --- ESTADOS PARA EL MODAL DE BORRADO ---
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null); // Si no es null, el modal está abierto
  const [isDeleting, setIsDeleting] = useState(false); // Loading del botón dentro del modal

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/blog-posts", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.status === 401) {
        setError("Session expired. Please login again.");
        return;
      }

      const data = await response.json();

      const formattedBlogs = data.map((blog: any) => ({
        id: blog.id,
        title: blog.title || "Untitled Blog",
        thumbnail: getYouTubeThumbnail(blog.youtube_url),
        date: formatDate(blog.created_at),
        readTime: calculateReadTime(blog.content),
        status: "published",
        youtubeUrl: blog.youtube_url || "#",
      }));

      setBlogs(formattedBlogs);
    } catch (err) {
      console.error(err);
      setError("Failed to load blogs.");
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Abrir el modal (No borra todavía)
  const promptDelete = (id: number) => {
    setBlogToDelete(id);
  };

  // 2. Ejecutar borrado real (Al confirmar en el modal)
  const executeDelete = async () => {
    if (!blogToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/blog-posts/${blogToDelete}/`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (response.ok) {
        setBlogs((prevBlogs) =>
          prevBlogs.filter((blog) => blog.id !== blogToDelete),
        );
        setBlogToDelete(null); // Cerrar modal al terminar
      } else {
        alert("Error deleting blog.");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Connection error.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Blogs</h1>
            <p className="text-slate-400 mt-1">Manage your generated content</p>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25"
          >
            <Plus size={18} />
            New Blog
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-3 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search your blogs..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-white placeholder-slate-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading & Error */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p>Loading your masterpieces...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center gap-2 mb-8">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Grid */}
        {!isLoading && !error && filteredBlogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="group relative bg-slate-900/50 border border-slate-800 hover:border-indigo-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col"
              >
                <Link
                  to={`/blog/${blog.id}`}
                  className="flex-1 block cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="h-48 overflow-hidden relative bg-slate-800">
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=60";
                      }}
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-md bg-green-500/10 border-green-500/20 text-green-400">
                      Published
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 pb-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {blog.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {blog.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 leading-tight group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                  </div>
                </Link>

                {/* Footer Actions */}
                <div className="p-5 pt-4 mt-auto flex justify-between items-center border-t border-slate-800/50">
                  <a
                    href={blog.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-400 transition z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Youtube size={16} />
                    Watch Video
                  </a>

                  {/* Botón que ABRE EL MODAL */}
                  <button
                    className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition z-10"
                    title="Delete Blog"
                    onClick={(e) => {
                      e.stopPropagation();
                      promptDelete(blog.id);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredBlogs.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="bg-slate-900 rounded-full p-6 w-fit mx-auto mb-4 text-slate-500">
              <Search size={40} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No blogs found
            </h3>
            <p className="text-slate-400 mb-6 max-w-sm mx-auto">
              You haven't generated any blogs yet (or the search didn't match).
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition"
            >
              <Plus size={18} />
              Create your first blog
            </Link>
          </div>
        )}
      </main>

      {/* --- MODAL DE CONFIRMACIÓN DE BORRADO --- */}
      {blogToDelete !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative">
            {/* Botón X para cerrar */}
            <button
              onClick={() => setBlogToDelete(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition"
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
                <p className="text-slate-400 text-sm leading-relaxed">
                  Are you sure you want to delete this blog? This action cannot
                  be undone and will remove it permanently.
                </p>
              </div>

              <div className="flex gap-3 w-full mt-4">
                <button
                  onClick={() => setBlogToDelete(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition border border-slate-700"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Dashboard;
