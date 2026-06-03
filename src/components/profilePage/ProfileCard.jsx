import { Camera, Shield } from "lucide-react";

export default function ProfileCard({ profile, onAvatarChange }) {
  const initials = profile?.fullName
    ? profile.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onAvatarChange(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 backdrop-blur-sm shadow-sm">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#6366F1]/20">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#6366F1] flex items-center justify-center text-white text-3xl font-semibold">
                {initials}
              </div>
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#6366F1] hover:bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-colors">
            <Camera className="w-4 h-4 text-white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 truncate">
            {profile?.fullName || "—"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
            @{profile?.username || "—"}
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 bg-[#6366F1]/10 text-[#6366F1] dark:bg-[#6366F1]/20 dark:text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">
            <Shield className="w-3.5 h-3.5" />
            {profile?.role
              ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
              : "User"}
          </div>
        </div>
      </div>
    </div>
  );
}
