"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Table, TableRow, TableCell, Badge, Button, SearchInput } from "@/components/ui";
import { mockUsers, type Role } from "@/lib/mock-data";
import { Plus, UserCheck, UserX, Mail } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", userId: "", role: "STUDENT" as Role });

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.userId.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.userId) return;
    setUsers((prev) => [
      ...prev,
      { ...newUser, id: prev.length + 1 },
    ]);
    setNewUser({ name: "", email: "", userId: "", role: "STUDENT" });
    setShowAddForm(false);
  };

  const roleColors: Record<Role, string> = {
    STUDENT: "info",
    INSTRUCTOR: "warning",
    ADMIN: "success",
  };

  return (
    <DashboardLayout
      role="ADMIN"
      userName="Admin User"
      userId="A001"
      pageTitle="User Management"
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name, email, or ID..."
          />
        </div>
        <div className="flex gap-2">
          {(["ALL", "STUDENT", "INSTRUCTOR", "ADMIN"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                roleFilter === r
                  ? "bg-green-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <Card title="Add New User" className="mb-6">
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
              <input
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="john@univ.edu"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">User ID</label>
              <input
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newUser.userId}
                onChange={(e) => setNewUser({ ...newUser, userId: e.target.value })}
                placeholder="2024999"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
              >
                <option value="STUDENT">Student</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <div className="px-4 pb-4 flex gap-2">
            <Button onClick={handleAddUser}>Create User</Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <Card
        title={`Users (${filtered.length})`}
        subtitle="All registered users in the system"
      >
        <Table headers={["ID", "Name", "Email", "Role", "Joined", "Actions"]}>
          {filtered.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <span className="font-mono text-xs font-bold text-gray-600">{user.userId}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-gray-600">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={roleColors[user.role] as "default" | "success" | "warning" | "error" | "info"}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-xs text-gray-400">Jan 2025</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <button className="text-green-600 hover:text-green-700 transition-colors">
                    <UserCheck className="w-4 h-4" />
                  </button>
                  <button className="text-red-400 hover:text-red-600 transition-colors">
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </DashboardLayout>
  );
}
