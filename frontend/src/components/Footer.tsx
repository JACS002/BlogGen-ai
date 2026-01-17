import { Github, Linkedin, Heart } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* --- CAMBIO PRINCIPAL: flex-col y items-center para centrar todo --- */}
        <div className="flex flex-col items-center text-center gap-8">
          <div className="flex flex-col items-center gap-3">
            {/* El enlace envuelve la imagen y el texto */}
            <a
              href="https://www.jacs.dev/"
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center gap-2"
            >
              <img
                src="/logo.svg"
                alt="JACS Developer"
                className="h-12 w-auto object-contain hover:opacity-80 transition-opacity hover:scale-105 transform duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden",
                  );
                }}
              />
              {/* Texto de respaldo */}
              <span className="hidden text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                JACS
              </span>
            </a>

            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
              Building software with passion & AI.
            </p>
          </div>

          {/*  REDES SOCIALES */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/JACS002"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-indigo-600 transition-all duration-300 hover:-translate-y-1"
              aria-label="Github"
            >
              <Github size={20} />
            </a>

            <a
              href="https://linkedin.com/in/joel-cuascota"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-blue-600 transition-all duration-300 hover:-translate-y-1"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* 3. COPYRIGHT (Este lo mantenemos abajo separado por la línea) */}
        <div className="border-t border-slate-900 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 gap-4">
          <p>&copy; {currentYear} JACS Development. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with{" "}
            <Heart
              size={12}
              className="text-red-500 fill-red-500 animate-pulse"
            />{" "}
            in React & Django
          </p>
        </div>
      </div>
    </footer>
  );
};
