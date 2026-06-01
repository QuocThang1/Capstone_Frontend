import { useEffect, useState } from "react";
import { App, Button, Empty, Spin, Table } from "antd";
import StatusBadge from "@/components/adminPage/StatusBadge";
import { Shield, Lock, FileKey, Database, FileCheck, AlertTriangle, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  approveDataRequestApi,
  getDataSecurityApi,
  rejectDataRequestApi,
} from "@/utils/Api/adminApi";

const iconMap = {
  "alert-triangle": AlertTriangle,
  database: Database,
  "file-check": FileCheck,
  "file-key": FileKey,
  lock: Lock,
  shield: Shield,
};

export default function DataSecurityPage() {
  const { message } = App.useApp();
  const [cards, setCards] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const loadSecurity = async () => {
      setLoading(true);
      const res = await getDataSecurityApi();
      if (res?.EC === 0) {
        setCards(res.data?.posture || []);
        setRequests(res.data?.requests || []);
      } else {
        message.error(res?.EM || "Failed to load data security");
      }
      setLoading(false);
    };

    loadSecurity();
  }, [message]);

  const handleAction = async (id, action) => {
    setActionLoading(id);
    const res = action === "approve"
      ? await approveDataRequestApi(id)
      : await rejectDataRequestApi(id);

    if (res?.EC === 0) {
      setRequests((current) => current.map((request) => request.id === id ? res.data : request));
      message.success(res.EM);
    } else {
      message.error(res?.EM || "Failed to update data privacy request");
    }
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Security Posture</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => {
            const CardIcon = iconMap[card.icon] || Shield;
            return (
            <div key={card.key} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                card.tone === "emerald" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                card.tone === "indigo" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" :
                "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
              )}>
                <CardIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{card.title}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{card.status}</p>
              </div>
            </div>
          )})}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Data Privacy Requests</h2>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <Table
            dataSource={requests}
            rowKey="id"
            locale={{ emptyText: <Empty description="No data privacy requests" /> }}
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
                    <Button danger size="small" loading={actionLoading === req.id} onClick={() => handleAction(req.id, 'reject')}>
                      <X className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button type="primary" size="small" loading={actionLoading === req.id} onClick={() => handleAction(req.id, 'approve')}>
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
