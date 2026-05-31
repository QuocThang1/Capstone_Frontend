import { useState } from "react";
const initialReqs = [];
import { Table, Button, Card, Row, Col, message } from "antd";
import StatusBadge from "@/components/adminPage/StatusBadge";
import { Shield, Lock, FileKey, Database, FileCheck, AlertTriangle, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DataSecurityPage() {
  const [requests, setRequests] = useState(initialReqs);

  const handleAction = (id, action) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'Processing' : 'Rejected' } : r));
    message.success(`Request ${action === 'approve' ? 'approved for processing' : 'rejected'}`);
  };

  const cards = [
    { title: "Encryption at Rest", status: "Active", icon: Lock, tone: "emerald" },
    { title: "Encryption in Transit", status: "Active", icon: Shield, tone: "emerald" },
    { title: "Automated Backups", status: "Daily", icon: Database, tone: "indigo" },
    { title: "MFA Enforcement", status: "Optional", icon: FileKey, tone: "amber" },
    { title: "Compliance Audits", status: "Passed", icon: FileCheck, tone: "emerald" },
    { title: "Vulnerability Scans", status: "1 Issue", icon: AlertTriangle, tone: "amber" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Security Posture</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                card.tone === "emerald" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                card.tone === "indigo" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" :
                "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
              )}>
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{card.title}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{card.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Data Privacy Requests</h2>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <Table
            dataSource={requests}
            rowKey="id"
            columns={[
              { title: 'Organization', dataIndex: 'organization', key: 'organization' },
              { title: 'Type', dataIndex: 'requestType', key: 'requestType' },
              { title: 'Requested By', dataIndex: 'requestedBy', key: 'requestedBy' },
              { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString() },
              { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <StatusBadge status={status} /> },
              {
                title: 'Actions',
                key: 'actions',
                render: (_, req) => req.status === 'Pending' && (
                  <div className="flex gap-2">
                    <Button danger size="small" onClick={() => handleAction(req.id, 'reject')}>
                      <X className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button type="primary" size="small" onClick={() => handleAction(req.id, 'approve')}>
                      <Check className="w-4 h-4 mr-1" /> Approve
                    </Button>
                  </div>
                )
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
