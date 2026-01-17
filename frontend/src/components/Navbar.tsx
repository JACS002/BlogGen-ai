import { useState, useEffect } from "react";
import { Sparkles, LayoutDashboard, LogOut, User, Menu, X } from "lucide-react"; // Importamos Menu y X
import { Link, useNavigate, useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú móvil
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isAuthenticated") === "true";
    setIsAuth(loggedIn);
    // Cerramos el menú móvil si cambiamos de ruta
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      localStorage.removeItem("isAuthenticated");
      setIsAuth(false);
      navigate("/login");
      setIsMenuOpen(false); // Aseguramos cerrar el menú
    }
  };

  return (
    <nav className="relative z-50 px-8 py-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        {/* --- LOGO (Visible siempre) --- */}
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter hover:opacity-80 transition z-50">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              BlogGen.ai
            </span>
          </Link>
        </div>

        {/* --- BOTÓN HAMBURGUESA (Solo Móvil) --- */}
        <button
          className="md:hidden text-slate-300 hover:text-white transition z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* --- MENÚ DESKTOP (Oculto en móvil) --- */}
        <div className="hidden md:flex items-center gap-6">
          {isAuth ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition group"
              >
                <LayoutDashboard
                  size={18}
                  className="group-hover:text-indigo-400 transition"
                />
                Dashboard
              </Link>

              <div className="h-4 w-px bg-slate-800"></div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-400 transition"
              >
                <LogOut size={18} />
                Logout
              </button>

              <Link
                to="/profile"
                className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/30 transition cursor-pointer"
              >
                <User size={16} />
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition border border-slate-700 hover:border-slate-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* --- MENÚ MÓVIL DESPLEGABLE (Overlay) --- */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 p-6 flex flex-col gap-4 md:hidden shadow-2xl animate-in slide-in-from-top-5 fade-in duration-200">
          {isAuth ? (
            <>
              {/* Usuario Info en Móvil */}
              <Link to="/profile" className="flex items-center gap-3">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/30 transition cursor-pointer">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">My Account</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center gap-3 text-base font-medium text-slate-300 hover:text-white py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard size={20} className="text-indigo-400" />
                Ir al Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-base font-medium text-slate-400 hover:text-red-400 py-2"
              >
                <LogOut size={20} />
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="w-full text-center px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
