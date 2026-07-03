import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  MessageSquare,
  UtensilsCrossed,
  Users,
  ShieldCheck,
  ClipboardList,
  Building2,
  LogOut,
  Menu,
  ListPlus,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

/* ================= NAV ITEMS ================= */

const studentNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: MessageSquare, label: "Complaints", path: "/complaints" },
  { icon: UtensilsCrossed, label: "Mess Menu", path: "/mess-menu" },
];

const wardenNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/warden/dashboard" },

  // ✅ NEW ATTENDANCE
 { icon: ClipboardList, label: "Attendance", path: "/warden/attendance" },

  { icon: MessageSquare, label: "Complaints", path: "/warden/complaints" },
  { icon: UtensilsCrossed, label: "Mess Menu", path: "/warden/mess-menu" },
  { icon: ListPlus, label: "Assign Room", path: "/warden/assignroom" },
  { icon: ListPlus, label: "Add Food", path: "/warden/add-food" },
  // { icon: BarChart3, label: "Reports", path: "/warden/reports" },
];

const maintenanceNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/municipal/dashboard" },
  { icon: ClipboardList, label: "Complaints", path: "/municipal/complaints" },
  { icon: ListPlus, label: "Categories", path: "/municipal/categories" },
  { icon: Users, label: "Workers Detail", path: "/municipal/workers" },
];

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: " assign Students", path: "/admin/addstudent" },
  { icon: ListPlus, label: "Upload  Details", path: "/admin/upload-students" },
  { icon: ShieldCheck, label: "assign Wardens", path: "/admin/assign" },
];

/* ================= ROLE LABEL ================= */

const roleLabelMap: Record<string, string> = {
  student: "Student",
  warden: "Warden",
  maintenance_department: "Maintenance",
  admin: "Admin",
};

/* ================= COMPONENT ================= */

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems =
    user?.role === "admin"
      ? adminNavItems
      : user?.role === "maintenance_department"
      ? maintenanceNavItems
      : user?.role === "warden"
      ? wardenNavItems
      : studentNavItems;

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 flex flex-col justify-between text-white font-grotesque",
          "bg-gradient-to-b from-[#2F2AA8] via-[#3A2B8F] to-[#5A3D8C]",
          "transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* TOP SECTION */}
        <div>
          {/* Branding */}
          <div className="px-6 pt-6 pb-4 flex items-center gap-3 border-b border-white/10">
            <img
              src="/bv logo cir.png"
              alt="Banasthali Vidyapith"
              className="w-10 h-10"
            />
            <div className="leading-tight text-xs">
              <p className="font-semibold">बनस्थली विद्यापीठ</p>
              <p className="opacity-80">Banasthali Vidyapith</p>
            </div>
          </div>

          {/* Card */}
          <div className="mx-4 mt-6 mb-6 bg-[#3B2DA5] rounded-2xl p-5 flex items-center gap-4 shadow-lg">
            <Building2 className="w-7 h-7" />
            <div className="leading-tight">
              <p className="text-lg font-semibold">ShriShanta</p>
              <p className="text-xs opacity-80">
                {roleLabelMap[user?.role || "student"]} Portal
              </p>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="px-6 space-y-4">
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onToggle()}
                  className={cn(
                    "flex items-center gap-4 text-sm py-2 transition",
                    active
                      ? "font-semibold text-white"
                      : item.label === "Reports"
                      ? "text-yellow-300 font-medium hover:text-yellow-200"
                      : "opacity-80 hover:opacity-100"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* USER SECTION */}
        <div className="px-6 pb-6 pt-4 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
              {user?.name?.[0]}
            </div>
            <div className="text-xs leading-tight">
              <p className="font-medium">{user?.name}</p>
              <p className="opacity-70 break-all">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-3 text-sm opacity-90 hover:opacity-100"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* MOBILE TOGGLE */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-30 lg:hidden bg-white shadow-md"
        onClick={onToggle}
      >
        <Menu className="w-5 h-5" />
      </Button>
    </>
  );
};