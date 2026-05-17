/**
 * OAuth Helper Functions
 * Handles OAuth authentication flows for Google and GitHub
 */

/**
 * Get Google OAuth redirect URI
 */
export const getGoogleRedirectUri = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${window.location.origin}/auth/google/callback&response_type=code&scope=profile email`;
};

/**
 * Get GitHub OAuth redirect URI
 */
export const getGitHubRedirectUri = () => {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const redirectUri = encodeURIComponent(`${window.location.origin}/auth/github/callback`);
  return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
};

/**
 * Extract authorization code from URL params
 */
export const getAuthorizationCode = (provider) => {
  const params = new URLSearchParams(window.location.search);
  if (provider === "github") {
    return params.get("code");
  }
  if (provider === "google") {
    return params.get("code");
  }
  return null;
};

/**
 * Check for OAuth errors in URL params
 */
export const getOAuthError = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("error") || params.get("error_description");
};

/**
 * Store OAuth state in session storage for CSRF protection
 */
export const storeOAuthState = (state) => {
  sessionStorage.setItem("oauth_state", state);
};

/**
 * Get stored OAuth state
 */
export const getOAuthState = () => {
  return sessionStorage.getItem("oauth_state");
};

/**
 * Clear OAuth state
 */
export const clearOAuthState = () => {
  sessionStorage.removeItem("oauth_state");
};

/**
 * Generate random state for OAuth CSRF protection
 */
export const generateOAuthState = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Format user data from OAuth providers
 */
export const formatOAuthUserData = (provider, data) => {
  if (provider === "google") {
    return {
      email: data.email,
      fullName: data.name,
      avatar: data.picture,
      provider: "google",
    };
  }
  if (provider === "github") {
    return {
      email: data.email,
      fullName: data.name || data.login,
      avatar: data.avatar_url,
      provider: "github",
    };
  }
  return null;
};
