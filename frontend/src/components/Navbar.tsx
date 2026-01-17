import { useState, useEffect } from "react";
import { Sparkles, LayoutDashboard, LogOut, User } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Cada vez que cambiamos de ruta, verificamos si seguimos logueados
  useEffect(() => {
    const loggedIn = localStorage.getItem("isAuthenticated") === "true";
    setIsAuth(loggedIn);
  }, [location]);

  const handleLogout = async () => {
    try {
      // 1. Avisamos al Backend para que mate la cookie
      await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        credentials: "include", // Enviar la cookie para que sepa cuál borrar
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      // 2. Limpieza Visual (Frontend)
      localStorage.removeItem("isAuthenticated");
      setIsAuth(false);
      navigate("/login");
    }
  };

  return (
    <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto relative z-50">
      {/* Logo Area */}
      <div className="flex items-center gap-2 font-bold text-xl tracking-tighter hover:opacity-80 transition">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            BlogGen.ai
          </span>
        </Link>
      </div>

      {/* Actions Area */}
      <div className="flex items-center gap-6">
        {isAuth ? (
          // --- VISTA PARA USUARIOS LOGUEADOS ---
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

            {/* Avatar decorativo */}
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
              <User size={16} />
            </div>
          </>
        ) : (
          // --- VISTA PARA VISITANTES ---
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition border border-slate-700 hover:border-slate-600"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};
