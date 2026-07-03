import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

type Student = {
  student_id: number;
  name: string;
  room_no: number;
  hostel_id: number;
  status?: string;
};

const WardenAttendance: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  // ================= GET TODAY DATE (LOCAL) =================
  const getTodayLocal = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = getTodayLocal();

  // ================= FETCH ATTENDANCE DATA =================
  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // NOTE:
    // If your backend route is actually "/api/attendance/..." then keep "/api"
    // If route is "/attendance/..." then remove "/api"
    fetch(`http://localhost:5000/api/attendance/${today}/${user.email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch attendance data");
        return res.json();
      })
      .then((data) => {
        const studentList = Array.isArray(data) ? data : [];
        setStudents(studentList);

        const initialAttendance: Record<number, string> = {};
        studentList.forEach((student: Student) => {
          initialAttendance[student.student_id] = student.status || "Absent";
        });

        setAttendance(initialAttendance);
      })
      .catch((err) => {
        console.error("Attendance fetch error:", err);
        alert("Failed to load attendance");
        setStudents([]);
      })
      .finally(() => setLoading(false));
  }, [user?.email, today]);

  // ================= HANDLE CHECKBOX =================
  const handleCheckboxChange = (studentId: number, checked: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: checked ? "Present" : "Absent",
    }));
  };

  // ================= SUMMARY COUNTS =================
  const { presentCount, absentCount } = useMemo(() => {
    let present = 0;
    let absent = 0;

    students.forEach((student) => {
      const status = attendance[student.student_id] || "Absent";
      if (status === "Present") present++;
      else absent++;
    });

    return { presentCount: present, absentCount: absent };
  }, [students, attendance]);

  // ================= SUBMIT ATTENDANCE =================
  const submitAttendance = () => {
    if (!user?.email) {
      alert("Warden not logged in");
      return;
    }

    const attendanceData = students.map((student) => ({
      student_id: student.student_id,
      hostel_id: student.hostel_id,
      date: today,
      status: attendance[student.student_id] || "Absent",
      warden_email: user.email, // use email because your AuthContext has email, not id
    }));

    fetch("http://localhost:5000/api/attendance/mark", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ attendanceData }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Submit failed");
        return res.json();
      })
      .then((data) => {
        alert(data.message || "Attendance Submitted Successfully");
      })
      .catch((err) => {
        console.error("Attendance submit error:", err);
        alert("Failed to submit attendance");
      });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Hostel Attendance</h1>
          <p className="text-gray-600">Date: {today}</p>
        </div>

        {loading ? (
          <div className="text-center py-10 font-semibold">
            Loading attendance...
          </div>
        ) : (
          <>
            {/* TABLE */}
            <div className="overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">Room No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3 text-center">Present</th>
                  </tr>
                </thead>

                <tbody>
                  {students.length > 0 ? (
                    students.map((student) => {
                      const isPresent =
                        (attendance[student.student_id] || "Absent") ===
                        "Present";

                      return (
                        <tr key={student.student_id} className="border-t">
                          <td className="p-3">{student.room_no ?? "N/A"}</td>
                          <td className="p-3">{student.name}</td>
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={isPresent}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  student.student_id,
                                  e.target.checked
                                )
                              }
                              className="h-5 w-5 accent-blue-600"
                            />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center p-4">
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* SUMMARY */}
            <div className="flex gap-4 flex-wrap">
              <div className="px-6 py-4 bg-green-100 rounded-lg font-semibold">
                Present: {presentCount}
              </div>

              <div className="px-6 py-4 bg-red-100 rounded-lg font-semibold">
                Absent: {absentCount}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={submitAttendance}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Submit Attendance
              </button>

              <button
                onClick={() => navigate("/warden/attendance-records")}
                className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                View Record
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WardenAttendance;