import React, { useEffect, useRef, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

type Worker = {
  id: number;
  name: string;
  phone_no: string;
  category: number;
  category_name: string;
};

type Category = {
  id: number;
  category_name: string;
};

const WorkersDetail: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone_no: "",
    category: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // 3-dot menu state
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Fetch workers
  const fetchWorkers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/workers");
      const data = await res.json();

      if (res.ok) {
        setWorkers(Array.isArray(data) ? data : []);
      } else {
        console.error("Workers API error:", data);
        alert(data.error || "Failed to fetch workers");
      }
    } catch (error) {
      console.error("Error fetching workers:", error);
      alert("Error fetching workers");
    }
  };

  // Fetch complaint categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/workers/categories");
      const data = await res.json();

      if (res.ok) {
        setCategories(Array.isArray(data) ? data : []);
      } else {
        console.error("Categories API error:", data);
        alert(data.error || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Error fetching categories");
    }
  };

  // Load data on page open
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchWorkers(), fetchCategories()]);
      setLoading(false);
    };

    loadData();
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle input change for Add Worker form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle category filter change
  const handleCategoryFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(e.target.value);
  };

  // Add worker
  const handleAddWorker = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone_no || !formData.category) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("http://localhost:5000/api/workers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone_no: formData.phone_no.trim(),
          category: Number(formData.category),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to add worker");
        return;
      }

      alert("Worker added successfully");

      setFormData({
        name: "",
        phone_no: "",
        category: "",
      });

      setShowAddModal(false);
      await fetchWorkers();
    } catch (error) {
      console.error("Error adding worker:", error);
      alert("Something went wrong while adding worker");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete worker
  const handleDeleteWorker = async (workerId: number, workerName: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${workerName}?`
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(workerId);

      const res = await fetch(`http://localhost:5000/api/workers/${workerId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete worker");
        return;
      }

      alert("Worker deleted successfully");
      setOpenMenuId(null);
      await fetchWorkers();
    } catch (error) {
      console.error("Error deleting worker:", error);
      alert("Something went wrong while deleting worker");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter workers based on selected category
  const filteredWorkers =
    selectedCategory === ""
      ? workers
      : workers.filter((worker) => worker.category === Number(selectedCategory));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Workers Detail</h1>
            <p className="text-gray-600">View and manage maintenance workers.</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Worker
          </button>
        </div>

        {/* FILTERS */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
            <select
              value={selectedCategory}
              onChange={handleCategoryFilterChange}
              className="w-full sm:w-72 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>

            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">S.No.</th>
                <th className="p-3">Worker Name</th>
                <th className="p-3">Phone Number</th>
                <th className="p-3">Work Type</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-4 font-semibold">
                    Loading workers...
                  </td>
                </tr>
              ) : filteredWorkers.length > 0 ? (
                filteredWorkers.map((worker, index) => (
                  <tr key={worker.id} className="border-t">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{worker.name}</td>
                    <td className="p-3">{worker.phone_no}</td>
                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {worker.category_name || "Unknown"}
                      </span>
                    </td>

                    {/* 3-dot action menu */}
                    <td className="p-3 text-center">
                      <div
                        className="relative inline-block"
                        ref={openMenuId === worker.id ? menuRef : null}
                      >
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === worker.id ? null : worker.id
                            )
                          }
                          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-xl font-bold text-gray-700"
                          title="More actions"
                        >
                          ⋮
                        </button>

                        {openMenuId === worker.id && (
                          <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-md z-20 overflow-hidden">
                            <button
                              onClick={() =>
                                handleDeleteWorker(worker.id, worker.name)
                              }
                              disabled={deletingId === worker.id}
                              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 disabled:opacity-60"
                            >
                              {deletingId === worker.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    {selectedCategory
                      ? "No workers found for selected category."
                      : "No workers available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* NOTE */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4">
          <p className="font-semibold">
            Note:{" "}
            <span className="font-normal text-gray-700">
              Workers are categorized based on maintenance complaint types such as Electrical, Plumbing, Furniture, and WiFi.
            </span>
          </p>
        </div>

        {/* Add Worker Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 border border-gray-200">
              <h3 className="text-2xl font-bold mb-2">Add New Worker</h3>
              <p className="text-gray-600 mb-6">
                Enter worker details below.
              </p>

              <form onSubmit={handleAddWorker} className="space-y-4">
                {/* Worker Name */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Worker Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter worker name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Work Type / Complaint Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                  >
                    {submitting ? "Adding..." : "Add Worker"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WorkersDetail;