import { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { githubLoginApi } from "../../utils/Api/accountApi";
import { AuthContext } from "../../context/auth.context";

export default function GitHubCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleGitHubCallback = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error) {
          toast.error(error || "GitHub authentication failed");
          navigate("/");
          return;
        }

        if (!code) {
          toast.error("No authorization code received");
          navigate("/");
          return;
        }

        // Send code to backend
        const res = await githubLoginApi(code);

        if (res.EC === 0) {
          const account = res.data || {};
          if (res.access_token) {
            localStorage.setItem("access_token", res.access_token);
          }
          
          setAuth({
            isAuthenticated: true,
            user: {
              _id: account._id || "",
              email: account.email || "",
              fullName: account.fullName || "",
              username: account.username || "",
              dob: account.dob || "",
              gender: account.gender || "",
              phone: account.phone || "",
              avatar: account.avatar || "",
              bio: account.bio || "",
              role: account.role || "user",
            },
          });

          toast.success("Login with GitHub successful!");
          // Redirect to dashboard or home
          setTimeout(() => {
            navigate("/projects");
          }, 1500);
        } else {
          const errorMessage = res.EM || "GitHub login failed";
          toast.error(errorMessage);
          navigate("/");
        }
      } catch (error) {
        console.error("GitHub callback error:", error);
        const errorMessage = error?.response?.data?.EM || "GitHub login failed";
        toast.error(errorMessage);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    handleGitHubCallback();
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Authenticating with GitHub...</h2>
        <p className="text-slate-400">Please wait while we complete your login</p>
      </div>
    </div>
  );
}
