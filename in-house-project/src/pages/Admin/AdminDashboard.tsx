import React from "react";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        <div className="space-y-6">
          <h2 className="text-3xl font-bold">
            Welcome, {user?.name}
          </h2>

          <p className="text-gray-600">
            Admin Control Panel
          </p>

          <div className="text-lg space-y-3 max-w-md">
            <p className="font-semibold">
              Manage hostel operations efficiently.
            </p>

            <p className="text-gray-600">
              Oversee students, coordinate with wardens, and monitor maintenance activities from one place.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <img
            src="/bv.png"
            alt="Hostel"
            className="rounded-xl object-cover max-h-[380px] shadow-xl"
          />
        </div>

      </div>

    </DashboardLayout>
  );
};

export default AdminDashboard;