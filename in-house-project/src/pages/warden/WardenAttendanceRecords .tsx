import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

type Student = {
  student_id: number;
  name: string;
  room_no?: number | null;
};

type AttendanceRecord = {
  attendance_id: number;
  student_id: number;
  student_name: string;
  room_no: number;
  date: string;
  status: "Present" | "Absent";
};

const formatMonthName = (monthKey: string) => {
  const [year, month] = monthKey.split("-");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthIndex = Number(month) - 1;
  if (monthIndex < 0 || monthIndex > 11) return monthKey;

  return `${monthNames[monthIndex]} ${year}`;
};

const generateAcademicMonths = (sessionEndYear: number) => {
  const months: string[] = [];

  for (let m = 7; m <= 12; m++) {
    months.push(`${sessionEndYear - 1}-${String(m).padStart(2, "0")}`);
  }

  for (let m = 1; m <= 4; m++) {
    months.push(`${sessionEndYear}-${String(m).padStart(2, "0")}`);
  }

  return months;
};

const WardenAttendanceRecords = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrintRecords = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Previous_Attendance_Records",
  });

  // ================= FETCH ATTENDANCE RECORDS =================
  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);

    fetch(`http://localhost:5000/attendance-records/${encodeURIComponent(user.email)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch attendance records");
        return res.json();
      })
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];
        console.log("Fetched attendance records:", safeData);
        setAllRecords(safeData);
      })
      .catch((err) => {
        console.error("Error fetching attendance records:", err);
        alert("Failed to load attendance records");
        setAllRecords([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  // ================= STUDENT OPTIONS FROM ATTENDANCE RECORDS =================
  const students = useMemo<Student[]>(() => {
    const uniqueMap = new Map<number, Student>();

    allRecords.forEach((record) => {
      if (!uniqueMap.has(record.student_id)) {
        uniqueMap.set(record.student_id, {
          student_id: record.student_id,
          name: record.student_name,
          room_no: record.room_no,
        });
      }
    });

    return Array.from(uniqueMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [allRecords]);

  // ================= AVAILABLE MONTHS =================
  const availableMonths = useMemo(() => {
    if (allRecords.length === 0) return [];

    let latestYear = 0;

    allRecords.forEach((record) => {
      const [year] = String(record.date).slice(0, 10).split("-");
      const y = Number(year);
      if (!isNaN(y) && y > latestYear) latestYear = y;
    });

    if (!latestYear) return [];

    const academicMonths = generateAcademicMonths(latestYear);

    const recordMonthSet = new Set(
      allRecords.map((r) => String(r.date).slice(0, 7))
    );

    return academicMonths.filter((m) => recordMonthSet.has(m));
  }, [allRecords]);

  // ================= FILTERED RECORDS =================
  const filteredRecords = useMemo(() => {
    const filtered = allRecords.filter((record) => {
      const studentMatch = selectedStudentId
        ? String(record.student_id).trim() === selectedStudentId.trim()
        : true;

      const recordDateOnly = String(record.date).slice(0, 10);
      const recordMonthOnly = recordDateOnly.slice(0, 7);

      const dateMatch = selectedDate ? recordDateOnly === selectedDate : true;
      const monthMatch = selectedMonth ? recordMonthOnly === selectedMonth : true;

      return studentMatch && dateMatch && monthMatch;
    });

    console.log("Selected Student ID:", selectedStudentId);
    console.log("Filtered Records:", filtered);

    return filtered;
  }, [allRecords, selectedStudentId, selectedDate, selectedMonth]);

  // ================= REPORT SUMMARY =================
  const reportSummary = useMemo(() => {
    const monthly: Record<string, number> = {};
    const yearly: Record<string, number> = {};

    filteredRecords.forEach((r) => {
      if (r.status !== "Present") return;

      const [year, month] = String(r.date).slice(0, 10).split("-");
      const mKey = `${year}-${month}`;

      monthly[mKey] = (monthly[mKey] || 0) + 1;
      yearly[year] = (yearly[year] || 0) + 1;
    });

    return {
      monthlyPresent: Object.entries(monthly)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([month, count]) => ({ month, count })),

      yearlyPresent: Object.entries(yearly)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([year, count]) => ({ year, count })),
    };
  }, [filteredRecords]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Attendance Records</h1>
          <p className="text-gray-600">
            View and analyze previous student attendance records
          </p>
        </div>

        {/* FILTERS */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {/* STUDENT FILTER */}
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Students</option>
              {students.map((s) => (
                <option key={s.student_id} value={String(s.student_id)}>
                  {s.name}
                  {s.room_no !== undefined && s.room_no !== null
                    ? ` (Room ${s.room_no})`
                    : ""}
                </option>
              ))}
            </select>

            {/* DATE FILTER */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                if (e.target.value) setSelectedMonth("");
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* MONTH FILTER */}
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                if (e.target.value) setSelectedDate("");
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Months</option>
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {formatMonthName(m)}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <button
              onClick={() => {
                setSelectedStudentId("");
                setSelectedDate("");
                setSelectedMonth("");
              }}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* RECORDS TABLE */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6" ref={printRef}>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold">Previous Attendance</h2>

            {!loading && filteredRecords.length > 0 && (
              <button
                onClick={handlePrintRecords}
                className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Print / PDF
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-10 font-semibold text-gray-600">
              Loading attendance records...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No attendance records found.
            </div>
          ) : (
            <>
              <div className="overflow-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Room No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRecords.map((r) => (
                      <tr key={r.attendance_id} className="border-t">
                        <td className="p-3">{String(r.date).slice(0, 10)}</td>
                        <td className="p-3">{r.room_no}</td>
                        <td className="p-3">{r.student_name}</td>
                        <td
                          className={`p-3 font-medium ${
                            r.status === "Present"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {r.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* SUMMARY REPORT */}
              <div className="flex gap-4 flex-wrap mt-6">
                <div className="flex-1 min-w-[280px] px-6 py-4 bg-green-100 rounded-lg">
                  <h4 className="font-semibold mb-3">Monthly Present Count</h4>
                  {reportSummary.monthlyPresent.length > 0 ? (
                    reportSummary.monthlyPresent.map((item) => (
                      <div key={item.month} className="flex justify-between py-1">
                        <span>{formatMonthName(item.month)}</span>
                        <span className="font-semibold">{item.count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No monthly present data.</p>
                  )}
                </div>

                <div className="flex-1 min-w-[280px] px-6 py-4 bg-blue-100 rounded-lg">
                  <h4 className="font-semibold mb-3">Yearly Present Count</h4>
                  {reportSummary.yearlyPresent.length > 0 ? (
                    reportSummary.yearlyPresent.map((item) => (
                      <div key={item.year} className="flex justify-between py-1">
                        <span>{item.year}</span>
                        <span className="font-semibold">{item.count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No yearly present data.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => navigate("/warden/attendance")}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            Back
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WardenAttendanceRecords;