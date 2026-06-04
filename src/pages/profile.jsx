import { useState, useEffect, useContext } from "react";
import { CheckCircle2, XCircle, X, User, Mail, CalendarDays, ShieldCheck } from "lucide-react";
import ProfileSidebar from "../components/profilePage/ProfileSidebar";
import ProfileOverview from "../components/profilePage/ProfileOverview";
import ProfileInfoCard from "../components/profilePage/ProfileInfoCard";
import { AuthContext } from "../context/auth.context";
import { getUserByIdApi, updateUserApi } from "../utils/Api/userApi";
import { toast } from "react-toastify";

function Toast({ toast: toastData, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);
  const ok = toastData.type === "success";
  return (
    <div className={
      "fixed bottom-6 right-6 z-50 flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-lg border max-w-sm " +
      (ok ? "bg-white dark:bg-slate-800 border-green-200 dark:border-green-800"
          : "bg-white dark:bg-slate-800 border-red-200 dark:border-red-800")
    }>
      {ok ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
      <p className="text-sm text-slate-700 dark:text-slate-200 flex-1">{toastData.message}</p>
      <button onClick={onDismiss} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function LeftSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="bg-white/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
        <div className="flex flex-col items-center gap-3">
          <div className="w-32 h-32 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-2 w-full text-center">
            <div className="h-5 w-44 bg-slate-200 dark:bg-slate-700 rounded mx-auto" />
            <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-700 rounded mx-auto" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-md w-full mt-2" />
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto" />
          </div>
        </div>
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      ))}
    </div>
  );
}

function RightSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      <div className="h-5 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        ))}
      </div>
      <div className="h-52 bg-slate-200 dark:bg-slate-700 rounded-xl" />
    </div>
  );
}

export default function ProfilePage() {
  const { auth, setAuth } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toastData, setToastData] = useState(null);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        if (auth?.user?._id) {
          const res = await getUserByIdApi(auth.user._id);
          if (res?.EC === 0 && res?.DT) {
            setProfile(res.DT);
          } else {
            setProfile(auth.user);
          }
        } else {
          setProfile(auth?.user || null);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setProfile(auth?.user || null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [auth?.user]);

  async function handleSave(formData) {
    setIsSaving(true);
    try {
      // Prepare data for update
      const updateData = {
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
      };

      // Add bio if it exists in formData
      if (formData.bio) {
        updateData.bio = formData.bio;
      }

      // Add avatar if it exists in formData
      if (formData.avatar) {
        updateData.avatar = formData.avatar;
      }

      if (formData.skills !== undefined) {
        updateData.skills = formData.skills.split(",").map(s => s.trim()).filter(s => s !== "");
      }

      const res = await updateUserApi(auth.user._id, updateData);

      if (res?.EC === 0) {
        const updatedUser = res.DT || { ...profile, ...updateData };
        setProfile(updatedUser);
        setAuth({
          isAuthenticated: true,
          user: updatedUser,
        });
        setToastData({ type: "success", message: "Profile updated successfully." });
      } else {
        setToastData({ type: "error", message: res?.EM || "Failed to update profile." });
      }
    } catch (error) {
      console.error("Save error:", error);
      setToastData({ type: "error", message: error?.response?.data?.EM || "Something went wrong. Please try again." });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[288px_1fr] gap-8 items-start">

          {/* ── Left column ── */}
          {isLoading ? (
            <LeftSkeleton />
          ) : (
            <div className="space-y-4">
              {/* Profile card */}
              <div className="bg-white/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
                <ProfileSidebar
                  profile={profile}
                  onSave={handleSave}
                  isSaving={isSaving}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                />
              </div>

              {/* 4 info cards — hidden while editing */}
              {!isEditing && (
                <>
                  <ProfileInfoCard
                    icon={User}
                    title="Account Information"
                    items={[
                      { label: "Full Name", value: profile?.fullName },
                      { label: "Username", value: profile?.username ? `@${profile.username}` : null },
                      { label: "Role", value: profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "User", badge: true },
                    ]}
                  />
                  <ProfileInfoCard
                    icon={Mail}
                    title="Contact Information"
                    items={[
                      { label: "Email", value: profile?.email },
                      { label: "Phone", value: profile?.phone },
                    ]}
                  />
                  <ProfileInfoCard
                    icon={CalendarDays}
                    title="Personal Details"
                    items={[
                      { label: "Date of Birth", value: profile?.dob ? new Date(profile.dob).toLocaleDateString() : null },
                      { label: "Gender", value: profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : null },
                      { label: "Bio", value: profile?.bio },
                    ]}
                  />
                  <ProfileInfoCard
                    icon={ShieldCheck}
                    title="Security Status"
                    items={[
                      { label: "Email verified", value: "Verified", badge: true },
                      { label: "2FA", value: "Not enabled" },
                      { label: "Account status", value: "Active", badge: true },
                    ]}
                  />
                </>
              )}
            </div>
          )}

          {/* ── Right column ── */}
          <div>
            {isLoading ? <RightSkeleton /> : <ProfileOverview profile={profile} />}
          </div>

        </div>
      </div>

      {toastData && <Toast toast={toastData} onDismiss={() => setToastData(null)} />}
    </div>
  );
}