import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User,
  AlertCircle,
  CheckCircle, // <--- 1. IMPORTAMOS EL ICONO DE CHECK
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(""); // <--- 2. NUEVO ESTADO DE ÉXITO
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(""); // Limpiamos mensajes anteriores

    // Validaciones Locales
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- 3. LÓGICA DE ÉXITO ---
        // A. Mostramos el mensaje verde
        setSuccessMessage("¡Usuario creado correctamente! Redirigiendo...");

        // B. Esperamos 2 segundos antes de cambiar de página para que el usuario lea
        setTimeout(() => {
          navigate("/login");
        }, 2000);

        // Nota: NO ponemos setIsLoading(false) aquí para que el botón siga bloqueado mientras redirigimos
      } else {
        const serverError = data.email
          ? data.email[0]
          : data.password
            ? data.password[0]
            : "Falló el registro";
        setError(serverError);
        setIsLoading(false); // Aquí sí desbloqueamos el botón para que intente de nuevo
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error conectando con el servidor.");
      setIsLoading(false);
    }
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
            Crea tu cuenta
          </h2>
          <p className="text-slate-400 text-center mb-6 text-sm">
            Comienza a generar blogs virales hoy
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* --- 4. MENSAJES DE ESTADO (Error vs Éxito) --- */}

            {/* Mensaje de Error (Rojo) */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fade-in">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Mensaje de Éxito (Verde) */}
            {successMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fade-in font-medium">
                <CheckCircle size={16} />
                {successMessage}
              </div>
            )}

            {/* Inputs del Formulario */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400">
                Nombre Completo
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

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-slate-500"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-slate-500"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-slate-950 border rounded-xl py-2.5 pl-10 pr-4 outline-none transition text-sm
                    ${error && password !== confirmPassword ? "border-red-500/50 focus:ring-red-500/50" : "border-slate-800 focus:ring-indigo-500/50 focus:border-indigo-500"}
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
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex justify-center items-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                // Cambiamos el texto dependiendo de si ya fue exitoso o solo está cargando
                successMessage ? (
                  "¡Listo!"
                ) : (
                  "Creando cuenta..."
                )
              ) : (
                <>
                  Registrarse <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
