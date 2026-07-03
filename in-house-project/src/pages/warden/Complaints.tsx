import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Complaint = {
  id: number;
  room_no: string;
  category_name: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "resolved";
  created_at: string;
  warden_note?: string;
};

type Category = {
  id: number;
  category_name: string;
};

const WardenComplaints = () => {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [wardenNote, setWardenNote] = useState("");

  // ================= LOAD =================
  const loadComplaints = async () => {
    if (!user?.email) return;

    try {
      const url = new URL(`http://localhost:5000/complaints/warden/${user.email}`);

      if (categoryFilter !== "all") {
        url.searchParams.append("category", categoryFilter);
      }

      if (statusFilter !== "all") {
        url.searchParams.append("status", statusFilter);
      }

      const res = await fetch(url.toString());
      const data: Complaint[] = await res.json();
      setComplaints(data);
    } catch {
      toast.error("Failed to load complaints");
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/categories");
      const data = await res.json();
      setCategories(data || []);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [user, categoryFilter, statusFilter]);

  useEffect(() => {
    loadCategories();
  }, []);

  // ================= GROUPING =================
  const grouped = complaints.reduce((acc: any, c) => {
    const date = new Date(c.created_at).toLocaleDateString("en-GB");

    if (!acc[date]) acc[date] = {};
    if (!acc[date][c.room_no]) acc[date][c.room_no] = [];

    acc[date][c.room_no].push(c);

    return acc;
  }, {});

  // ================= RESOLVE =================
  const resolveComplaint = async () => {
    if (!selectedComplaint) return;

    try {
      const res = await fetch(
        `http://localhost:5000/complaints/${selectedComplaint.id}/resolve`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note: wardenNote }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Resolved");
        setSelectedComplaint(null);
        setWardenNote("");
        loadComplaints();
      }
    } catch {
      toast.error("Error");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <h1 className="text-3xl font-bold">Warden Complaints</h1>

        {/* ================= FILTERS ================= */}
        <div className="flex gap-4">
          <select
            className="border p-2 rounded"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.category_name}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* ================= DISPLAY ================= */}
        {Object.keys(grouped).length === 0 && (
          <p>No complaints found</p>
        )}

        {Object.entries(grouped).map(([date, rooms]: any) => (
          <div key={date} className="border rounded-xl p-4 space-y-4">

            {/* DATE HEADER */}
            <h2 className="text-xl font-bold">📅 {date}</h2>

            {Object.entries(rooms).map(([room, comps]: any) => (
              <div key={room} className="ml-4">

                {/* ROOM HEADER */}
                <h3 className="font-semibold mb-2">Room {room}</h3>

                <table className="w-full text-sm border rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2">Category</th>
                      <th className="p-2">Title</th>
                      <th className="p-2">Description</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {comps.map((c: Complaint) => (
                      <tr
                        key={c.id}
                        className="border-t hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedComplaint(c);
                          setWardenNote(c.warden_note || "");
                        }}
                      >
                        <td className="p-2">{c.category_name}</td>
                        <td className="p-2">{c.title}</td>
                        <td className="p-2">{c.description}</td>
                        <td className="p-2">
                          <StatusBadge status={c.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            ))}
          </div>
        ))}

        {/* ================= POPUP ================= */}
        <Dialog
          open={!!selectedComplaint}
          onOpenChange={() => setSelectedComplaint(null)}
        >
          <DialogContent>
            {selectedComplaint && (
              <>
                <DialogHeader>
                  <DialogTitle>Complaint Details</DialogTitle>
                </DialogHeader>

                <p><b>Room:</b> {selectedComplaint.room_no}</p>
                <p><b>Category:</b> {selectedComplaint.category_name}</p>
                <p><b>Title:</b> {selectedComplaint.title}</p>
                <p><b>Description:</b> {selectedComplaint.description}</p>

                {selectedComplaint.status === "in-progress" && (
                  <>
                    <Textarea
                      value={wardenNote}
                      onChange={(e) => setWardenNote(e.target.value)}
                    />
                    <Button onClick={resolveComplaint}>
                      Mark Resolved
                    </Button>
                  </>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default WardenComplaints;