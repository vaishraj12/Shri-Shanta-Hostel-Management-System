
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CategoryManagement = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");

  // ================= LOAD CATEGORIES =================
  const loadCategories = () => {
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ================= ADD CATEGORY =================
  const addCategory = () => {
    if (!newCategory.trim()) {
      alert("Enter category name");
      return;
    }

    fetch("http://localhost:5000/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category_name: newCategory,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Category added");
          setNewCategory("");
          loadCategories();
        } else {
          alert(data.message);
        }
      });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Category Management</h2>

        {/* Add Category */}
        <div className="flex gap-3">
          <Input
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button className="text-white" onClick={addCategory}>Add</Button>
        </div>

        {/* Category List */}
        <div className="bg-white rounded-lg shadow">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left border">Category Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((c, index) => (
                  <tr key={index}>
                    <td className="p-3 border">{c.category_name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 text-center border">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CategoryManagement;

