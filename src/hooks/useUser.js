import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

const useUser = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useUser must be used within AuthContext provider");
  }

  const { user, isAuthenticated } = context;

  // Calculate initials from fullName (e.g., "Nguyễn Huỳnh Quốc Bảo" -> "NHQ")
  const getInitials = (fullName) => {
    if (!fullName) return "U";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Transform user object with additional fields
  const transformedUser = {
    ...user,
    name: user.fullName || "User", // Map fullName to name
    initials: getInitials(user.fullName), // Calculate initials
  };

  return {
    user: transformedUser,
    isAuthenticated,
  };
};

export default useUser;
