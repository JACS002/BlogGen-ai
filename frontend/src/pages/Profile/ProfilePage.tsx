import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Shield,
  Camera,
} from "lucide-react";
import { Navbar } from "../../components/Navbar";

// Interfaces
interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Estados de UI
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // 1. Cargar datos del usuario
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
      }
    } catch (error) {
      console.error("Error fetching profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Guardar cambios
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/me", {
        method: "PATCH", // PATCH sirve para actualizar solo algunos campos
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
        }),
      });

      if (response.ok) {
        setSaveStatus({
          type: "success",
          message: "Profile updated successfully!",
        });
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus({ type: "error", message: "Failed to update profile." });
      }
    } catch (error) {
      setSaveStatus({ type: "error", message: "Connection error." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Account Settings
          </h1>
          <p className="text-slate-400 mt-1">
            Manage your personal information
          </p>
        </div>

        <div className="grid gap-8">
          {/* CARD 1: INFORMACIÓN PÚBLICA */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <User className="text-indigo-400" size={20} />
              Personal Information
            </h2>

            {/* Avatar Placeholder */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-500/20">
                  {firstName.charAt(0).toUpperCase() || "U"}
                </div>
                {/* Overlay de cámara (decorativo) */}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-lg">
                  {firstName} {lastName}
                </h3>
                <p className="text-slate-500 text-sm">
                  Update your photo and personal details.
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
                    placeholder="Jane"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Botón de Guardar y Notificaciones */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                {/* Mensajes de estado */}
                <div className="flex-1">
                  {saveStatus && (
                    <span
                      className={`text-sm font-medium animate-fade-in flex items-center gap-2 ${
                        saveStatus.type === "success"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {saveStatus.type === "success" ? (
                        <Check size={16} />
                      ) : (
                        <AlertCircle size={16} />
                      )}
                      {saveStatus.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      {" "}
                      <Loader2 size={18} className="animate-spin" />{" "}
                      Saving...{" "}
                    </>
                  ) : (
                    <>
                      {" "}
                      <Save size={18} /> Save Changes{" "}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* CARD 2: SEGURIDAD (Solo lectura por ahora) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl opacity-75">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Shield className="text-emerald-400" size={20} />
                Sign In & Security
              </h2>
              <span className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-400">
                Managed by System
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3 text-slate-500"
                    size={18}
                  />
                  <input
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Your email is used to log in and cannot be changed here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
