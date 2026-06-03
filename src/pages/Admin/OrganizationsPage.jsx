import { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Form, Input, message, Modal, Select, Space, Table } from "antd";
import { Plus, MoreHorizontal, Ban, CheckCircle } from "lucide-react";
import SearchFilterBar from "@/components/adminPage/SearchFilterBar";
import StatusBadge from "@/components/adminPage/StatusBadge";
import ConfirmModal from "@/components/adminPage/ConfirmModal";
import {
  createOrganizationApi,
  getAllOrganizationsApi,
  getAllPlatformUsersApi,
  toggleOrganizationStatusApi,
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

function UserAvatar({ user, size = 32 }) {
  const name = user?.fullName || user?.email || "User";

  return (
    <Avatar
      size={size}
      src={isValidUrl(user?.avatar) ? user.avatar : undefined}
      className="bg-indigo-100 text-indigo-700 text-xs font-bold shrink-0"
    >
      {getInitials(name)}
    </Avatar>
  );
}

export default function OrganizationsPage() {
  const [form] = Form.useForm();
  const [orgs, setOrgs] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, org: null, action: null });

  const filteredOrgs = orgs.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    (o.owner || "").toLowerCase().includes(search.toLowerCase())
  );

  const fetchOrganizations = async () => {
    setLoading(true);
    const res = await getAllOrganizationsApi({ limit: 100 });
    if (res?.EC === 0) {
      setOrgs(res.data?.organizations || []);
    } else {
      message.error(res?.EM || "Failed to load organizations");
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    const res = await getAllPlatformUsersApi({ limit: 100 });
    if (res?.EC === 0) {
      setUsers(res.data?.users || []);
    } else {
      message.error(res?.EM || "Failed to load users");
    }
    setUsersLoading(false);
  };

  useEffect(() => {
    fetchOrganizations();
    fetchUsers();
  }, []);

  const handleCreate = async (values) => {
    const res = await createOrganizationApi({
      name: values.name,
      ownerIds: values.ownerIds,
    });

    if (res?.EC === 0) {
      setOrgs([res.data, ...orgs]);
      setIsCreateOpen(false);
      form.resetFields();
      message.success("Organization created successfully");
    } else {
      message.error(res?.EM || "Failed to create organization");
    }
  };

  const handleStatusChange = async () => {
    const { org, action } = confirmModal;
    const res = await toggleOrganizationStatusApi(org.id);
    if (res?.EC === 0) {
      setOrgs(orgs.map(o => o.id === org.id ? res.data : o));
      message.success(`Organization ${action === 'suspend' ? 'suspended' : 'activated'}`);
    } else {
      message.error(res?.EM || "Failed to update organization status");
    }
  };

  const columns = [
    {
      title: "Organization",
      dataIndex: "name",
      key: "name",
      render: (name, org) => (
        <div className="flex items-center gap-3">
          <Avatar size={32} className="bg-indigo-100 text-indigo-700 text-xs font-bold">
            {name.substring(0, 2).toUpperCase()}
          </Avatar>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{name}</div>
            <div className="text-xs text-slate-500">{org.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
      render: (_, org) => {
        const owners = Array.isArray(org.owners) ? org.owners : [];

        if (owners.length === 0) {
          return <span className="text-slate-600 dark:text-slate-300">{org.owner || "No owner"}</span>;
        }

        return (
          <div className="flex flex-col gap-2">
            {owners.slice(0, 2).map((owner) => (
              <div key={owner._id || owner.email} className="flex items-center gap-2.5">
                <UserAvatar user={owner} />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                    {owner.fullName || owner.email}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {owner.email}
                  </div>
                </div>
              </div>
            ))}
            {owners.length > 2 && (
              <span className="text-xs text-slate-500">+{owners.length - 2} more</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Users",
      dataIndex: "users",
      key: "users",
      align: "right",
    },
    {
      title: "Projects",
      dataIndex: "projects",
      key: "projects",
      align: "right",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => (
        <span className="text-slate-600 dark:text-slate-300">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 50,
      render: (_, org) => (
        <Dropdown
          menu={{
            items: [
              { key: "view", label: "View Details" },
              {
                key: "status",
                className: org.status === "Active" ? "text-red-600" : "text-emerald-600",
                label: (
                  <Space size={8}>
                    {org.status === "Active" ? <Ban size={16} /> : <CheckCircle size={16} />}
                    <span>{org.status === "Active" ? "Suspend" : "Activate"}</span>
                  </Space>
                ),
                onClick: () => setConfirmModal({
                  open: true,
                  org,
                  action: org.status === "Active" ? "suspend" : "activate",
                }),
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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Organizations</h2>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Create Organization
        </Button>
      </div>

      <SearchFilterBar 
        searchValue={search} 
        onSearch={setSearch}
        filters={[
          { name: "status", label: "Status", options: ["Active", "Suspended"] }
        ]}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredOrgs}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            total: filteredOrgs.length,
          }}
          scroll={{ x: 900 }}
        />
      </div>

      <Modal
        title="Create Organization"
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        onOk={() => form.submit()}
        okText="Create"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            label="Organization Name"
            name="name"
            rules={[{ required: true, message: "Please enter an organization name" }]}
          >
            <Input placeholder="e.g. Acme Corp" />
          </Form.Item>
          <Form.Item
            label="Owners"
            name="ownerIds"
            rules={[
              { required: true, message: "Please select at least one owner" },
            ]}
          >
            <Select
              mode="multiple"
              loading={usersLoading}
              showSearch
              optionFilterProp="searchLabel"
              placeholder="Select platform users"
              options={users.map((user) => ({
                value: user._id,
                label: user.fullName || user.email,
                searchLabel: `${user.fullName || ""} ${user.email || ""}`,
                user,
              }))}
              optionRender={(option) => {
                const user = option.data?.user || users.find((item) => item._id === option.value);
                const displayName = user?.fullName || user?.email || option.label || "User";

                return (
                  <div className="flex items-center gap-3 py-1">
                    <UserAvatar user={user} size={34} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {displayName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || ""}
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <ConfirmModal 
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, org: null, action: null })}
        onConfirm={handleStatusChange}
        title={`${confirmModal.action === 'suspend' ? 'Suspend' : 'Activate'} Organization`}
        message={`Are you sure you want to ${confirmModal.action} ${confirmModal.org?.name}?`}
        variant={confirmModal.action === 'suspend' ? 'danger' : 'warning'}
        confirmLabel={confirmModal.action === 'suspend' ? 'Suspend' : 'Activate'}
      />
    </div>
  );
}
