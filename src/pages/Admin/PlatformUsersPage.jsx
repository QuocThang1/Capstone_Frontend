import { useState } from "react";
import { Table, Button, Dropdown, Modal, Avatar, Space } from "antd";
import { MoreHorizontal, Lock, Unlock, Eye } from "lucide-react";
import { message } from "antd";
import SearchFilterBar from "@/components/adminPage/SearchFilterBar";
import StatusBadge from "@/components/adminPage/StatusBadge";
import { cn } from "@/lib/utils";

const initialUsers = [];

export default function PlatformUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [viewUser, setViewUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.organization.toLowerCase().includes(search.toLowerCase())
  );

  const toggleLock = (userId, currentStatus) => {
    const newStatus = currentStatus === 'Locked' ? 'Active' : 'Locked';
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    message.success(`User account ${newStatus.toLowerCase()}`);
  };

  const handleViewUser = (user) => {
    setViewUser(user);
    setIsViewModalOpen(true);
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'user',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar size={32}>
            {record.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{record.name}</div>
            <div className="text-xs text-slate-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Organization',
      dataIndex: 'organization',
      key: 'organization',
      render: (text) => <span className="text-slate-600 dark:text-slate-300">{text}</span>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date) => (
        <span className="text-slate-600 dark:text-slate-300">
          {date ? new Date(date).toLocaleDateString() : 'Never'}
        </span>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 50,
      render: (text, record) => (
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
                key: 'view',
                onClick: () => handleViewUser(record),
              },
              {
                label: (
                  <Space size={8}>
                    {record.status === 'Locked' ? (
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
                key: 'lock',
                className: record.status === 'Locked' ? 'text-emerald-600' : 'text-amber-600',
                onClick: () => toggleLock(record.id, record.status),
              },
            ],
          }}
          trigger={['click']}
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
          { name: "role", label: "Role", options: ["Super Admin", "Org Admin", "Project Manager", "Developer", "Designer"] },
          { name: "status", label: "Status", options: ["Active", "Locked", "Pending", "Suspended"] }
        ]}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            total: filteredUsers.length,
          }}
          scroll={{ x: 800 }}
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
              <Avatar size={64}>
                {viewUser.name.split(' ').map(n => n[0]).join('')}
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
                <p className="text-sm font-medium text-slate-500">Role</p>
                <p>{viewUser.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Status</p>
                <StatusBadge status={viewUser.status} className="mt-1" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Last Login</p>
                <p>{viewUser.lastLogin ? new Date(viewUser.lastLogin).toLocaleString() : 'Never'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}