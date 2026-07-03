


import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Trash2, Building, User } from "lucide-react";

interface Hostel {
  hostel_id: number;
  hostel_name: string;
}

interface Warden {
  warden_id: number;
  name: string;
}

interface Assignment {
  id: number;
  hostel_id: number;
  warden_id: number;
  hostel_name: string;
  warden_name: string;
}

const Wardens: React.FC = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [wardens, setWardens] = useState<Warden[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [selectedHostel, setSelectedHostel] = useState<string>("");
  const [selectedWarden, setSelectedWarden] = useState<string>("");

  const [newHostel, setNewHostel] = useState("");
  const [message, setMessage] = useState<string>("");

  const fetchHostels = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/hostels");
      const data = await res.json();
      setHostels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWardens = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/wardens");
      const data = await res.json();
      setWardens(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/admin/warden-hostel-assignments"
      );
      const data = await res.json();
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHostels();
    fetchWardens();
    fetchAssignments();
  }, []);

  const addHostel = async () => {
    if (!newHostel.trim()) return;

    await fetch("http://localhost:5000/admin/add-hostel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostel_name: newHostel }),
    });

    setNewHostel("");
    fetchHostels();
  };

  const assignWarden = async () => {
    if (!selectedHostel || !selectedWarden) {
      alert("Please select hostel and warden");
      return;
    }

    const duplicate = assignments.some(
      (a) =>
        a.hostel_id === Number(selectedHostel) &&
        a.warden_id === Number(selectedWarden)
    );

    if (duplicate) {
      alert("This warden is already assigned to this hostel!");
      return;
    }

    await fetch("http://localhost:5000/admin/assign-warden-hostel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hostel_id: Number(selectedHostel),
        warden_ids: [Number(selectedWarden)],
      }),
    });

    setSelectedHostel("");
    setSelectedWarden("");
    fetchAssignments();

    setMessage("Warden assigned successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const removeAssignment = async (id: number) => {
    await fetch(`http://localhost:5000/admin/remove-warden-assignment/${id}`, {
      method: "DELETE",
    });

    fetchAssignments();
  };

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-bold">Warden Hostel Management</h1>
          {message && <p className="text-green-600 mt-2">{message}</p>}
        </div>

        {/* ASSIGN */}
        <div className="grid md:grid-cols-3 gap-4 items-end bg-white p-4 rounded-xl shadow-sm">
          <div>
            <label className="text-sm text-gray-600">Select Hostel</label>
            <Select value={selectedHostel} onValueChange={setSelectedHostel}>
              <SelectTrigger>
                <SelectValue placeholder="Choose Hostel" />
              </SelectTrigger>
              <SelectContent>
                {hostels.map((h) => (
                  <SelectItem key={h.hostel_id} value={String(h.hostel_id)}>
                    {h.hostel_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Select Warden</label>
            <Select value={selectedWarden} onValueChange={setSelectedWarden}>
              <SelectTrigger>
                <SelectValue placeholder="Choose Warden" />
              </SelectTrigger>
              <SelectContent>
                {wardens.map((w) => (
                  <SelectItem key={w.warden_id} value={String(w.warden_id)}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={assignWarden} className="text-white">
            <Plus className="w-4 h-4 mr-1" /> Assign
          </Button>
        </div>

        {/* ADD HOSTEL */}
        <div className="flex gap-2 bg-white p-4 rounded-xl shadow-sm text-white">
          <Input
            placeholder="New Hostel"
            value={newHostel}
            onChange={(e) => setNewHostel(e.target.value)}
          />
          <Button onClick={addHostel}>Add</Button>
        </div>

        {/* ASSIGNMENTS */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Assignments</h3>

          {assignments.length === 0 ? (
            <p className="text-gray-500">No assignments found</p>
          ) : (
            assignments.map((a) => (
              <div
                key={a.id}
                className="flex justify-between items-center p-4 border rounded-xl mb-3 bg-white shadow-sm hover:shadow-md transition"
              >
                {/* LEFT SIDE */}
                <div className="flex gap-8 items-center">
                  {/* Hostel */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Building className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{a.hostel_name}</span>
                  </div>

                  {/* Warden */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">{a.warden_name}</span>
                  </div>
                </div>

                {/* DELETE */}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeAssignment(a.id)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Wardens;
