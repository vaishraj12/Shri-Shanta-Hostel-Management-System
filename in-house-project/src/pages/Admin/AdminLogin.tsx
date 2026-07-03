// src/pages/admin/AdminLogin.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid admin credentials");
        return;
      }

      const adminUser = {
        email: data.email,
        name: data.name,
        role: "admin" as const,
      };

      localStorage.setItem("hostelUser", JSON.stringify(adminUser));
      setUser(adminUser);

      navigate("/admin/dashboard");
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex font-grotesque"
      style={{
        background: `
          linear-gradient(
            135deg,
            #1d0ab3 0%,
            #330ab1 25%,
            #3d09b3 45%,
            #6228c8 70%,
            #7941da 100%
          )
        `,
      }}
    >
      {/* ===== LEFT PANEL ===== */}
      <div className="hidden lg:flex w-1/2 text-white px-12 py-10">
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-4 mb-10">
            <img
              src="/bv logo cir.png"
              alt="Banasthali Vidyapith"
              className="w-12 h-12 bg-white rounded-full p-1"
            />
            <div className="text-sm leading-tight">
              <p className="font-semibold">बनस्थली विद्यापीठ</p>
              <p className="opacity-90">Banasthali Vidyapith</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-9 h-9" />
              <h1 className="text-4xl font-bold tracking-tight">
                Admin Panel
              </h1>
            </div>

            <h2 className="text-xl font-semibold mb-4 tracking-wide">
              ShriShanta – Hostel Management System
            </h2>

            <p className="text-base opacity-90 max-w-lg mb-8">
              Secure admin access to manage hostel operations, complaints,
              mess services, and student records.
            </p>

            <div className="max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              <img
                src="/bv.png"
                alt="Hostel Building"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <Shield className="w-10 h-10 text-[#5B2DAD]" />
            </div>
            <h2 className="text-3xl font-bold mb-1">Admin Login</h2>
            <p className="text-gray-500 text-sm">
              Restricted system access
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Admin email"
                className="h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Admin password"
                className="h-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-white font-semibold"
              style={{
                background:
                  "linear-gradient(90deg, #3d09b3 0%, #7941da 100%)",
              }}
            >
              Sign In as Admin
            </Button>
          </form>

          <button
            onClick={() => navigate("/login")}
            className="w-full mt-4 text-sm text-gray-500 hover:text-primary transition text-center"
          >
            ← Back to main login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;