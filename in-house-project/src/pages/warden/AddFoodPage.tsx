import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface FoodItem {
  id: number;
  food_name: string;
  category_id: number;
  category_name: string;
}

interface Category {
  category_id: number;
  category_name: string;
}

const WardenAddFood: React.FC = () => {
  const { user } = useAuth();

  const [foodsByCategory, setFoodsByCategory] = useState<any>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [newFoodName, setNewFoodName] = useState("");
  const [newFoodCategory, setNewFoodCategory] = useState<number | "">("");
  const [newCategoryName, setNewCategoryName] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState<number | "">("");

  useEffect(() => {
    if (user?.email) {
      fetchCategories();
      fetchFoods();
    }
  }, [user]);

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/food-categories");
    const data = await res.json();
    setCategories(data || []);
  };

  const fetchFoods = async () => {
    const res = await fetch("http://localhost:5000/foods");
    const data = await res.json();

    const grouped: any = {};
    data.forEach((food: FoodItem) => {
      if (!grouped[food.category_name]) grouped[food.category_name] = [];
      grouped[food.category_name].push(food);
    });

    setFoodsByCategory(grouped);
  };

  const addFood = async () => {
    if (!newFoodName.trim() || !newFoodCategory) {
      alert("Enter food name and select a category");
      return;
    }

    const res = await fetch("http://localhost:5000/food", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        food_name: newFoodName,
        category_id: newFoodCategory,
      }),
    });
    const data = await res.json();

    if (data.success) {
      alert("Food added ✅");
      setNewFoodName("");
      setNewFoodCategory("");
      fetchFoods();
    } else {
      alert("Error adding food ❌");
    }
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Enter category name");
      return;
    }

    const res = await fetch("http://localhost:5000/food-category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_name: newCategoryName }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Category added ✅");
      setNewCategoryName("");
      fetchCategories();
    } else {
      alert("Failed to add category ❌");
    }
  };

  const startEdit = (food: FoodItem) => {
    setEditingId(food.id);
    setEditName(food.food_name);
    setEditCategory(food.category_id);
  };

  const saveEdit = async () => {
    const res = await fetch(`http://localhost:5000/food/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        food_name: editName,
        category_id: editCategory,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Food updated ✅");
      setEditingId(null);
      fetchFoods();
    } else {
      alert("Update failed ❌");
    }
  };

  const deleteFood = async (id: number) => {
    if (!confirm("Delete this food?")) return;

    const res = await fetch(`http://localhost:5000/food/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Food deleted 🗑️");
      fetchFoods();
    } else {
      alert("Delete failed ❌");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Add / Manage Food</h1>

      {/* ================= ADD FOOD ================= */}
      <div className="bg-gray-50 p-4 rounded mb-6 max-w-md">
        <h2 className="font-semibold mb-2">Add New Food</h2>

        <input
          type="text"
          placeholder="Food name"
          value={newFoodName}
          onChange={(e) => setNewFoodName(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />

        <select
          value={newFoodCategory}
          onChange={(e) => setNewFoodCategory(Number(e.target.value))}
          className="border p-2 rounded w-full mb-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.category_name}
            </option>
          ))}
        </select>

        <Button className="text-white" onClick={addFood}>Add Food</Button>
      </div>

      {/* ================= ADD CATEGORY ================= */}
      <div className="bg-gray-50 p-4 rounded mb-6 max-w-md">
        <h2 className="font-semibold mb-2">Add New Category</h2>

        <input
          type="text"
          placeholder="Category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />

        <Button className="text-white" onClick={addCategory}>Add Category</Button>
      </div>

      {/* ================= FOOD ITEMS ================= */}
      <div className="mt-6">
        <h2 className="font-semibold mb-3">Food Items by Category</h2>

        {Object.keys(foodsByCategory).map((category) => (
          <div key={category} className="mb-4">
            <h3 className="font-medium mb-2">{category}</h3>

            {foodsByCategory[category].map((food: FoodItem) => (
              <div
                key={food.id}
                className="flex items-center gap-2 mb-2 border p-2 rounded"
              >
                {editingId === food.id ? (
                  <>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border p-1 rounded flex-1"
                    />
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(Number(e.target.value))}
                      className="border p-1 rounded"
                    >
                      {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                    <Button className="text-white" onClick={saveEdit}>Save</Button>
                    <Button className="text-white" onClick={() => setEditingId(null)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">{food.food_name}</span>
                    <Button className="text-white" onClick={() => startEdit(food)}>Edit</Button>
                    <Button className="text-white" onClick={() => deleteFood(food.id)}>Delete</Button>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default WardenAddFood;