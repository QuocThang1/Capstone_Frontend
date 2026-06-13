import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth.context.jsx";


/**
 * @param {ReactNode} children 
 * @param {Array<string>} allowedRoles 
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { auth } = useContext(AuthContext);
    const location = useLocation();

    if (!auth.isAuthenticated) {
        if (location.pathname.includes('/invite')) {
            return <Navigate to="/" state={{ from: location.pathname + location.search, openLogin: true }} replace />;
        }
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(auth.user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
