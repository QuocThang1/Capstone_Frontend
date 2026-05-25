import {
  LayoutDashboard,
  CircuitBoard,
  Scroll,
  GitBranch,
  Activity,
  List,
  Zap,
  Users,
  Lock,
  FileText,
  Upload,
  Workflow,
  AlertCircle
} from 'lucide-react';

// Dựa trên routes định nghĩa trong appRouter.jsx
export const PROJECT_TABS = [
  // Core Tabs (3 tab mặc định)
  { 
    id: 'overview', 
    label: 'Summary', 
    icon: LayoutDashboard, 
    path: '/overview', 
    isDefault: true,
    section: 'core'
  },
  { 
    id: 'board', 
    label: 'Board', 
    icon: CircuitBoard, 
    path: '/board', 
    isDefault: false,
    section: 'core'
  },
  { 
    id: 'backlog', 
    label: 'Backlog', 
    icon: Scroll, 
    path: '/backlog', 
    isDefault: false,
    section: 'core'
  },
  
  // Monitor Section
  { 
    id: 'list', 
    label: 'Issue List', 
    icon: List, 
    path: '/list', 
    isDefault: false,
    section: 'monitor'
  },
  { 
    id: 'realtime-logs', 
    label: 'Real-time Logs', 
    icon: Activity, 
    path: '/realtime-logs', 
    isDefault: false,
    section: 'monitor'
  },

  // Intelligence Section
  { 
    id: 'process-flow', 
    label: 'Process Flow', 
    icon: GitBranch, 
    path: '/process-flow', 
    isDefault: false,
    section: 'intelligence'
  },
  { 
    id: 'bottleneck-detector', 
    label: 'Bottleneck', 
    icon: AlertCircle, 
    path: '/bottleneck-detector', 
    isDefault: false,
    section: 'intelligence'
  },

  // Management Section
  { 
    id: 'team-health', 
    label: 'Team Health', 
    icon: Users, 
    path: '/team-health', 
    isDefault: false,
    section: 'management'
  },
  { 
    id: 'rbac', 
    label: 'Permissions', 
    icon: Lock, 
    path: '/rbac', 
    isDefault: false,
    section: 'management'
  },
  { 
    id: 'audit-logs', 
    label: 'Audit Logs', 
    icon: FileText, 
    path: '/audit-logs', 
    isDefault: false,
    section: 'management'
  },

  // Operations Section
  { 
    id: 'import-export', 
    label: 'Import/Export', 
    icon: Upload, 
    path: '/import-export', 
    isDefault: false,
    section: 'operations'
  },
  { 
    id: 'automation-rules', 
    label: 'Automation', 
    icon: Workflow, 
    path: '/automation-rules', 
    isDefault: false,
    section: 'operations'
  },
];

export default PROJECT_TABS;
