import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute";
import GeneralLayout from "./layout/generalLayout";
import AdminLayout from "./layout/adminLayout";
import UserLayout from "./layout/userLayout";
import ProjectDetailsLayout from "./components/ProjectDetailsLayout";
import HomePage from "./pages/home";
import ProfilePage from "./pages/profile";
import UserManagement from "./pages/Admin/User/userManagement";
import ForYou from "./pages/Project/forYou";
import ProjectManagement from "./pages/Project/ProjectManagement/projectManagement";
import ProjectPage from "./pages/Project/ProjectDetail/projectPage";
import Summary from "./pages/Project/ProjectDetail/summary";
import Board from "./pages/Project/ProjectDetail/Board/board";
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
      // Nested project routes with ProjectNavbar
      {
        path: ":projectId",
        element:
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <ProjectDetailsLayout />
          </ProtectedRoute>,
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
            path: "realtime-logs",
            element:
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <RealTimeEventLog />
              </ProtectedRoute>
          },
          // Intelligence Section
          {
            path: "process-flow",
            element:
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <ProcessFlow />
              </ProtectedRoute>
          },
          {
            path: "bottleneck-detector",
            element:
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <BottleneckDetector />
              </ProtectedRoute>
          },
          // Management Section
          {
            path: "team-health",
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
            path: "audit-logs",
            element:
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <AuditLogs />
              </ProtectedRoute>
          },
          // Operations Section
          {
            path: "import-export",
            element:
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <ImportExportData />
              </ProtectedRoute>
          },
          {
            path: "automation-rules",
            element:
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <AutomationRules />
              </ProtectedRoute>
          },
          // Default redirect to overview
          {
            index: true,
            element: <Navigate to="overview" replace />
          }
        ]
      }
    ],
  },
  // Legacy routes (keep for backward compatibility)
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
  // Legacy routes (keep for backward compatibility)
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