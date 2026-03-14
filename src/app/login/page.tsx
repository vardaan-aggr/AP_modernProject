"use client";

import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const emailVal = emailRef.current?.value || "";
    const passwordVal = passwordRef.current?.value || "";

    try {
      const result = await signIn("credentials", {
        email: emailVal,
        password: passwordVal,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    { role: "Student", email: "student@univ.edu", password: "student123", color: "bg-blue-50 border-blue-200 text-blue-700" },
    { role: "Instructor", email: "instructor@univ.edu", password: "instructor123", color: "bg-purple-50 border-purple-200 text-purple-700" },
    { role: "Admin", email: "admin@univ.edu", password: "admin123", color: "bg-green-50 border-green-200 text-green-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">University ERP</h1>
          <p className="text-gray-500 mt-2">Academic Management Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign in to your account</h2>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                ref={emailRef}
                type="email"
                name="email"
                defaultValue=""
                placeholder="you@univ.edu"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  defaultValue=""
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6">
          <p className="text-center text-sm text-gray-500 mb-3">Demo credentials (click to auto-fill)</p>
          <div className="space-y-2">
            {demoCredentials.map((demo) => (
              <button
                key={demo.role}
                onClick={() => {
                  if (emailRef.current) emailRef.current.value = demo.email;
                  if (passwordRef.current) passwordRef.current.value = demo.password;
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity ${demo.color}`}
              >
                <span>{demo.role}</span>
                <span className="font-mono text-xs opacity-70">{demo.email}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          University Academic Management System © 2025
        </p>
      </div>
    </div>
  );
}
