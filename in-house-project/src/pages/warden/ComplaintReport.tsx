import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

interface Complaint {
  id: number;
  student_name: string;
  title: string;
  description: string;
  warden_note: string;
  priority: string;
  status: string;
  created_at: string;
  category: string;
}

export default function ComplaintReport() {
  const [type, setType] = useState("all");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({ resolved: 0, pending: 0, inprogress: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, [type]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/reports/complaints/all?type=${type}`);
      const data = await res.json();

      setComplaints(data.complaints || []);
      setStats(data.stats || { resolved: 0, pending: 0, inprogress: 0 });
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Complaint Report</h1>

        {/* Filter */}
        <div className="mb-4">
          <label className="mr-2 font-semibold">View:</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-6">
          <div className="p-4 bg-green-100 rounded">Resolved: {stats.resolved}</div>
          <div className="p-4 bg-yellow-100 rounded">Pending: {stats.pending}</div>
          <div className="p-4 bg-blue-100 rounded">In Progress: {stats.inprogress}</div>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p>No complaints found</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Student</th>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Priority</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Warden Note</th>
                <th className="border px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{c.id}</td>
                  <td className="border px-4 py-2">{c.student_name}</td>
                  <td className="border px-4 py-2">{c.title}</td>
                  <td className="border px-4 py-2">{c.description}</td>
                  <td className="border px-4 py-2">{c.category}</td>
                  <td className="border px-4 py-2">{c.priority}</td>
                  <td className="border px-4 py-2 capitalize">{c.status}</td>
                  <td className="border px-4 py-2">{c.warden_note || "—"}</td>
                  <td className="border px-4 py-2">{new Date(c.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}