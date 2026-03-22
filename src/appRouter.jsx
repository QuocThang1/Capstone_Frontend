import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import GeneralLayout from "./layout/generalLayout";
import AdminLayout from "./layout/adminLayout";
import HomePage from "./pages/home";
import ProfilePage from "./pages/profile";
import UserManagement from "./pages/Admin/User/userManagement";
import UserLayout from "./layout/userLayout";
import ForYou from "./pages/Admin/Project/forYou";


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
  {
    path: "/projects",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element:
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <ForYou />
          </ProtectedRoute>
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}