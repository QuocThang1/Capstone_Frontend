import { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Modal, Space, Table, Tag, message } from "antd";
import { Eye, Lock, MoreHorizontal, Unlock } from "lucide-react";
import SearchFilterBar from "@/components/adminPage/SearchFilterBar";
import StatusBadge from "@/components/adminPage/StatusBadge";
import {
  getAllPlatformUsersApi,
  togglePlatformUserLockApi,
} from "@/utils/Api/adminApi";

function isValidUrl(str) {
  if (!str) return false;
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function getInitials(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function normalizeUser(user) {
  const organizations = Array.isArray(user.organizations) ? user.organizations : [];

  return {
    id: user._id || user.id,
    name: user.fullName || user.email || "User",
    email: user.email || "",
    avatar: user.avatar,
    role: user.role || "user",
    major: user.major || "Not set",
    organizations,
    organization: organizations.map((org) => org.name).join(", ") || "No organization",
    status: user.active ? "Active" : "Locked",
    lastLogin: user.lastLogin || user.updatedAt || user.createdAt,
    raw: user,
  };
}

export default function PlatformUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getAllPlatformUsersApi({ limit: 100 });
    if (res?.EC === 0) {
      setUsers((res.data?.users || []).map(normalizeUser));
    } else {
      message.error(res?.EM || "Failed to load platform users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.major.toLowerCase().includes(search.toLowerCase()) ||
    user.organization.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  const toggleLock = async (userId) => {
    const res = await togglePlatformUserLockApi(userId);
    if (res?.EC === 0) {
      setUsers(users.map((user) => user.id === userId ? normalizeUser({ ...res.data, organizations: user.organizations }) : user));
      message.success(res.EM || "User status updated");
    } else {
      message.error(res?.EM || "Failed to update user status");
    }
  };

  const handleViewUser = (user) => {
    setViewUser(user);
    setIsViewModalOpen(true);
  };

  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={34}
            src={isValidUrl(record.avatar) ? record.avatar : undefined}
            className="bg-indigo-100 text-indigo-700 text-xs font-bold"
          >
            {getInitials(record.name)}
          </Avatar>
          <div className="min-w-0">
            <div className="font-medium text-slate-900 dark:text-slate-100 truncate">{record.name}</div>
            <div className="text-xs text-slate-500 truncate">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Organization",
      dataIndex: "organization",
      key: "organization",
      render: (_, record) => {
        const organizations = Array.isArray(record.organizations) ? record.organizations : [];

        if (!organizations.length) {
          return <span className="text-slate-400">No organization</span>;
        }

        return (
          <div className="flex flex-wrap gap-1.5">
            {organizations.slice(0, 2).map((org) => (
              <Tag key={org.id} color="geekblue" className="m-0">
                {org.name}
              </Tag>
            ))}
            {organizations.length > 2 && (
              <Tag className="m-0">+{organizations.length - 2}</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Major",
      dataIndex: "major",
      key: "major",
      render: (major) => <span className="text-slate-600 dark:text-slate-300">{major}</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "purple" : role === "leader" ? "blue" : "default"}>
          {role}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (date) => (
        <span className="text-slate-600 dark:text-slate-300">
          {date ? new Date(date).toLocaleDateString() : "Never"}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 50,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                label: (
                  <Space size={8}>
                    <Eye size={16} />
                    <span>View Profile</span>
                  </Space>
                ),
                key: "view",
                onClick: () => handleViewUser(record),
              },
              {
                label: (
                  <Space size={8}>
                    {record.status === "Locked" ? (
                      <>
                        <Unlock size={16} />
                        <span>Unlock Account</span>
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        <span>Lock Account</span>
                      </>
                    )}
                  </Space>
                ),
                key: "lock",
                className: record.status === "Locked" ? "text-emerald-600" : "text-amber-600",
                onClick: () => toggleLock(record.id),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" size="small" icon={<MoreHorizontal size={16} />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Users</h2>
      </div>

      <SearchFilterBar
        searchValue={search}
        onSearch={setSearch}
        filters={[
          { name: "role", label: "Role", options: ["admin", "leader", "user"] },
          { name: "status", label: "Status", options: ["Active", "Locked"] },
        ]}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            total: filteredUsers.length,
          }}
          scroll={{ x: 900 }}
        />
      </div>

      <Modal
        title="User Profile"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        {viewUser && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <Avatar
                size={64}
                src={isValidUrl(viewUser.avatar) ? viewUser.avatar : undefined}
                className="bg-indigo-100 text-indigo-700 font-bold"
              >
                {getInitials(viewUser.name)}
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{viewUser.name}</h3>
                <p className="text-sm text-slate-500">{viewUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Organization</p>
                <p>{viewUser.organization}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Major</p>
                <p>{viewUser.major}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Role</p>
                <p>{viewUser.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Status</p>
                <StatusBadge status={viewUser.status} className="mt-1" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Last Login</p>
                <p>{viewUser.lastLogin ? new Date(viewUser.lastLogin).toLocaleString() : "Never"}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
