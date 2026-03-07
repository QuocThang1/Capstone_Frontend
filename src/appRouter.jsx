import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import GeneralLayout from "./layout/generalLayout";
import HomePage from "./pages/Home";


const router = createBrowserRouter([
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <GeneralLayout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}