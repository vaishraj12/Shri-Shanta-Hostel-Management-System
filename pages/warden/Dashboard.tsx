import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const WardenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [hostelName, setHostelName] = useState<string>("");

  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:5000/warden/hostel/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setHostelName(data.hostel_name);

        if (data.hostel_name) {
          fetch(`http://localhost:5000/students/hostel/${data.hostel_name}`)
            .then((res) => res.json())
            .then((data) => setStudents(data))
            .catch(console.error);
        }
      })
      .catch(console.error);

    fetch(`http://localhost:5000/complaints/warden/${user.email}`)
      .then((res) => res.json())
      .then((data) => setComplaints(data))
      .catch(console.error);

    fetch(`http://localhost:5000/leaves/warden/${user.email}`)
      .then((res) => res.json())
      .then((data) => setLeaves(data))
      .catch(console.error);
  }, [user]);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">
            Welcome, {user?.name}
          </h2>

          <p className="text-gray-600">
            Warden Control Panel
          </p>

          <p className="text-gray-700">
            Hostel: <span className="font-semibold">
              {hostelName || "Not Assigned"}
            </span>
          </p>

          {/* STATS */}
         
        </div>

        {/* RIGHT IMAGE */}
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

export default WardenDashboard;