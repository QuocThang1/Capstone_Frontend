import { useCallback, useEffect, useState } from "react";
import { App, Button, Descriptions, Empty, Modal, Table } from "antd";
import { Activity, Database, Eye, Mail, Stethoscope } from "lucide-react";
import SearchFilterBar from "@/components/adminPage/SearchFilterBar";
import StatusBadge from "@/components/adminPage/StatusBadge";
import { cn } from "@/lib/utils";
import {
  closeSupportTicketApi,
  getAllSupportTicketsApi,
  getSupportTicketByIdApi,
  runSupportDiagnosticApi,
} from "@/utils/Api/adminApi";

const diagnostics = [
  { key: "mail", name: "Check Mail Queue", icon: Mail },
  { key: "websocket", name: "Test WebSockets", icon: Activity },
  { key: "database-indexes", name: "Verify DB Indexes", icon: Database },
  { key: "full", name: "Full System Check", icon: Stethoscope },
];

export default function SupportCenterPage() {
  const { message } = App.useApp();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [loading, setLoading] = useState(true);
  const [viewTicket, setViewTicket] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [runningDiagnostic, setRunningDiagnostic] = useState(null);
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    const res = await getAllSupportTicketsApi({
      limit: 100,
      search: search.trim() || undefined,
      status: status === "all" ? undefined : status,
      priority: priority === "all" ? undefined : priority,
    });
    if (res?.EC === 0) {
      setTickets(res.data?.tickets || []);
    } else {
      message.error(res?.EM || "Failed to load support tickets");
    }
    setLoading(false);
  }, [message, priority, search, status]);

  useEffect(() => {
    const timer = setTimeout(loadTickets, 250);
    return () => clearTimeout(timer);
  }, [loadTickets]);

  const handleViewTicket = async (ticket) => {
    setViewTicket(ticket);
    setDetailLoading(true);
    const res = await getSupportTicketByIdApi(ticket.id);
    if (res?.EC === 0) {
      setViewTicket(res.data);
    } else {
      message.error(res?.EM || "Failed to load ticket details");
    }
    setDetailLoading(false);
  };

  const handleResolveTicket = async () => {
    setActionLoading(true);
    const res = await closeSupportTicketApi(viewTicket.id);
    if (res?.EC === 0) {
      setViewTicket(res.data);
      setTickets((current) => current.map((ticket) => ticket.id === res.data.id ? res.data : ticket));
      message.success(res.EM);
    } else {
      message.error(res?.EM || "Failed to resolve support ticket");
    }
    setActionLoading(false);
  };

  const runDiagnostic = async (diagnostic) => {
    setRunningDiagnostic(diagnostic.key);
    const res = await runSupportDiagnosticApi(diagnostic.key);
    if (res?.EC === 0) {
      setDiagnosticResult({ name: diagnostic.name, ...res.data });
      if (res.data.status === "Operational") {
        message.success(`${diagnostic.name} completed`);
      } else {
        message.warning(`${diagnostic.name} requires review`);
      }
    } else {
      message.error(res?.EM || `${diagnostic.name} failed`);
    }
    setRunningDiagnostic(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Support Center</h2>
        <div className="flex flex-wrap gap-2">
          {diagnostics.map((diagnostic) => (
            <Button key={diagnostic.key} size="small" loading={runningDiagnostic === diagnostic.key} onClick={() => runDiagnostic(diagnostic)}>
              <diagnostic.icon className="mr-2 h-4 w-4" /> {diagnostic.name}
            </Button>
          ))}
        </div>
      </div>

      <SearchFilterBar
        searchValue={search}
        onSearch={setSearch}
        filters={[
          { name: "status", label: "Status", value: status, options: ["Open", "In Progress", "Resolved", "Closed"] },
          { name: "priority", label: "Priority", value: priority, options: ["Low", "Medium", "High", "Critical"] },
        ]}
        onFilter={(name, value) => name === "status" ? setStatus(value) : setPriority(value)}
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Table
          dataSource={tickets}
          loading={loading}
          rowKey="id"
          locale={{ emptyText: <Empty description="No support tickets" /> }}
          columns={[
            { title: "Ticket ID", dataIndex: "ticketCode", key: "ticketCode", render: (id) => <span className="font-mono text-xs text-slate-500">{id}</span> },
            { title: "Subject", dataIndex: "subject", key: "subject", render: (subject) => <span className="font-medium">{subject}</span> },
            { title: "Organization", dataIndex: "organization", key: "organization", render: (organization, ticket) => <div><div>{organization}</div><div className="text-xs text-slate-500">{ticket.user}</div></div> },
            { title: "Priority", dataIndex: "priority", key: "priority", render: (value) => <StatusBadge status={value} /> },
            { title: "Status", dataIndex: "status", key: "status", render: (value) => <StatusBadge status={value} /> },
            { title: "Assignee", dataIndex: "assignedTo", key: "assignedTo", render: (assignee) => <span className={cn(assignee === "Unassigned" && "italic text-slate-400")}>{assignee}</span> },
            { title: "", key: "actions", width: 50, render: (_, ticket) => <Button type="text" size="small" aria-label={`View ${ticket.ticketCode}`} icon={<Eye className="h-4 w-4" />} onClick={() => handleViewTicket(ticket)} /> },
          ]}
        />
      </div>

      <Modal open={!!viewTicket} onCancel={() => setViewTicket(null)} title={viewTicket?.subject} width={720} loading={detailLoading} footer={null}>
        {viewTicket && (
          <div className="space-y-5 pt-2">
            <div className="flex gap-2"><StatusBadge status={viewTicket.status} /><StatusBadge status={viewTicket.priority} /></div>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Ticket">{viewTicket.ticketCode}</Descriptions.Item>
              <Descriptions.Item label="Created">{new Date(viewTicket.createdAt).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Organization">{viewTicket.organization}</Descriptions.Item>
              <Descriptions.Item label="Reporter">{viewTicket.user}</Descriptions.Item>
              <Descriptions.Item label="Assigned To">{viewTicket.assignedTo}</Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>{viewTicket.description || "No description provided."}</Descriptions.Item>
            </Descriptions>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setViewTicket(null)}>Close</Button>
              {!["Resolved", "Closed"].includes(viewTicket.status) && <Button type="primary" loading={actionLoading} onClick={handleResolveTicket}>Resolve Ticket</Button>}
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!diagnosticResult} onCancel={() => setDiagnosticResult(null)} title={diagnosticResult?.name} footer={<Button onClick={() => setDiagnosticResult(null)}>Close</Button>}>
        <div className="space-y-3 pt-2">
          {diagnosticResult?.results?.map((result) => (
            <div key={`${result.key}-${result.label}`} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <div className="mb-1 flex items-center justify-between gap-3"><span className="font-medium">{result.label}</span><StatusBadge status={result.status} /></div>
              <p className="text-sm text-slate-500">{result.detail}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
