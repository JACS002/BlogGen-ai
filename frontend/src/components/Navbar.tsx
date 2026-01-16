import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
      {/* Logo Area */}
      <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <Sparkles size={20} className="text-white" />
        </div>
        <Link to="/">BlogGen.ai</Link>
      </div>

      {/* Actions Area */}
      <div className="flex items-center gap-4">
        <button className="text-sm text-slate-400 hover:text-white transition font-medium">
          Pricing
        </button>
        <button className="text-sm text-slate-400 hover:text-white transition font-medium">
          <Link to="/login">Login</Link>
        </button>
      </div>
    </nav>
  );
};
