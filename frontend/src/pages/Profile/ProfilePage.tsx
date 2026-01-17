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
  Lock, // Icono candado
  Trash2, // Icono basura
  AlertTriangle,
  X,
} from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { useNavigate } from "react-router-dom"; // Necesitamos navegar al borrar

// Interfaces
interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Estados Datos Personales
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Estados Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Estados UI
  const [isLoading, setIsLoading] = useState(true);

  // Status de Guardado (Profile)
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Status de Password
  const [isSavingPass, setIsSavingPass] = useState(false);
  const [passStatus, setPassStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Status de Borrado
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // 2. Guardar Info Personal
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileStatus(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
        }),
      });

      if (response.ok) {
        setProfileStatus({ type: "success", message: "Profile updated!" });
        setTimeout(() => setProfileStatus(null), 3000);
      } else {
        setProfileStatus({ type: "error", message: "Failed to update." });
      }
    } catch (error) {
      setProfileStatus({ type: "error", message: "Connection error." });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 3. Cambiar Contraseña
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      setPassStatus({ type: "error", message: "Fill all fields." });
      return;
    }

    setIsSavingPass(true);
    setPassStatus(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setPassStatus({ type: "success", message: "Password changed!" });
        setOldPassword("");
        setNewPassword("");
        setTimeout(() => setPassStatus(null), 3000);
      } else {
        // Manejo de error específico (ej: contraseña vieja incorrecta)
        const errorMsg = data.old_password
          ? data.old_password[0]
          : "Failed to change password.";
        setPassStatus({ type: "error", message: errorMsg });
      }
    } catch (error) {
      setPassStatus({ type: "error", message: "Connection error." });
    } finally {
      setIsSavingPass(false);
    }
  };

  // 4. Borrar Cuenta
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/me", {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        // Limpieza local
        localStorage.removeItem("isAuthenticated");
        // Redirigir al Login o Home
        navigate("/login");
      } else {
        alert("Failed to delete account.");
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting account", error);
    } finally {
      setIsDeleting(false);
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
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white relative">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-12 pb-32">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Account Settings
          </h1>
          <p className="text-slate-400 mt-1">
            Manage your personal information and security
          </p>
        </div>

        <div className="grid gap-8">
          {/* --- SECCIÓN 1: INFORMACIÓN PÚBLICA --- */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <User className="text-indigo-400" size={20} />
              Personal Information
            </h2>

            <div className="flex items-center gap-6 mb-8">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-500/20">
                  {firstName.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-lg">
                  {firstName} {lastName}
                </h3>
                <p className="text-slate-500 text-sm">
                  Update your personal details.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
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
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                <div className="flex-1">
                  {profileStatus && (
                    <span
                      className={`text-sm font-medium animate-fade-in flex items-center gap-2 ${
                        profileStatus.type === "success"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {profileStatus.type === "success" ? (
                        <Check size={16} />
                      ) : (
                        <AlertCircle size={16} />
                      )}
                      {profileStatus.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  Save Info
                </button>
              </div>
            </form>
          </div>

          {/* --- SECCIÓN 2: SEGURIDAD (EMAIL & PASSWORD) --- */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Shield className="text-emerald-400" size={20} />
                Sign In & Security
              </h2>
            </div>

            <div className="space-y-6">
              {/* Email Read-only */}
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
              </div>

              <hr className="border-slate-800/50" />

              {/* Change Password Form */}
              <form onSubmit={handleChangePassword} className="space-y-4">
                <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Lock size={16} /> Change Password
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/50 transition text-sm"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/50 transition text-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {passStatus && (
                      <span
                        className={`text-sm font-medium animate-fade-in flex items-center gap-2 ${
                          passStatus.type === "success"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {passStatus.type === "success" ? (
                          <Check size={16} />
                        ) : (
                          <AlertCircle size={16} />
                        )}
                        {passStatus.message}
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSavingPass}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition border border-slate-700 disabled:opacity-50"
                  >
                    {isSavingPass ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* --- SECCIÓN 3: DANGER ZONE --- */}
          <div className="border border-red-500/20 bg-red-500/5 rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-4 text-red-400 flex items-center gap-2">
              <AlertTriangle size={20} /> Danger Zone
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Once you delete your account, there is no going back. All your
              generated blogs and personal data will be permanently removed.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded-xl font-medium transition flex items-center gap-2"
            >
              <Trash2 size={18} />
              Delete Account
            </button>
          </div>
        </div>
      </main>

      {/* --- MODAL CONFIRMACIÓN BORRAR CUENTA --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative border-t-4 border-t-red-500">
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
                  Delete Account?
                </h3>
                <p className="text-slate-400 text-sm">
                  This will permanently delete your account and{" "}
                  <strong>all your blogs</strong>. This action is irreversible.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium flex justify-center items-center gap-2 shadow-lg shadow-red-600/20"
                >
                  {isDeleting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
