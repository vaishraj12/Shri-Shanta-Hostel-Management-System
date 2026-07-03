import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Wrench,
  Building2,
  LogOut,
} from "lucide-react";

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navLink = (to: string, label: string, Icon: any) => {
    const active = location.pathname === to;

    return (
      <Link
        to={to}
        className={`flex items-center gap-4 text-sm font-grotesque ${
          active ? "opacity-100 font-semibold" : "opacity-95"
        }`}
      >
        <Icon className="w-5 h-5" />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#3A2B8F] to-[#2E1A72] font-grotesque">
      
      {/* SIDEBAR */}
      <aside className="w-64 flex flex-col justify-between text-white bg-gradient-to-b from-[#2F2AA8] via-[#3A2B8F] to-[#5A3D8C] font-grotesque">
        
        {/* TOP */}
        <div>
          {/* Branding */}
          <div className="p-6 flex items-center gap-3">
            <img
              src="/bv logo cir.png"
              alt="Banasthali Vidyapith"
              className="w-10 h-10"
            />
            <div className="text-xs leading-tight">
              <p className="font-semibold">बनस्थली विद्यापीठ</p>
              <p className="opacity-90">Banasthali Vidyapith</p>
            </div>
          </div>

          {/* ShriShanta Card */}
          <div className="mx-4 mb-6 bg-[#3B2DA5] rounded-2xl p-6 flex items-center gap-4 shadow-lg">
            <Building2 className="w-7 h-7" />
            <div>
              <p className="text-lg font-bold leading-tight">ShriShanta</p>
              <p className="text-sm opacity-80">
                Hostel Management System
              </p>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="px-6 space-y-6">
            {navLink("/admin/dashboard", "Dashboard", LayoutDashboard)}
            {navLink("/admin/students", "Students", Users)}
            {navLink("/admin/warden", "Warden", ShieldCheck)}
            {navLink("/admin/maintenance", "Maintenance", Wrench)}
          </nav>
        </div>

        {/* BOTTOM USER */}
        <div className="px-6 pb-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
              {user?.name?.[0]}
            </div>
            <div className="text-xs">
              <p className="font-medium">{user?.name}</p>
              <p className="opacity-70 break-all">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm opacity-90 hover:opacity-100"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA WITH BACKGROUND */}
      <main
        className="flex-1 bg-cover bg-center p-6"
        style={{ backgroundImage: "url('/bv.png')" }}
      >
        {/* Shared White Container */}
        <div className="bg-white/90 rounded-xl border border-blue-500 p-10 min-h-[85vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;