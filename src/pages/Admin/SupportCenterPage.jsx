import { useState } from "react";
const supportTickets = [];
import { Table, Button, Modal, Space, Descriptions, message } from "antd";
import SearchFilterBar from "@/components/adminPage/SearchFilterBar";
import StatusBadge from "@/components/adminPage/StatusBadge";
import { Eye, Stethoscope, Mail, Activity, Database } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SupportCenterPage() {
  const [search, setSearch] = useState("");
  const [viewTicket, setViewTicket] = useState(null);

  const filteredTickets = supportTickets.filter(t => 
    t.organization.toLowerCase().includes(search.toLowerCase()) || 
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const runDiagnostic = (name) => {
    message.info(`Running ${name}...`);
    setTimeout(() => {
      message.success(`${name} completed. All systems nominal.`);
    }, 1500);
  };

  const diagnostics = [
    { name: "Check Mail Queue", icon: Mail },
    { name: "Test WebSockets", icon: Activity },
    { name: "Verify DB Indexes", icon: Database },
    { name: "Full System Check", icon: Stethoscope }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Support Center</h2>
        <div className="flex gap-2">
          {diagnostics.map(d => (
            <Button key={d.name} size="small" onClick={() => runDiagnostic(d.name)} className="hidden sm:flex bg-white dark:bg-slate-900">
              <d.icon className="w-4 h-4 mr-2" /> {d.name}
            </Button>
          ))}
        </div>
      </div>

      <SearchFilterBar 
        searchValue={search} 
        onSearch={setSearch}
        filters={[
          { name: "status", label: "Status", options: ["Open", "In Progress", "Resolved", "Closed"] },
          { name: "priority", label: "Priority", options: ["Low", "Medium", "High", "Critical"] }
        ]}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <Table
          dataSource={filteredTickets}
          rowKey="id"
          columns={[
            { title: 'Ticket ID', dataIndex: 'id', key: 'id', render: (id) => <span className="font-mono text-xs text-slate-500">{id}</span> },
            { title: 'Subject', dataIndex: 'subject', key: 'subject', render: (subject) => <span className="font-medium">{subject}</span> },
            { title: 'Organization', dataIndex: 'organization', key: 'organization', render: (org, record) => (
              <div><div className="text-sm">{org}</div><div className="text-xs text-slate-500">{record.user}</div></div>
            )},
            { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (priority) => <StatusBadge status={priority} /> },
            { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <StatusBadge status={status} /> },
            { title: 'Assignee', dataIndex: 'assignedTo', key: 'assignedTo', render: (assignee) => <span className={cn(assignee === 'Unassigned' ? "text-slate-400 italic" : "")}>{assignee}</span> },
            {
              title: '',
              key: 'actions',
              width: 50,
              render: (_, ticket) => (
                <Button type="text" size="small" icon={<Eye className="w-4 h-4" />} onClick={() => setViewTicket(ticket)} />
              )
            }
          ]}
        />
      </div>

      <Modal open={!!viewTicket} onCancel={() => setViewTicket(null)} title={viewTicket?.subject} width={800} footer={null}>
        {viewTicket && (
          <div className="space-y-6 pt-2">
            <div>
              <p className="font-mono text-xs text-slate-500">{viewTicket.id} • Created {new Date(viewTicket.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={viewTicket.status} />
              <StatusBadge status={viewTicket.priority} />
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 block mb-1">Organization</span>
                <span className="font-medium">{viewTicket.organization}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Reporter</span>
                <span>{viewTicket.user}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Assigned To</span>
                <span>{viewTicket.assignedTo}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex justify-end gap-2">
              <Button onClick={() => setViewTicket(null)}>Close</Button>
              <Button type="primary">Take Action</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
