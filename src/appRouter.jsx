import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { App as AntApp, ConfigProvider } from "antd";
import ProtectedRoute from "./route/ProtectedRoute";
import GeneralLayout from "./layout/generalLayout";
import AdminLayout from "./layout/adminLayout";
import UserLayout from "./layout/userLayout";
import HomePage from "./pages/home";
import ProfilePage from "./pages/profile";
import PlatformDashboard from "./pages/Admin/PlatformDashboard";
import PlatformUsersPage from "./pages/Admin/PlatformUsersPage";
import OrganizationsPage from "./pages/Admin/OrganizationsPage";
import SupportCenterPage from "./pages/Admin/SupportCenterPage";
import SystemHealthPage from "./pages/Admin/SystemHealthPage";
import GlobalNotificationsPage from "./pages/Admin/GlobalNotificationsPage";
import DataSecurityPage from "./pages/Admin/DataSecurityPage";
import AuditLogsPage from "./pages/Admin/AuditLogsPage";
import RolesPermissionsPage from "./pages/Admin/RolesPermissionsPage";
import SystemSettingsPage from "./pages/Admin/SystemSettingsPage";
import ForYou from "./pages/Project/forYou";
import ProjectManagement from "./pages/Project/ProjectManagement/projectManagement";
import AcceptInvite from "./pages/acceptInvite";
import ProjectDetailsLayout from "./layout/projectDetailsLayout";
import Board from "./pages/Project/ProjectDetail/Board/board";
import Backlog from "./pages/Project/ProjectDetail/Backlog/backlog";
import ProcessFlow from "./pages/Project/ProjectDetail/ProcessFlow/processFlow";
import TeamHealth from "./pages/Project/ProjectDetail/TeamHealth/teamHealth";
import BottleneckDetector from "./pages/Project/ProjectDetail/Bottleneck/bottleneckDetector";
import IssueList from "./pages/Project/ProjectDetail/List/issueList";
import RealTimeEventLog from "./pages/Project/ProjectDetail/EventLog/RealTimeEventLog";
import AutomationRules from "./pages/Project/ProjectDetail/AutomationRules/automationRules";
import OverviewDashboard from "./pages/Project/ProjectDetail/Summary/OverviewDashboard";
import ChartPage from "./pages/Project/ProjectDetail/Chart/chartPage";
import GitHubCallback from "./pages/auth/GitHubCallback";
import GoogleCallback from "./pages/auth/GoogleCallback";


const router = createBrowserRouter([
  {
    path: "/auth/github/callback",
    element: <GitHubCallback />
  },
  {
    path: "/auth/google/callback",
    element: <GoogleCallback />
  },
  {
    path: "/",
    element: <GeneralLayout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
  {
    path: "/profile",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element:
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <ProfilePage />
          </ProtectedRoute>
      }
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element:
          <ProtectedRoute allowedRoles={["admin"]}>
            <PlatformDashboard />
          </ProtectedRoute>
      },
      {
        path: "users",
        element:
          <ProtectedRoute allowedRoles={["admin"]}>
            <PlatformUsersPage />
          </ProtectedRoute>
      },
      {
        path: "platform-users",
        element:
          <ProtectedRoute allowedRoles={["admin"]}>
            <PlatformUsersPage />
          </ProtectedRoute>
      },
      {
        path: "organizations",
        element:
          <ProtectedRoute allowedRoles={["admin"]}>
            <OrganizationsPage />
          </ProtectedRoute>
      },
      {
        path: "support",
        element:
          <ProtectedRoute allowedRoles={["admin"]}>
            <SupportCenterPage />
          </ProtectedRoute>
      },
      {
        path: "health",
        element:
          <ProtectedRoute allowedRoles={["admin"]}>
            <SystemHealthPage />
          </ProtectedRoute>
      },
      {
        path: "notifications",
        element:
          <ProtectedRoute allowedRoles={["admin"]}>
            <GlobalNotificationsPage />
          </ProtectedRoute>
      },
      {
        path: "security",
        element:
          <ProtectedRoute allowedRoles={["admin"]}>
            <DataSecurityPage />
          </ProtectedRoute>
      },
      {
        path: "audit-logs",
        element:
          <ProtectedRoute allowedRoles={["admin"]}>
            <AuditLogsPage />
          </ProtectedRoute>
      },
      {
        path: "roles",
        element:
          <ProtectedRoute allowedRoles={["admin"]}>
            <RolesPermissionsPage />
          </ProtectedRoute>
      },
      {
        path: "settings",
        element:
          <ProtectedRoute allowedRoles={["admin"]}>
            <SystemSettingsPage />
          </ProtectedRoute>
      }
    ],
  },
  {
    path: "/project/invite",
    element: (
      <ProtectedRoute allowedRoles={["admin", "user"]}>
        <AcceptInvite />
      </ProtectedRoute>
    )
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
          {
            index: true,
            element: <Navigate to="overview" replace />
          },
          {
            path: "board",
            element:
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <Board />
              </ProtectedRoute>
          },
          {
            path: "backlog",
            element:
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <Backlog />
              </ProtectedRoute>
          },
          // Monitor Section
          {
            path: "overview",
            element:
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <OverviewDashboard />
              </ProtectedRoute>
          },
          {
            path: "list",
            element:
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <IssueList />
              </ProtectedRoute>
          },
          {
            path: "chart",
            element:
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <ChartPage />
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
            path: "automation-rules",
            element:
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <AutomationRules />
              </ProtectedRoute>
          },
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
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#6366f1",
          colorPrimaryHover: "#4f46e5",
          colorPrimaryActive: "#4338ca",
          colorInfo: "#6366f1",
          borderRadius: 8,
        },
      }}
    >
      <AntApp>
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  );
}
