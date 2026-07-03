import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/context/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#3A2B8F] to-[#2E1A72] font-grotesque">

      {/* SIDEBAR */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* MAIN CONTENT AREA */}
      <main
        className="flex-1 bg-cover bg-center p-6 "
        style={{ backgroundImage: "url('/bv.png')" }}
      >
        {/* Shared white container */}
        <div className="bg-white/90 rounded-xl border border-blue-500 p-10 min-h-[85vh]">
          {/* Optional: show welcome message with role */}

          {children}
        </div>
      </main>

    </div>
  );
};