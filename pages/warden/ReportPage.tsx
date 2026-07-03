import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";

export default function ReportPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="p-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8">Reports</h1>

        <div className="flex gap-6 flex-wrap justify-center">
          
          {/* Complaint Report */}
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg"
            onClick={() => navigate("/warden/reports/complaints")}
          >
            📢 Complaint Report
          </Button>

          {/* Mess Report */}
          <Button
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg"
            onClick={() => navigate("/warden/reports/mess")}
          >
            🍽️ Mess Menu Report
          </Button>

        </div>
      </div>
    </DashboardLayout>
  );
}