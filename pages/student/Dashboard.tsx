import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const [hostelName, setHostelName] = useState<string>("Loading...");
  const [roomNo, setRoomNo] = useState<string>("Loading...");

  useEffect(() => {
    if (!user?.email) return;

    const fetchStudentData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/student-data?email=${user.email}`
        );

        const data = await res.json();

        setHostelName(data.hostelname || "Not Assigned");
        setRoomNo(data.room_no || "Not Assigned");
      } catch (error) {
        console.error("Error fetching student data:", error);
        setHostelName("Error");
        setRoomNo("Error");
      }
    };

    fetchStudentData();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">
            Welcome, {user?.name}
          </h2>

          {/* ✅ Hostel Name */}
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Hostel:</span> {hostelName}
          </p>

          {/* ✅ Room Number */}
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Room No:</span> {roomNo}
          </p>

          <div className="text-lg space-y-3 max-w-md">
            <p className="font-semibold">
              Your hostel services, simplified!
            </p>

            <p className="text-gray-600">
              Check today’s mess menu or submit and track complaints with just a click.
            </p>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex items-center justify-center">
          <img
            src="/bv.png"
            alt="Hostel"
            className="rounded-2xl object-cover max-h-[380px] shadow-xl"
          />
        </div>

      </div>

      {/* NOTE */}
      <p className="text-sm font-medium mt-8">
        Note:{" "}
        <span className="font-normal">
          Hostel gates close at 9:00 PM sharp.
        </span>
      </p>
    </DashboardLayout>
  );
};

export default StudentDashboard;