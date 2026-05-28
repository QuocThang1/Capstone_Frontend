import { useState } from "react";
import { Table, Button, Modal } from "antd";
import SearchFilterBar from "@/components/adminPage/SearchFilterBar";
import StatusBadge from "@/components/adminPage/StatusBadge";
import { Eye } from "lucide-react";

const auditLogs = [];

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [viewLog, setViewLog] = useState(null);

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        Audit Logs
      </h2>

      <SearchFilterBar
        searchValue={search}
        onSearch={setSearch}
        filters={[
          {
            name: "severity",
            label: "Severity",
            options: ["Info", "Warning", "Critical"],
          },
        ]}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <Table
          dataSource={filteredLogs}
          rowKey="id"
          columns={[
            {
              title: "Timestamp",
              dataIndex: "timestamp",
              key: "timestamp",
              width: 180,
              render: (ts) => new Date(ts).toLocaleString(),
            },
            {
              title: "Actor",
              dataIndex: "actor",
              key: "actor",
            },
            {
              title: "Action",
              dataIndex: "action",
              key: "action",
            },
            {
              title: "Target",
              dataIndex: "target",
              key: "target",
            },
            {
              title: "Severity",
              dataIndex: "severity",
              key: "severity",
              render: (status) => <StatusBadge status={status} />,
            },
            {
              title: "",
              key: "actions",
              width: 80,
              render: (_, log) => (
                <Button
                  type="text"
                  size="small"
                  icon={<Eye className="w-4 h-4" />}
                  onClick={() => setViewLog(log)}
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
      >
        {viewLog && (
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 block mb-1">Timestamp</span>
                <span className="font-mono">
                  {new Date(viewLog.timestamp).toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Severity</span>
                <StatusBadge status={viewLog.severity} />
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Actor</span>
                <span className="font-medium">{viewLog.actor}</span>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">IP Address</span>
                <span className="font-mono text-slate-600 dark:text-slate-400">
                  {viewLog.ipAddress}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-slate-500 block mb-1">Action</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  {viewLog.action}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-slate-500 block mb-1">Target</span>
                <span>{viewLog.target}</span>
              </div>

              <div className="col-span-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-md border border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 block mb-1 text-xs uppercase tracking-wider font-semibold">
                  Details
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  {viewLog.details}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}