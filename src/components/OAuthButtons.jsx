import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/auth.context';
import { googleLoginApi, githubLoginApi } from '../../utils/Api/accountApi';
import { toast } from 'react-toastify';
import useDarkMode from '../../hooks/useDarkMode';

const OAuthButtons = ({ onSuccess }) => {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  // Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        setIsLoading(true);
        const response = await googleLoginApi(codeResponse.id_token);
        
        if (response.data.EC === 0) {
          localStorage.setItem('access_token', response.data.access_token);
          setAuth({
            isAuthenticated: true,
            user: response.data.data,
          });
          toast.success('Google login successful!');
          onSuccess && onSuccess();
          setTimeout(() => {
            navigate('/dashboard');
          }, 500);
        }
      } catch (error) {
        console.error('Google login error:', error);
        toast.error(error.response?.data?.EM || 'Google login failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      toast.error('Google login failed');
    },
  });

  // GitHub Login
  const handleGitHubLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${
        import.meta.env.VITE_GITHUB_CLIENT_ID || 'your_github_client_id_here'
      }&redirect_uri=${window.location.origin}/auth/github/callback&scope=user:email`;
      
      window.location.href = githubAuthUrl;
    } catch (error) {
      console.error('GitHub login error:', error);
      toast.error('GitHub login failed');
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="space-y-3 w-full">
      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
        <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Or continue with
        </span>
        <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* Google Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => googleLogin()}
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 border ${
            isDark
              ? 'border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white'
              : 'border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <GoogleOutlined className="text-lg" />
          <span>GG</span>
        </motion.button>

        {/* GitHub Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGitHubLogin}
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 border ${
            isDark
              ? 'border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white'
              : 'border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <GithubOutlined className="text-lg" />
          <span>GitHub</span>
        </motion.button>
      </div>
    </div>
  );
};

export default OAuthButtons;
