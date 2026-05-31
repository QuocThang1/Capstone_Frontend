import { useState } from "react";
import { Bell, Send } from "lucide-react";
import { Button, Checkbox, Form, Input, message, Radio, Select, Table } from "antd";
import SectionCard from "@/components/adminPage/SectionCard";
import StatusBadge from "@/components/adminPage/StatusBadge";

const initialNotifs = [];

export default function GlobalNotificationsPage() {
  const [form] = Form.useForm();
  const [notifs, setNotifs] = useState(initialNotifs);

  const handleSend = (values) => {
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title: values.title,
      message: values.message,
      type: values.type,
      target: values.target,
      channels: values.channels,
      status: values.schedule === "now" ? "Sent" : "Scheduled",
      sentAt: values.schedule === "now" ? new Date().toISOString() : null,
      scheduledAt: values.schedule === "later" ? new Date(Date.now() + 86400000).toISOString() : null,
    };

    setNotifs([newNotif, ...notifs]);
    message.success(values.schedule === "now" ? "Notification sent successfully" : "Notification scheduled");
    form.resetFields();
  };

  const columns = [
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
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => <StatusBadge status={type} />,
    },
    {
      title: "Target",
      dataIndex: "target",
      key: "target",
      render: (target) => <span className="text-sm text-slate-600 dark:text-slate-300">{target}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: "Time",
      key: "time",
      align: "right",
      render: (_, notification) => (
        <span className="text-sm text-slate-500">
          {notification.sentAt
            ? new Date(notification.sentAt).toLocaleString()
            : notification.scheduledAt
              ? `Sch: ${new Date(notification.scheduledAt).toLocaleString()}`
              : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Global Notifications</h2>
      </div>

      <SectionCard title="Compose Broadcast" description="Send announcements, alerts, or maintenance notices to users.">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: "Info",
            target: "All Users",
            channels: ["In-App"],
            schedule: "now",
          }}
          onFinish={handleSend}
          className="admin-indigo-form"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Form.Item
                label="Notification Title"
                name="title"
                rules={[{ required: true, message: "Please enter a notification title" }]}
              >
                <Input placeholder="e.g. Scheduled Maintenance" />
              </Form.Item>

              <Form.Item
                label="Message Content"
                name="message"
                rules={[{ required: true, message: "Please enter a message" }]}
              >
                <Input.TextArea rows={5} placeholder="Write your message here..." />
              </Form.Item>
            </div>

            <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
              <Form.Item label="Type" name="type">
                <Select
                  options={[
                    { value: "Info", label: "Info" },
                    { value: "Warning", label: "Warning" },
                    { value: "Maintenance", label: "Maintenance" },
                    { value: "Critical", label: "Critical" },
                  ]}
                />
              </Form.Item>

              <Form.Item label="Target Audience" name="target">
                <Select
                  options={[
                    { value: "All Users", label: "All Users" },
                    { value: "Organization Admins", label: "Organization Admins Only" },
                    { value: "Specific Organization", label: "Specific Organization" },
                  ]}
                />
              </Form.Item>

              <Form.Item label="Delivery Channels" name="channels">
                <Checkbox.Group
                  options={[
                    { value: "In-App", label: "In-App" },
                    { value: "Email", label: "Email" },
                  ]}
                />
              </Form.Item>

              <Form.Item label="Schedule" name="schedule" className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <Radio.Group>
                  <Radio value="now">Send Now</Radio>
                  <Radio value="later">Schedule for Later</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full sm:w-auto bg-indigo-600 hover:!bg-indigo-700"
              icon={<Send className="w-4 h-4" />}
            >
              Broadcast Notification
            </Button>
          </div>
        </Form>
      </SectionCard>

      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Broadcast History
        </h3>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <Table
            columns={columns}
            dataSource={notifs}
            rowKey="id"
            pagination={{ pageSize: 10, total: notifs.length }}
            scroll={{ x: 800 }}
          />
        </div>
      </div>
    </div>
  );
}
