import { useState } from "react";
import { Avatar, Button, Dropdown, Form, Input, message, Modal, Select, Space, Table } from "antd";
import { Plus, MoreHorizontal, Ban, CheckCircle } from "lucide-react";
import SearchFilterBar from "@/components/adminPage/SearchFilterBar";
import StatusBadge from "@/components/adminPage/StatusBadge";
import ConfirmModal from "@/components/adminPage/ConfirmModal";

const initialOrgs = [];

export default function OrganizationsPage() {
  const [form] = Form.useForm();
  const [orgs, setOrgs] = useState(initialOrgs);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, org: null, action: null });

  const filteredOrgs = orgs.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.owner.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (values) => {
    const newOrg = {
      id: `ORG-${Date.now()}`,
      name: values.name,
      owner: values.owner,
      plan: values.plan,
      users: 1,
      projects: 0,
      status: "Active",
      createdAt: new Date().toISOString(),
    };
    setOrgs([newOrg, ...orgs]);
    setIsCreateOpen(false);
    form.resetFields();
    message.success("Organization created successfully");
  };

  const handleStatusChange = () => {
    const { org, action } = confirmModal;
    setOrgs(orgs.map(o => o.id === org.id ? { ...o, status: action === 'suspend' ? 'Suspended' : 'Active' } : o));
    message.success(`Organization ${action === 'suspend' ? 'suspended' : 'activated'}`);
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
      render: (owner) => <span className="text-slate-600 dark:text-slate-300">{owner}</span>,
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
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
              { key: "billing", label: "Manage Billing" },
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
          { name: "plan", label: "Plan", options: ["Free", "Pro", "Business", "Enterprise"] },
          { name: "status", label: "Status", options: ["Active", "Suspended", "Trial", "Expired"] }
        ]}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredOrgs}
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
          initialValues={{ plan: "Free" }}
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
            label="Owner Email"
            name="owner"
            rules={[
              { required: true, message: "Please enter an owner email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="admin@acme.com" />
          </Form.Item>
          <Form.Item label="Plan" name="plan">
            <Select
              options={[
                { value: "Free", label: "Free" },
                { value: "Pro", label: "Pro" },
                { value: "Business", label: "Business" },
                { value: "Enterprise", label: "Enterprise" },
              ]}
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
