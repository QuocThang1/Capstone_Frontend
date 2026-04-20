import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute";
import GeneralLayout from "./layout/generalLayout";
import AdminLayout from "./layout/adminLayout";
import HomePage from "./pages/home";
import ProfilePage from "./pages/profile";
import UserManagement from "./pages/Admin/User/userManagement";
import UserLayout from "./layout/userLayout";
import ForYou from "./pages/Project/forYou";
import ProjectManagement from "./pages/Project/ProjectManagement/projectManagement";
import ProjectPage from "./pages/Project/ProjectDetail/projectPage";
import Summary from "./pages/Project/ProjectDetail/summary";
import Board from "./pages/Project/ProjectDetail/board";
import Backlog from "./pages/Project/ProjectDetail/Backlog/backlog";

// Coming Soon Pages
import OverviewDashboard from "./pages/Monitor/OverviewDashboard";
import RealTimeEventLog from "./pages/Monitor/RealTimeEventLog";
import ProcessFlow from "./pages/Intelligence/ProcessFlow";
import BottleneckDetector from "./pages/Intelligence/BottleneckDetector";
import TeamHealth from "./pages/Management/TeamHealth";
import RBACPermissions from "./pages/Management/RBACPermissions";
import AuditLogs from "./pages/Management/AuditLogs";
import ImportExportData from "./pages/Operations/ImportExportData";
import AutomationRules from "./pages/Operations/AutomationRules";


const router = createBrowserRouter([
  {
    path: "/",
    element: <GeneralLayout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
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
      {
        path: "management",
        element:
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <ProjectManagement />
          </ProtectedRoute>
      },
      {
        path: ":projectId",
        element: (
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <ProjectPage />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="summary" replace />,
          },
          {
            path: "summary",
            element: <Summary />,
          },
          {
            path: "board",
            element: <Board />,
          },
          {
            path: "backlog",
            element: <Backlog />,
          },
        ]
      }
    ],
  },
  // Coming Soon Pages with UserLayout
  {
    path: "/",
    element: <UserLayout />,
    children: [
      // Monitor Section
      {
        path: "overview",
        element:
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <OverviewDashboard />
          </ProtectedRoute>
      },
      {
        path: "events",
        element:
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <RealTimeEventLog />
          </ProtectedRoute>
      },
      // Intelligence Section
      {
        path: "process",
        element:
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <ProcessFlow />
          </ProtectedRoute>
      },
      {
        path: "bottlenecks",
        element:
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <BottleneckDetector />
          </ProtectedRoute>
      },
      // Management Section
      {
        path: "team",
        element:
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <TeamHealth />
          </ProtectedRoute>
      },
      {
        path: "rbac",
        element:
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <RBACPermissions />
          </ProtectedRoute>
      },
      {
        path: "audit",
        element:
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <AuditLogs />
          </ProtectedRoute>
      },
      // Operations Section
      {
        path: "data",
        element:
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <ImportExportData />
          </ProtectedRoute>
      },
      {
        path: "automation",
        element:
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <AutomationRules />
          </ProtectedRoute>
      }
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}