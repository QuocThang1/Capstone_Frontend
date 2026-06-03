import { useEffect, useRef, useState } from "react";
import { Bell, Eye, Send, Trash2 } from "lucide-react";
import { App, Button, Checkbox, Empty, Form, Input, Modal, Select, Spin, Table } from "antd";
import SectionCard from "@/components/adminPage/SectionCard";
import StatusBadge from "@/components/adminPage/StatusBadge";
import {
  createGlobalNotificationApi,
  deleteGlobalNotificationApi,
  getAdminMessageTemplatesApi,
  getAllGlobalNotificationsApi,
} from "@/utils/Api/adminApi";

export default function GlobalNotificationsPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const composeRef = useRef(null);
  const [notifs, setNotifs] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [viewTemplate, setViewTemplate] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const [notificationRes, templateRes] = await Promise.all([
      getAllGlobalNotificationsApi(),
      getAdminMessageTemplatesApi(),
    ]);

    if (notificationRes?.EC === 0) setNotifs(notificationRes.data || []);
    else message.error(notificationRes?.EM || "Failed to load notification history");

    if (templateRes?.EC === 0) setTemplates(templateRes.data || []);
    else message.error(templateRes?.EM || "Failed to load message templates");
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTemplateChange = (templateId) => {
    const template = templates.find((item) => item.id === templateId);
    if (!template) return;
    form.setFieldsValue({
      title: template.title,
      message: template.message,
      type: template.type,
      channels: template.channels,
    });
  };

  const handleUseTemplate = (template) => {
    handleTemplateChange(template.id);
    composeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSend = async (values) => {
    setSending(true);
    const res = await createGlobalNotificationApi(values);
    if (res?.EC === 0) {
      setNotifs((current) => [res.data, ...current]);
      message.success(res.EM || "Notification sent successfully");
      form.resetFields();
    } else {
      message.error(res?.EM || "Failed to send notification");
    }
    setSending(false);
  };

  const handleDelete = async (notificationId) => {
    setDeletingId(notificationId);
    const res = await deleteGlobalNotificationApi(notificationId);
    if (res?.EC === 0) {
      setNotifs((current) => current.filter((notification) => notification.id !== notificationId));
      message.success(res.EM || "Notification deleted");
    } else {
      message.error(res?.EM || "Failed to delete notification");
    }
    setDeletingId(null);
  };

  const historyColumns = [
    {
      title: "Title & Message",
      dataIndex: "title",
      key: "title",
      render: (title, notification) => (
        <div className="max-w-md">
          <div className="font-medium text-slate-900 dark:text-slate-100">{title}</div>
          <div className="text-sm text-slate-500 truncate">{notification.message}</div>
        </div>
      ),
    },
    { title: "Type", dataIndex: "type", key: "type", render: (type) => <StatusBadge status={type} /> },
    { title: "Target", dataIndex: "target", key: "target" },
    { title: "Channels", dataIndex: "channels", key: "channels", render: (channels) => channels.join(", ") },
    { title: "Recipients", dataIndex: "recipientCount", key: "recipientCount", align: "right" },
    { title: "Status", dataIndex: "status", key: "status", render: (status) => <StatusBadge status={status} /> },
    {
      title: "Time",
      dataIndex: "sentAt",
      key: "sentAt",
      render: (sentAt) => new Date(sentAt).toLocaleString(),
    },
    {
      title: "",
      key: "actions",
      render: (_, notification) => (
        <Button
          type="text"
          danger
          loading={deletingId === notification.id}
          icon={<Trash2 className="h-4 w-4" />}
          onClick={() => handleDelete(notification.id)}
        />
      ),
    },
  ];

  const templateColumns = [
    { title: "Template", dataIndex: "name", key: "name" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Channels", dataIndex: "channels", key: "channels", render: (channels) => channels.join(", ") },
    {
      title: "",
      key: "actions",
      render: (_, template) => (
        <div className="flex gap-1">
          {template.category === "Notification" && (
            <Button type="link" onClick={() => handleUseTemplate(template)}>
              Use
            </Button>
          )}
          <Button
            type="text"
            icon={<Eye className="h-4 w-4" />}
            onClick={() => setViewTemplate(template)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="flex min-h-[420px] items-center justify-center"><Spin size="large" /></div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Global Notifications</h2>

      <div ref={composeRef}>
      <SectionCard title="Compose Broadcast" description="Send announcements, alerts, or maintenance notices to users.">
        <Form
          form={form}
          layout="vertical"
          initialValues={{ type: "Info", target: "All Users", channels: ["In-App"] }}
          onFinish={handleSend}
          className="admin-indigo-form"
        >
          <Form.Item label="Use Notification Template">
            <Select
              allowClear
              placeholder="Select a reusable notification template"
              options={templates
                .filter((template) => template.category === "Notification")
                .map((template) => ({ value: template.id, label: template.name }))}
              onChange={handleTemplateChange}
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Form.Item label="Notification Title" name="title" rules={[{ required: true }]}>
                <Input placeholder="e.g. Scheduled Maintenance" />
              </Form.Item>
              <Form.Item label="Message Content" name="message" rules={[{ required: true }]}>
                <Input.TextArea rows={5} placeholder="Write your message here..." />
              </Form.Item>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
              <Form.Item label="Type" name="type">
                <Select options={["Info", "Warning", "Maintenance", "Critical"].map((value) => ({ value, label: value }))} />
              </Form.Item>
              <Form.Item label="Target Audience" name="target">
                <Select options={["All Users", "Platform Admins", "Leaders"].map((value) => ({ value, label: value }))} />
              </Form.Item>
              <Form.Item label="Delivery Channels" name="channels" rules={[{ required: true }]}>
                <Checkbox.Group options={["In-App", "Email"]} />
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={sending} icon={<Send className="w-4 h-4" />}>
              Broadcast Notification
            </Button>
          </div>
        </Form>
      </SectionCard>
      </div>

      <SectionCard title="Reusable Templates" description="Email templates and common notification content stored in MongoDB.">
        <Table
          columns={templateColumns}
          dataSource={templates}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: <Empty description="No templates available" /> }}
        />
      </SectionCard>

      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Broadcast History
        </h3>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <Table
            columns={historyColumns}
            dataSource={notifs}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
            locale={{ emptyText: <Empty description="No broadcasts yet" /> }}
          />
        </div>
      </div>

      <Modal
        open={!!viewTemplate}
        title="Template Details"
        footer={null}
        onCancel={() => setViewTemplate(null)}
      >
        {viewTemplate && (
          <div className="space-y-4 pt-2 text-sm">
            <div>
              <span className="block text-slate-500">Template</span>
              <span className="font-semibold text-slate-900 dark:text-white">{viewTemplate.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-slate-500">Category</span>
                <span>{viewTemplate.category}</span>
              </div>
              <div>
                <span className="block text-slate-500">Channels</span>
                <span>{viewTemplate.channels.join(", ")}</span>
              </div>
            </div>
            <div>
              <span className="block text-slate-500">Title</span>
              <span className="font-medium">{viewTemplate.title}</span>
            </div>
            <div>
              <span className="mb-1 block text-slate-500">Content</span>
              <div className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {viewTemplate.message || "No text content."}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
