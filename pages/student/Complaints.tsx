import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Clock,
  HelpCircle,
  Zap,
  Droplets,
  Armchair,
  Sparkles,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

// ================= TYPES =================
type Status = "pending" | "in-progress" | "resolved";

type Complaint = {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: Status;
  room_no: string;
  created_at: string;
  category_name?: string;
};

type Category = {
  id: number;
  category_name: string;
};

// ================= ICON MAP =================
const categoryIcons: Record<string, any> = {
  electrical: Zap,
  plumbing: Droplets,
  furniture: Armchair,
  cleaning: Sparkles,
  other: HelpCircle,
};

const Complaints = () => {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedComplaint, setSelectedComplaint] =
    useState<Complaint | null>(null);

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    priority: "medium",
  });

  // ================= FORMAT =================
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d
      .getDate()
      .toString()
      .padStart(2, "0")}-${d.toLocaleString("en-GB", {
      month: "long",
    })}-${d.getFullYear()}`;
  };

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // ================= FETCH =================
  const fetchComplaints = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/complaints/student/${user?.email}`
      );
      const data = await res.json();
      setComplaints(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load complaints");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`http://localhost:5000/categories`);
      const data = await res.json();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchCategories();
  }, []);

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔥 VALIDATION
    if (!formData.category) {
      toast.error("Please select category");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, ...formData }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Complaint submitted");
        setPopupOpen(false);
        setFormData({
          category: "",
          title: "",
          description: "",
          priority: "medium",
        });
        fetchComplaints();
      } else {
        toast.error(data.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      const res = await fetch(
        `http://localhost:5000/complaints/${selectedComplaint.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Complaint updated");
        setEditMode(false);
        setPopupOpen(false);
        fetchComplaints();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/complaints/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Complaint deleted");
        setPopupOpen(false);
        fetchComplaints();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // ================= GROUP =================
  const groupedComplaints = complaints.reduce((acc: any, c) => {
    const date = formatDate(c.created_at);
    if (!acc[date]) acc[date] = [];
    acc[date].push(c);
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Complaints</h1>
            <p className="text-muted-foreground">
              Submit and track complaints
            </p>
          </div>

          <Button
            className="text-white"
            onClick={() => {
              setSelectedComplaint(null);
              setEditMode(false);
              setPopupOpen(true);
              setFormData({
                category: "",
                title: "",
                description: "",
                priority: "medium",
              });
            }}
          >
            <Plus> </Plus>New Complaint
          </Button>
        </div>

        {/* LIST */}
        {Object.keys(groupedComplaints).map((date) => (
          <div key={date} className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-semibold">{date}</h2>
            </div>

            {groupedComplaints[date].map((c: Complaint) => {
              const Icon =
                categoryIcons[c.category_name?.toLowerCase()] ||
                HelpCircle;

              return (
                <div
                  key={c.id}
                  className="bg-white border rounded-lg p-4 cursor-pointer hover:bg-muted/30"
                  onClick={() => {
                    setSelectedComplaint(c);
                    setFormData({
                      category: "",
                      title: c.title,
                      description: c.description,
                      priority: c.priority,
                    });
                    setEditMode(false);
                    setPopupOpen(true);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>

                      <div>
                        <p className="font-semibold">{c.title}</p>
                        <div className="text-sm text-gray-500 flex gap-4">
                          <span>Room {c.room_no}</span>
                          <span>{c.priority} priority</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={c.status} />
                      <div className="text-xs text-gray-400 flex gap-1 items-center">
                        <Clock size={12} />
                        {formatTime(c.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* POPUP */}
        <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editMode
                  ? "Edit Complaint"
                  : selectedComplaint
                  ? "Complaint Details"
                  : "New Complaint"}
              </DialogTitle>
            </DialogHeader>

            {/* VIEW MODE */}
            {!editMode && selectedComplaint && (
              <div className="space-y-2">
                <p><b>Title:</b> {selectedComplaint.title}</p>
                <p><b>Description:</b> {selectedComplaint.description}</p>
                <p><b>Category:</b> {selectedComplaint.category_name}</p>
                <p><b>Priority:</b> {selectedComplaint.priority}</p>
                <p><b>Room:</b> {selectedComplaint.room_no}</p>
                <p><b>Status:</b> <StatusBadge status={selectedComplaint.status} /></p>

                {selectedComplaint.status === "pending" && (
                  <div className="flex gap-3 mt-4 text-white">
                    <Button onClick={() => setEditMode(true)}>Edit</Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(selectedComplaint.id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* FORM */}
            {(editMode || !selectedComplaint) && (
              <form
                onSubmit={editMode ? handleUpdate : handleSubmit}
                className="space-y-4"
              >
                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) =>
                      setFormData({ ...formData, category: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.id.toString()}
                        >
                          {cat.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Title</Label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(v) =>
                      setFormData({ ...formData, priority: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full text-white">
                  {editMode ? "Update Complaint" : "Submit Complaint"}
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Complaints;