"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Button } from "@/components/ui";
import { Database, Download, Upload, CheckCircle, AlertTriangle } from "lucide-react";

export default function BackupPage() {
  const [backupStatus, setBackupStatus] = useState<"idle" | "running" | "done">("idle");
  const [restoreStatus, setRestoreStatus] = useState<"idle" | "running" | "done" | "error">("idle");

  const handleBackup = async () => {
    setBackupStatus("running");
    await new Promise((r) => setTimeout(r, 2000));
    setBackupStatus("done");
    // Simulate download
    const a = document.createElement("a");
    a.href = "#";
    a.download = `university_erp_backup_${new Date().toISOString().slice(0, 10)}.sql`;
    setTimeout(() => setBackupStatus("idle"), 3000);
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setRestoreStatus("running");
    await new Promise((r) => setTimeout(r, 2500));
    setRestoreStatus("done");
    setTimeout(() => setRestoreStatus("idle"), 3000);
  };

  return (
    <DashboardLayout
      role="ADMIN"
      userName="Admin User"
      userId="A001"
      pageTitle="Backup & Restore"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Backup */}
        <Card title="Database Backup" subtitle="Export the entire database to a SQL file">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <Database className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900">university_erp</p>
                <p className="text-sm text-blue-600">PostgreSQL · Spring 2025 data</p>
              </div>
            </div>

            {backupStatus === "done" && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm mb-4">
                <CheckCircle className="w-4 h-4" />
                Backup completed successfully!
              </div>
            )}

            <Button
              onClick={handleBackup}
              disabled={backupStatus === "running"}
              size="lg"
              className="w-full"
            >
              <Download className="w-5 h-5" />
              {backupStatus === "running" ? "Creating backup..." : "Download Backup"}
            </Button>
            <p className="text-xs text-gray-400 text-center mt-2">
              Creates a full SQL dump of all tables and data
            </p>
          </div>
        </Card>

        {/* Restore */}
        <Card title="Database Restore" subtitle="Restore the database from a SQL backup file">
          <div className="p-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-700">
                  <p className="font-semibold">Warning</p>
                  <p className="mt-1">
                    Restoring a backup will overwrite ALL current data. This action cannot
                    be undone. Please enable maintenance mode before proceeding.
                  </p>
                </div>
              </div>
            </div>

            {restoreStatus === "done" && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm mb-4">
                <CheckCircle className="w-4 h-4" />
                Database restored successfully!
              </div>
            )}
            {restoreStatus === "error" && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">
                <AlertTriangle className="w-4 h-4" />
                Restore failed. Invalid backup file.
              </div>
            )}

            <label
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                restoreStatus === "running"
                  ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                  : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
              }`}
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600">
                {restoreStatus === "running" ? "Restoring..." : "Click to upload .sql backup file"}
              </p>
              <p className="text-xs text-gray-400">Accepts .sql files only</p>
              <input
                type="file"
                accept=".sql"
                className="hidden"
                disabled={restoreStatus === "running"}
                onChange={handleRestore}
              />
            </label>
          </div>
        </Card>

        {/* Backup History */}
        <Card title="Backup History">
          <div className="p-4 space-y-2">
            {[
              { date: "2025-03-13", size: "2.4 MB", status: "Success" },
              { date: "2025-03-06", size: "2.3 MB", status: "Success" },
              { date: "2025-02-28", size: "2.1 MB", status: "Success" },
            ].map((item) => (
              <div key={item.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      university_erp_backup_{item.date}.sql
                    </p>
                    <p className="text-xs text-gray-400">{item.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                    {item.status}
                  </span>
                  <button className="text-blue-500 hover:text-blue-700">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
