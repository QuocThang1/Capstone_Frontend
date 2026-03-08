import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import GeneralLayout from "./layout/generalLayout";
import AdminLayout from "./layout/adminLayout";
import HomePage from "./pages/Home";
import ProfilePage from "./pages/profile";
import UserManagement from "./pages/Admin/User/userManagement";


const router = createBrowserRouter([
  {
    path: "/",
    element: <GeneralLayout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
  { path: "/register", element: <RegisterPage /> },
  { path: "/login", element: <LoginPage /> },
  {
    path: "/profile",
    element: (
      <ProtectedRoute allowedRoles={["admin", "user"]}>
        <ProfilePage />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element:
          <ProtectedRoute allowedRoles={["admin"]}>
            <ProfilePage />
          </ProtectedRoute>
      },
      {
        path: "users",
        element:
          <ProtectedRoute allowedRoles={["admin"]}>
            <UserManagement />
          </ProtectedRoute>
      }
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}