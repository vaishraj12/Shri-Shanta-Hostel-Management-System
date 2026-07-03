import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MunicipalDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome Maintenance Department, {user?.name}
          </h1>
        </div>

        {/* Complaints Button */}
        <p>Maintenance Department control panel</p>
        
      </div>
    </DashboardLayout>
  );
};

export default MunicipalDashboard;
