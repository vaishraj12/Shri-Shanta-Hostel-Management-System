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

import { Plus, Trash2, Building2, GraduationCap } from "lucide-react";

/* ================= TYPES ================= */

type Hostel = {
  hostel_id: number;
  hostel_name: string | any;
};

type Course = {
  course_id: number;
  course_label: string | any;
  course_year: string | number;
};

type Assignment = {
  id: number;
  hostel_name: string;
  course_name: string;
};

/* ================= SAFE STRING FUNCTION ================= */

const safeString = (value: any) => {
  if (value === null || value === undefined) return "";

  if (typeof value === "object") {
    if (value.data) {
      try {
        return new TextDecoder().decode(new Uint8Array(value.data));
      } catch {
        return "";
      }
    }
    return "";
  }

  return String(value);
};

/* ================= COMPONENT ================= */

const Students: React.FC = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [selectedHostel, setSelectedHostel] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [newHostel, setNewHostel] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [newCourseYear, setNewCourseYear] = useState("");

  /* ================= FETCH DATA ================= */

  const fetchHostels = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/hostels");
      const data = await res.json();
      setHostels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Hostel fetch error:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/courses");
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Course fetch error:", err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/hostel-course");
      const data = await res.json();
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Assignment fetch error:", err);
    }
  };

  useEffect(() => {
    fetchHostels();
    fetchCourses();
    fetchAssignments();
  }, []);

  /* ================= ASSIGN COURSE ================= */

  const assignCourse = async () => {
  if (!selectedHostel || !selectedCourse) {
    alert("Please select hostel and course");
    return;
  }

  // Check if this hostel-course combination already exists (using IDs)
  const exists = assignments.some(
    (a) =>
      a.hostel_name ===
        hostels.find((h) => h.hostel_id === Number(selectedHostel))?.hostel_name &&
      a.course_name ===
        courses.find((c) => c.course_id === Number(selectedCourse))?.course_label
  );

  if (exists) {
    alert("This course is already assigned to the selected hostel!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/admin/assign-hostel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hostel_id: Number(selectedHostel),
        course_id: Number(selectedCourse),
      }),
    });

    const data = await res.json();

    // Check server response for success
    if (data.success) {
      alert("Course assigned successfully!");
      setSelectedHostel("");
      setSelectedCourse("");
      fetchAssignments();
    } else {
      alert(data.message || "Assignment failed!");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  }
};

  /* ================= ADD HOSTEL ================= */

  const addHostel = async () => {
  if (!newHostel) {
    alert("Please enter a hostel name!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/admin/add-hostel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hostel_name: newHostel.trim(),
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Hostel added successfully!");
      setNewHostel("");
      fetchHostels(); // refresh list
    } else {
      alert(data.message || "Failed to add hostel!");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  }
};

 /* ================= ADD COURSE ================= */

const addCourse = async () => {
  if (!newCourse || !newCourseYear) {
    alert("Please enter course name and year!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/admin/add-course", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_name: newCourse,
        course_year: newCourseYear,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Course added successfully!");
      setNewCourse("");
      setNewCourseYear("");
      fetchCourses(); 
    } else {
      // show error from backend, e.g., duplicate
      alert(data.message || "Failed to add course!");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  }

};
  /* ================= REMOVE ASSIGNMENT ================= */

  const removeAssignment = async (id: number) => {
    await fetch(`http://localhost:5000/admin/remove-assignment/${id}`, {
      method: "DELETE",
    });
    fetchAssignments();
  };

  /* ================= UI ================= */

  // Filter courses already assigned to the selected hostel
  const filteredCourses = selectedHostel
    ? courses.filter((c) => {
        const hostelName = hostels.find(
          (h) => h.hostel_id === Number(selectedHostel)
        )?.hostel_name;
        return !assignments.some(
          (a) => a.hostel_name === hostelName && a.course_name === c.course_label
        );
      })
    : courses;

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-bold">Hostel Course Management</h1>
          <p className="text-gray-600">
            Assign which courses stay in which hostels
          </p>
        </div>

        {/* ASSIGN SECTION */}
        <div className="grid md:grid-cols-3 gap-4 items-end">
          {/* HOSTEL SELECT */}
          <div>
            <label className="text-sm font-medium">Select Hostel</label>
            <Select value={selectedHostel} onValueChange={setSelectedHostel}>
              <SelectTrigger>
                <SelectValue placeholder="Choose Hostel" />
              </SelectTrigger>
              <SelectContent>
                {hostels.map((h) => (
                  <SelectItem key={h.hostel_id} value={String(h.hostel_id)}>
                    {safeString(h.hostel_name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* COURSE SELECT */}
          <div>
            <label className="text-sm font-medium">Select Course</label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Choose Course" />
              </SelectTrigger>
              <SelectContent>
                {filteredCourses.map((c) => (
                  <SelectItem key={c.course_id} value={String(c.course_id)}>
                    {safeString(c.course_label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={assignCourse} className="flex gap-2 text-white">
            <Plus className="w-4 h-4" />
            Assign
          </Button>
        </div>

        {/* ADD HOSTEL / COURSE */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Add New Hostel
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="Hostel name"
                value={newHostel}
                onChange={(e) => setNewHostel(e.target.value)}
              />
              <Button onClick={addHostel} className="text-white">
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Add New Course
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="Course name"
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
              />
              <Input
                placeholder="Year"
                type="number"
                value={newCourseYear}
                onChange={(e) => setNewCourseYear(e.target.value)}
              />
              <Button onClick={addCourse} className="text-white">
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* ASSIGNMENTS */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Current Assignments</h3>
          {assignments.map((a) => (
            <div
              key={a.id}
              className="flex justify-between items-center p-4 bg-white rounded-lg border shadow-sm"
            >
              <div className="flex gap-6 text-sm">
                <span className="flex gap-1 items-center">
                  <Building2 className="w-4 h-4" />
                  {safeString(a.hostel_name)}
                </span>
                <span className="flex gap-1 items-center">
                  <GraduationCap className="w-4 h-4" />
                  {safeString(a.course_name)}
                </span>
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeAssignment(a.id)}
              >
                <Trash2 className="w-4 h-4 text-white" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Students;