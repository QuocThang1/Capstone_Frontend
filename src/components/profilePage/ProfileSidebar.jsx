import { useState, useEffect, useContext } from "react";
import { Camera, Shield, Loader2, Save, Pencil } from "lucide-react";
import ProfileForm from "./ProfileForm";
import { updateUserApi } from "../../utils/Api/userApi";
import { AuthContext } from "../../context/auth.context";
import { toast } from "react-toastify";

function isValidUrl(str) {
  if (!str) return true;
  try { new URL(str); return true; } catch { return false; }
}

function Avatar({ src, initials, size = "lg" }) {
  const dim = size === "lg" ? "w-32 h-32" : "w-28 h-28";
  const txt = size === "lg" ? "text-4xl" : "text-3xl";
  return (
    <div className={`${dim} rounded-full overflow-hidden ring-4 ring-[#6366F1]/20 shadow-md flex-shrink-0`}>
      {src ? (
        <img src={src} alt="avatar" className="w-full h-full object-cover" />
      ) : (
        <div className={`w-full h-full bg-[#6366F1] flex items-center justify-center text-white ${txt} font-bold`}>
          {initials}
        </div>
      )}
    </div>
  );
}

/* ─── View mode ─────────────────────────────────────────── */
function ViewMode({ profile, onEdit }) {
  const avatarSrc = profile?.avatar && isValidUrl(profile.avatar) ? profile.avatar : null;
  const initials = profile?.fullName
    ? profile.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <Avatar src={avatarSrc} initials={initials} size="lg" />
      </div>
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full self-center
        bg-[#6366F1]/10 dark:bg-[#6366F1]/20 text-[#6366F1] dark:text-indigo-300">
        <Shield className="w-3 h-3" />
        {profile?.role
          ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
          : "User"}
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
          {profile?.fullName || "—"}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {profile?.username || "—"}
        </p>
        {profile?.bio && (
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {profile.bio}
          </p>
        )}
      </div>
      <button
        onClick={onEdit}
        className="w-full flex items-center justify-center gap-2 py-1.5 px-3 text-sm font-medium rounded-md
          border border-slate-300 dark:border-slate-600
          text-slate-800 dark:text-slate-200
          hover:bg-slate-100 dark:hover:bg-slate-700
          transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit profile
      </button>
    </div>
  );
}

/* ─── Main component (isEditing lifted to parent) ───────── */
export default function ProfileSidebar({ profile, onSave, isSaving, isEditing, setIsEditing }) {
  const { auth } = useContext(AuthContext);
  const [form, setForm] = useState({
    fullName: "", username: "", bio: "", email: "",
    phone: "", dob: "", gender: "", avatar: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName || "",
        username: profile.username || "",
        bio: profile.bio || "",
        email: profile.email || "",
        phone: profile.phone || "",
        dob: profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : "",
        gender: profile.gender || "",
        avatar: profile.avatar || "",
      });
    }
  }, [profile]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleCancel() {
    if (!profile) return;
    setForm({
      fullName: profile.fullName || "",
      username: profile.username || "",
      bio: profile.bio || "",
      email: profile.email || "",
      phone: profile.phone || "",
      dob: profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : "",
      gender: profile.gender || "",
      avatar: profile.avatar || "",
    });
    setErrors({});
    setIsEditing(false);
  }

  function validate() {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Name is required.";
    if (!form.username.trim()) errs.username = "Username is required.";
    if (form.phone && !/^[+\d\s\-()]*$/.test(form.phone))
      errs.phone = "Only numbers and + allowed.";
    if (form.avatar && !isValidUrl(form.avatar) && !form.avatar.startsWith("data:image/"))
      errs.avatar = "Must be a valid URL or image file.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    await onSave(form);
    setIsEditing(false);
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((prev) => ({ ...prev, avatar: ev.target.result }));
    reader.readAsDataURL(file);
  }

  const avatarSrc = form.avatar && isValidUrl(form.avatar) ? form.avatar : null;
  const initials = form.fullName
    ? form.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  if (!isEditing) {
    return <ViewMode profile={profile} onEdit={() => setIsEditing(true)} />;
  }

  return (
    <aside className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Avatar src={avatarSrc} initials={initials} size="lg" />
            <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#6366F1] hover:bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer shadow transition-colors">
              <Camera className="w-4 h-4 text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">{form.fullName || "—"}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">@{form.username || "—"}</p>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700" />

        <ProfileForm form={form} errors={errors} onChange={handleChange} />

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-md
              bg-[#6366F1] hover:bg-indigo-600 text-white
              focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900
              transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="flex items-center justify-center px-4 py-1.5 text-sm font-medium rounded-md
              border border-slate-300 dark:border-slate-600
              text-slate-700 dark:text-slate-300
              hover:bg-slate-100 dark:hover:bg-slate-700
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </aside>
  );
}
