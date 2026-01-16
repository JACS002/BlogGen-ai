import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User,
  AlertCircle,
} from "lucide-react"; // Agregamos AlertCircle para el error
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // <--- Nuevo estado
  const [error, setError] = useState<string | null>(null); // <--- Para manejar errores de validación
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    // 1. Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // 2. Validar longitud mínima (opcional pero recomendado)
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    // Simulación de registro exitoso
    setTimeout(() => {
      setIsLoading(false);
      console.log("Registered with:", { name, email, password });
      // Aquí redirigirías al dashboard
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white p-4">
      {/* Fondo Decorativo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="z-10 w-full max-w-md">
        {/* Header Logo */}
        <div className="flex justify-center mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tighter hover:opacity-80 transition"
          >
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <span>BlogGen.ai</span>
          </Link>
        </div>

        {/* Card Principal */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Create an account
          </h2>
          <p className="text-slate-400 text-center mb-6 text-sm">
            Start generating viral blogs today
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Mensaje de Error (Se muestra solo si existe error) */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fade-in">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Input: Full Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-slate-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input: Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-slate-500"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input: Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-slate-500"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="Create a password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input: Confirm Password (NUEVO) */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-slate-500"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="Repeat your password"
                  className={`w-full bg-slate-950 border rounded-xl py-2.5 pl-10 pr-4 outline-none transition text-sm
                    ${error ? "border-red-500/50 focus:ring-red-500/50" : "border-slate-800 focus:ring-indigo-500/50 focus:border-indigo-500"}
                  `}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex justify-center items-center gap-2 mt-6"
            >
              {isLoading ? (
                "Creating account..."
              ) : (
                <>
                  Get Started <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
