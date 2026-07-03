import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Trash2 } from "lucide-react";

interface Student {
  student_id: number;
  name: string;
  course: string;
  room_id?: number;
}

interface Room {
  room_id: number;
  room_no: number;
  capacity: number;
  students: Student[];
}

const AssignRoom = () => {
  const { user } = useAuth();

  const [roomNo, setRoomNo] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [roomExists, setRoomExists] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null);

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [selectedCourse, setSelectedCourse] = useState(""); // ✅ NEW

  // 🔹 Fetch Students
  const fetchStudents = async () => {
    const res = await fetch(`http://localhost:5000/warden/students/${user.email}`);
    const data = await res.json();
    setStudents(data || []);
  };

  // 🔹 Fetch Rooms
  const fetchRooms = async () => {
    const res = await fetch(`http://localhost:5000/rooms/allocation/${user.email}`);
    const data = await res.json();

    const grouped: { [key: number]: Room } = {};

    data.forEach((item: any) => {
      if (!grouped[item.room_id]) {
        grouped[item.room_id] = {
          room_id: item.room_id,
          room_no: item.room_no,
          capacity: item.capacity,
          students: []
        };
      }

      if (item.student_id && item.name) {
        grouped[item.room_id].students.push({
          student_id: item.student_id,
          name: item.name,
        course: item.course_name || ""
        });
      }
    });

    setRooms(Object.values(grouped));
  };

  useEffect(() => {
    fetchStudents();
    fetchRooms();
  }, []);

  // 🔹 Check Room
  const checkRoom = async (roomNo: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/room-by-number/${roomNo}/${user.email}`
      );
      const data = await res.json();

      if (data && data.room_id) {
        setRoomId(data.room_id);
        setRoomExists(true);
      } else {
        setRoomId(null);
        setRoomExists(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!roomNo || isNaN(Number(roomNo))) return;
    const timeout = setTimeout(() => checkRoom(roomNo), 300);
    return () => clearTimeout(timeout);
  }, [roomNo]);

  // 🔹 Create Room
  const handleCreateRoom = async () => {
    const res = await fetch("http://localhost:5000/get-or-create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_no: parseInt(roomNo),
        capacity,
        email: user.email
      })
    });

    const data = await res.json();
    if (data.success) {
      setRoomId(data.room_id);
      setRoomExists(true);
      alert("Room created successfully ✅");
      fetchRooms();
    }
  };

  // 🔹 Assign Students
  const handleAssign = async () => {
    if (!roomId) return alert("Please create/select a room first");
    if (selectedStudents.length === 0) return alert("Select students");

    const res = await fetch("http://localhost:5000/warden/assign-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_id: roomId,
        student_ids: selectedStudents
      })
    });

    const data = await res.json();
    if (data.success) {
      alert("Assigned successfully ✅");
      setSelectedStudents([]);
      fetchStudents();
      fetchRooms();
    } else {
      alert(data.message || "Assignment failed ❌");
    }
  };

  // 🔹 Delete Student
  const handleDelete = async (student_id: number) => {
    const res = await fetch("http://localhost:5000/warden/remove-student-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id })
    });

    const data = await res.json();
    if (data.success) {
      fetchStudents();
      fetchRooms();
    }
  };

  // ✅ Unique Courses
  const courses = [...new Set(students.map(s => s.course))];

  // ✅ Filter Students by Course
  const filteredStudents = selectedCourse
    ? students.filter(s => s.course === selectedCourse)
    : students;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Assign Room</h1>

      <div className="max-w-md space-y-4 mb-8 bg-white p-5 rounded-xl shadow-sm">
        <Input
          value={roomNo}
          onChange={(e) => setRoomNo(e.target.value)}
          placeholder="Room Number"
        />

        {!roomExists && (
          <Input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            placeholder="Capacity"
          />
        )}

        {!roomExists ? (
          <Button onClick={handleCreateRoom}>Create Room</Button>
        ) : (
          <p className="text-green-600 font-semibold">✅ Room already exists</p>
        )}

        {/* ✅ COURSE DROPDOWN */}
        <select
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            setSelectedStudents([]); // reset selection
          }}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select Course</option>
          {courses.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* ✅ STUDENT DROPDOWN */}
        <select
          multiple
          value={selectedStudents.map(String)}
          onChange={(e) =>
            setSelectedStudents(
              Array.from(e.target.selectedOptions).map((o) =>
                Number(o.value)
              )
            )
          }
          className="w-full border rounded-lg p-2 h-40"
        >
          {filteredStudents.length === 0 ? (
            <option disabled>No students available</option>
          ) : (
            filteredStudents.map((s) => (
              <option key={s.student_id} value={s.student_id}>
                {s.name}
              </option>
            ))
          )}
        </select>

        <Button onClick={handleAssign}>Assign</Button>
      </div>

      {/* ✅ TABLE */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Room Allocation</h2>

        {rooms.length === 0 ? (
          <p className="text-gray-500">No data found</p>
        ) : (
          <div className="overflow-hidden rounded-xl border shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Room No</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Students</th>
                </tr>
              </thead>

              <tbody>
                {rooms.map((room) => (
                  <tr key={room.room_id} className="border-t">
                    <td className="p-3 font-semibold">{room.room_no}</td>
                    <td className="p-3">{room.capacity}</td>

                    <td className="p-3">
                      {room.students.map((s) => (
                        <div key={s.student_id} className="flex justify-between">
                          <span>
                            {s.name}
                            <span className="text-gray-500 text-sm ml-2">
                              ({s.course})
                            </span>
                          </span>

                          <button onClick={() => handleDelete(s.student_id)}>
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AssignRoom;