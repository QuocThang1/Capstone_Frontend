import { useCallback, useEffect, useState } from "react";
import { App, Button, Modal, Table } from "antd";
import { Eye } from "lucide-react";
import SearchFilterBar from "@/components/adminPage/SearchFilterBar";
import StatusBadge from "@/components/adminPage/StatusBadge";
import {
  getAllAuditLogsApi,
  getAuditLogByIdApi,
} from "@/utils/Api/adminApi";
import socket from "@/utils/socket";

const PAGE_SIZE = 20;

const formatIpAddress = (ipAddress) => {
  if (!ipAddress) return "Unknown";
  if (ipAddress === "::1" || ipAddress === "127.0.0.1") return "localhost";
  return ipAddress;
};

const matchesFilters = (log, search, severity) => {
  const normalizedSearch = search.trim().toLowerCase();
  const searchableText = [log.actor, log.action, log.target, log.details]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    (!normalizedSearch || searchableText.includes(normalizedSearch)) &&
    (severity === "all" || log.severity === severity)
  );
};

export default function AuditLogsPage() {
  const { message } = App.useApp();
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewLog, setViewLog] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    const res = await getAllAuditLogsApi({
      page,
      limit: PAGE_SIZE,
      search: search.trim() || undefined,
      severity: severity === "all" ? undefined : severity,
    });

    if (res?.EC === 0) {
      setLogs(res.data?.logs || []);
      setTotal(res.data?.total || 0);
    } else {
      message.error(res?.EM || "Failed to load audit logs");
    }
    setLoading(false);
  }, [message, page, search, severity]);

  useEffect(() => {
    const timer = setTimeout(loadLogs, 250);
    return () => clearTimeout(timer);
  }, [loadLogs]);

  useEffect(() => {
    const handleNewAuditLog = (log) => {
      if (!matchesFilters(log, search, severity)) return;
      setTotal((current) => current + 1);
      if (page === 1) {
        setLogs((current) => [log, ...current.filter((item) => item.id !== log.id)].slice(0, PAGE_SIZE));
      }
    };

    if (!socket.connected) socket.connect();
    socket.emit("join_admin_audit_logs");
    socket.on("new_audit_log", handleNewAuditLog);

    return () => {
      socket.emit("leave_admin_audit_logs");
      socket.off("new_audit_log", handleNewAuditLog);
    };
  }, [page, search, severity]);

  const handleViewLog = async (logId) => {
    setDetailLoading(true);
    setViewLog(logs.find((log) => log.id === logId) || null);
    const res = await getAuditLogByIdApi(logId);
    if (res?.EC === 0) {
      setViewLog(res.data);
    } else {
      message.error(res?.EM || "Failed to load audit log details");
    }
    setDetailLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Audit Logs</h2>

      <SearchFilterBar
        searchValue={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        filters={[
          {
            name: "severity",
            label: "Severity",
            value: severity,
            options: ["Info", "Warning", "Critical"],
          },
        ]}
        onFilter={(_, value) => {
          setSeverity(value);
          setPage(1);
        }}
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Table
          dataSource={logs}
          loading={loading}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total,
            showSizeChanger: false,
            onChange: setPage,
          }}
          rowClassName={(log) =>
            log.severity === "Critical"
              ? "bg-red-50/50 dark:bg-red-950/10"
              : log.severity === "Warning"
                ? "bg-amber-50/50 dark:bg-amber-950/10"
                : ""
          }
          columns={[
            {
              title: "Timestamp",
              dataIndex: "timestamp",
              key: "timestamp",
              width: 220,
              render: (timestamp) => (
                <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
                  {new Date(timestamp).toLocaleString()}
                </span>
              ),
            },
            { title: "Actor", dataIndex: "actor", key: "actor", width: 180 },
            { title: "Action", dataIndex: "action", key: "action" },
            { title: "Target", dataIndex: "target", key: "target" },
            {
              title: "Severity",
              dataIndex: "severity",
              key: "severity",
              width: 140,
              render: (status) => <StatusBadge status={status} />,
            },
            {
              title: "",
              key: "actions",
              width: 64,
              render: (_, log) => (
                <Button
                  type="text"
                  size="small"
                  aria-label={`View audit log ${log.action}`}
                  icon={<Eye className="h-4 w-4" />}
                  onClick={() => handleViewLog(log.id)}
                />
              ),
            },
          ]}
        />
      </div>

      <Modal
        open={!!viewLog}
        onCancel={() => setViewLog(null)}
        title="Audit Log Details"
        footer={null}
        loading={detailLoading}
      >
        {viewLog && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 pt-4 text-sm">
            <div>
              <span className="mb-1 block text-slate-500">Timestamp</span>
              <span className="font-mono">{new Date(viewLog.timestamp).toLocaleString()}</span>
            </div>
            <div>
              <span className="mb-1 block text-slate-500">Severity</span>
              <StatusBadge status={viewLog.severity} />
            </div>
            <div>
              <span className="mb-1 block text-slate-500">Actor</span>
              <span className="font-medium">{viewLog.actor}</span>
            </div>
            <div>
              <span className="mb-1 block text-slate-500">IP Address</span>
              <span className="font-mono text-slate-600 dark:text-slate-300">{formatIpAddress(viewLog.ipAddress)}</span>
            </div>
            <div className="col-span-2">
              <span className="mb-1 block text-slate-500">Action</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">{viewLog.action}</span>
            </div>
            <div className="col-span-2">
              <span className="mb-1 block text-slate-500">Target</span>
              <span>{viewLog.target}</span>
            </div>
            <div className="col-span-2 rounded-md border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
              <span className="mb-1 block text-xs font-semibold uppercase text-slate-500">Details</span>
              <p className="text-slate-700 dark:text-slate-300">{viewLog.details || "No additional details."}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
