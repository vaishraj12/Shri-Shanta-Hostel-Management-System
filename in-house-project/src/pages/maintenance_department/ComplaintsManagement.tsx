import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Complaint = {
  id: number;
  hostel_name: string;
  room_no: string;
  title: string;
  description?: string;
  category_name: string;
  status: string;
  created_at: string;
  pending_days?: number;
};

const MunicipalComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [hostels, setHostels] = useState<any[]>([]); // ✅ NEW

  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [hostel, setHostel] = useState("");
  const [date, setDate] = useState("");

  const [selectedComplaint, setSelectedComplaint] =
    useState<Complaint | null>(null);

  // ================= DATE FORMAT =================
  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = d.toLocaleString("en-GB", { day: "2-digit" });
    const month = d.toLocaleString("en-GB", { month: "long" });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // ================= FETCH =================
  const fetchComplaints = async () => {
    const query = new URLSearchParams({
      category,
      status,
      hostel,
      date,
    }).toString();

    const res = await fetch(
      `http://localhost:5000/complaints/municipal?${query}`
    );

    const data: Complaint[] = await res.json();
    setComplaints(data);

    const uniqueStatuses = [...new Set(data.map((c) => c.status))] as string[];
    setStatuses(uniqueStatuses);
  };

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/categories");
    const data = await res.json();
    setCategories(data);
  };

  // ✅ NEW: Fetch hostels
  const fetchHostels = async () => {
    const res = await fetch("http://localhost:5000/hostels");
    const data = await res.json();
    setHostels(data);
  };

  useEffect(() => {
    fetchComplaints();
    fetchCategories();
    fetchHostels(); // ✅ added
  }, []);

  // ================= GROUP =================
  const groupComplaints = (data: Complaint[]) => {
    const grouped: any = {};

    data.forEach((c) => {
      const dateKey = formatDate(c.created_at);

      if (!grouped[dateKey]) grouped[dateKey] = {};
      if (!grouped[dateKey][c.hostel_name])
        grouped[dateKey][c.hostel_name] = [];

      grouped[dateKey][c.hostel_name].push(c);
    });

    return grouped;
  };

  const groupedData = groupComplaints(complaints);

  // ================= STATUS UPDATE =================
  const updateStatus = async () => {
    if (!selectedComplaint) return;

    await fetch(
      `http://localhost:5000/complaints/${selectedComplaint.id}/status`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "in-progress" }),
      }
    );

    setSelectedComplaint(null);
    fetchComplaints();
  };

  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* CATEGORY */}
          <select
            className="border p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.category_name}
              </option>
            ))}
          </select>

          {/* STATUS */}
          <select
            className="border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* DATE */}
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          {/* ✅ HOSTEL DROPDOWN */}
          <select
            className="border p-2 rounded"
            value={hostel}
            onChange={(e) => setHostel(e.target.value)}
          >
            <option value="">All Hostels</option>
            {hostels.map((h) => (
              <option key={h.hostel_id} value={h.hostel_name}>
                {h.hostel_name}
              </option>
            ))}
          </select>

        </div>

        <Button className="text-white" onClick={fetchComplaints}>Apply Filters</Button>

        {/* DATA */}
        {Object.keys(groupedData).length === 0 ? (
          <p>No complaints found</p>
        ) : (
          Object.entries(groupedData).map(([dateKey, hostels]: any) => (
            <div key={dateKey} className="border rounded p-4">

              <h2 className="text-xl font-bold mb-4">{dateKey}</h2>

              {Object.entries(hostels).map(([hostelName, list]: any) => (
                <div key={hostelName} className="mb-6">

                  <h3 className="text-lg font-semibold mb-2">
                    {hostelName}
                  </h3>

                  <table className="w-full border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2">Title</th>
                        <th className="border p-2">Description</th>
                        <th className="border p-2">Category</th>
                        <th className="border p-2">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {list.map((c: Complaint) => (
                        <tr
                          key={c.id}
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => setSelectedComplaint(c)}
                        >
                          <td className="border p-2">{c.title}</td>

                          <td className="border p-2">
                            {c.description || "—"}
                          </td>

                          <td className="border p-2">
                            {c.category_name}
                          </td>

                          <td className="border p-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedComplaint(c);
                              }}
                              className={`px-3 py-1 rounded text-white ${
                                c.status.toLowerCase() === "pending"
                                  ? "bg-yellow-500"
                                  : c.status.toLowerCase() === "in-progress"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              }`}
                            >
                              {c.status}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
              ))}
            </div>
          ))
        )}

        {/* POPUP */}
        {selectedComplaint && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="bg-white p-6 rounded shadow-lg space-y-4 w-[400px]">

              <h2 className="text-lg font-bold">Complaint Details</h2>

              <p><b>Title:</b> {selectedComplaint.title}</p>
              <p><b>Description:</b> {selectedComplaint.description || "—"}</p>
              <p><b>Category:</b> {selectedComplaint.category_name}</p>
              <p><b>Status:</b> {selectedComplaint.status}</p>
              <p><b>Room:</b> {selectedComplaint.room_no}</p>
              <p><b>Date:</b> {formatDate(selectedComplaint.created_at)}</p>

              {selectedComplaint.status.toLowerCase() === "pending" && (
                <Button className="text-white" onClick={updateStatus}>
                  Mark In-Progress
                </Button>
              )}

              <Button 
                variant="outline"
                onClick={() => setSelectedComplaint(null)}
              >
                Close
              </Button>

            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MunicipalComplaints;