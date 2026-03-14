"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Button } from "@/components/ui";
import { Shield, AlertTriangle, CheckCircle, Wrench } from "lucide-react";

export default function MaintenancePage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const toggle = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setMaintenanceMode((prev) => !prev);
    setMessage(
      !maintenanceMode
        ? "Maintenance mode enabled. Write operations are now blocked for all non-admin users."
        : "Maintenance mode disabled. System is back to normal operation."
    );
    setLoading(false);
  };

  return (
    <DashboardLayout
      role="ADMIN"
      userName="Admin User"
      userId="A001"
      pageTitle="Maintenance Mode"
      maintenanceMode={maintenanceMode}
    >
      <div className="max-w-2xl mx-auto">
        {/* Current Status */}
        <Card className="mb-6">
          <div className="p-8 text-center">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${
                maintenanceMode
                  ? "bg-amber-100 text-amber-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {maintenanceMode ? (
                <Wrench className="w-12 h-12" />
              ) : (
                <CheckCircle className="w-12 h-12" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {maintenanceMode ? "Maintenance Mode Active" : "System Operating Normally"}
            </h2>
            <p className="text-gray-500 mb-6">
              {maintenanceMode
                ? "All write operations are blocked. Users can only view data."
                : "All features are available to users based on their roles."}
            </p>

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
                maintenanceMode
                  ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  maintenanceMode ? "bg-amber-500 animate-pulse" : "bg-green-500"
                }`}
              />
              {maintenanceMode ? "MAINTENANCE" : "ONLINE"}
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-xl text-sm ${
                  maintenanceMode
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {message}
              </div>
            )}

            <Button
              variant={maintenanceMode ? "secondary" : "primary"}
              size="lg"
              onClick={toggle}
              disabled={loading}
              className={maintenanceMode ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
            >
              {loading ? (
                "Processing..."
              ) : maintenanceMode ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Disable Maintenance Mode
                </>
              ) : (
                <>
                  <Wrench className="w-5 h-5" />
                  Enable Maintenance Mode
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card title="When Enabled" className="border-amber-100">
            <ul className="px-4 pb-4 space-y-2 text-sm text-gray-600">
              {[
                "Students cannot enroll or drop courses",
                "Instructors cannot enter or edit grades",
                "Amber banner shown to all users",
                "Admin read/write access unaffected",
                "All users can still view their data",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card title="When Disabled" className="border-green-100">
            <ul className="px-4 pb-4 space-y-2 text-sm text-gray-600">
              {[
                "Students can register and drop courses",
                "Instructors can enter and update grades",
                "Normal banner removed",
                "All role-based operations enabled",
                "Full system functionality restored",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
