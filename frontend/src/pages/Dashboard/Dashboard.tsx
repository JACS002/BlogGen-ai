import React, { useState } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Calendar,
  Clock,
  Youtube,
  Trash2,
  Edit3,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Link } from "react-router-dom";

// 1. Definimos la estructura de nuestros datos (TypeScript)
interface BlogPost {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
  readTime: string;
  status: "published" | "draft" | "processing";
  youtubeUrl: string;
}

// 2. Datos de prueba (Fake Data)
const MOCK_BLOGS: BlogPost[] = [
  {
    id: "1",
    title: "How AI is Changing Web Development Forever",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
    date: "Oct 24, 2024",
    readTime: "5 min read",
    status: "published",
    youtubeUrl: "#",
  },
  {
    id: "2",
    title: "The Ultimate Guide to React 19 Hooks",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
    date: "Oct 22, 2024",
    readTime: "12 min read",
    status: "draft",
    youtubeUrl: "#",
  },
  {
    id: "3",
    title: "Python vs Javascript: Which one to choose?",
    thumbnail:
      "https://images.unsplash.com/photo-1649180556628-9ba704115795?w=800&auto=format&fit=crop&q=60",
    date: "Oct 20, 2024",
    readTime: "8 min read",
    status: "processing",
    youtubeUrl: "#",
  },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtramos los blogs según lo que escriba el usuario
  const filteredBlogs = MOCK_BLOGS.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
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

        {/* Search Bar */}
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

        {/* Grid de Blogs */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="group bg-slate-900/50 border border-slate-800 hover:border-indigo-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                {/* Card Image */}
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Status Badge */}
                  <div
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-md
                    ${
                      blog.status === "published"
                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                        : blog.status === "processing"
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                          : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {blog.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {blog.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 leading-tight group-hover:text-indigo-400 transition-colors">
                    {blog.title}
                  </h3>

                  {/* Actions Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
                    <a
                      href={blog.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-500 hover:text-red-400 transition"
                      title="Watch Video"
                    >
                      <Youtube size={18} />
                    </a>

                    <div className="flex gap-2">
                      <button
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition"
                        title="View"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State (Si no hay resultados)
          <div className="text-center py-20">
            <div className="bg-slate-900 rounded-full p-4 w-fit mx-auto mb-4 text-slate-500">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No blogs found
            </h3>
            <p className="text-slate-400">
              Try searching for something else or create a new blog.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
