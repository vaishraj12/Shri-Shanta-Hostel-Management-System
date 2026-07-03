import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

// ------------------ TYPES ------------------
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

// ------------------ UTILS ------------------
export const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const day = date.getDate();
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const monthName = monthNames[date.getMonth()];
  const dayName = dayNames[date.getDay()];
  return `${day}${monthName}${date.getFullYear()} (${dayName})`;
};

// ------------------ COMPONENT ------------------
const WardenMessMenu: React.FC = () => {
  const { user } = useAuth();

  const [foodsByCategory, setFoodsByCategory] = useState<any>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<number[]>([]);
  const [mealType, setMealType] = useState("Breakfast");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [menuData, setMenuData] = useState<any>({});
  const [hostelAssigned, setHostelAssigned] = useState(false);
  const [hostelName, setHostelName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copyFromDate, setCopyFromDate] = useState("");

  // ------------------ INITIAL DATA ------------------
  useEffect(() => {
    if (user?.email) {
      const email = user.email.trim();
      fetchFoods();
      fetchCategories();
      checkHostel(email);
      fetchMenu(email);
    }
  }, [user]);

  // ------------------ FETCH FUNCTIONS ------------------
  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/food-categories");
    const data = await res.json();
    setCategories(data || []);
  };

  const fetchFoods = async () => {
    const res = await fetch("http://localhost:5000/foods");
    const data: FoodItem[] = await res.json();

    const grouped: any = {};
    data.forEach(food => {
      if (!grouped[food.category_name]) grouped[food.category_name] = [];
      grouped[food.category_name].push(food);
    });

    setFoodsByCategory(grouped);
  };

  const checkHostel = async (email: string) => {
    const res = await fetch(`http://localhost:5000/warden/hostel/${email}`);
    const data = await res.json();

    if (data?.hostel_name) {
      setHostelAssigned(true);
      setHostelName(data.hostel_name);
    } else setHostelAssigned(false);
  };

  const fetchMenu = async (email: string) => {
    const res = await fetch(`http://localhost:5000/mess-menu/${email}`);
    const data = await res.json();
    setMenuData(data || {});
  };

  // ------------------ COPY MENU FROM DATE ------------------
  useEffect(() => {
    if (copyFromDate && user?.email) {
      const fetchCopiedMenu = async () => {
        try {
          const res = await fetch(
            `http://localhost:5000/mess-menu/${user.email.trim()}?date=${copyFromDate}&meal_type=${mealType}`
          );
          const data = await res.json();

          if (data?.meals && data.meals[mealType]) {
            const foods: number[] = [];
            Object.values(data.meals[mealType]).forEach((foodList: any) => {
              foodList.forEach((f: any) => foods.push(f.id));
            });
            setSelectedFoods(foods);
          } else setSelectedFoods([]);
        } catch (err) {
          console.error("Error fetching copied menu:", err);
          setSelectedFoods([]);
        }
      };
      fetchCopiedMenu();
    } else {
      setSelectedFoods([]);
    }
  }, [copyFromDate, mealType, user]);

  // ------------------ SAVE MENU ------------------
  const submitMenu = async () => {
    if (!copyFromDate && selectedFoods.length === 0) {
      alert("Select food or choose a date to copy from");
      return;
    }

    const payload: any = {
      email: user.email.trim(),
      menu_date: date,
      meal_type: mealType,
    };

    if (copyFromDate) payload.copy_from_date = copyFromDate;
    if (selectedFoods.length) payload.food_ids = selectedFoods;

    const res = await fetch("http://localhost:5000/mess-menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      alert("Menu saved ✅");
      setSelectedFoods([]);
      setCopyFromDate("");
      fetchMenu(user.email.trim());
    } else alert(`Error saving menu ❌: ${data.message || "Unknown error"}`);
  };

  const toggleFoodSelection = (id: number) => {
    setSelectedFoods(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  // ------------------ RENDER ------------------
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-2">Update Mess Menu</h1>

      {hostelAssigned && (
        <p className="text-sm text-gray-600 mb-4">
          Hostel: <b>{hostelName}</b>
        </p>
      )}

      {/* FOOD GRID */}
      <div className="flex gap-6">
        {/* Categories */}
        <div className="w-1/2">
          <h2 className="font-semibold mb-3">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.keys(foodsByCategory).map(category => (
              <div
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-3 rounded border cursor-pointer text-center 
                  break-words whitespace-normal leading-tight min-h-[70px] flex items-center justify-center
                  ${selectedCategory === category
                    ? "bg-blue-100 border-blue-400"
                    : "bg-white hover:bg-gray-50"
                  }`}
              >
                {category}
              </div>
            ))}
          </div>
        </div>

        {/* Foods */}
        <div className="w-1/2">
          <h2 className="font-semibold mb-3">{selectedCategory || "Select Category"}</h2>
          {selectedCategory &&
            foodsByCategory[selectedCategory]?.map((food: FoodItem) => (
              <div key={food.id} className="flex items-center gap-2 mb-2 border p-2 rounded">
                <input
                  type="checkbox"
                  checked={selectedFoods.includes(food.id)}
                  onChange={() => toggleFoodSelection(food.id)}
                />
                <span className="flex-1">{food.food_name}</span>
              </div>
            ))}
        </div>
      </div>

      {/* MENU SAVE */}
      <div className="mt-6 space-y-4 max-w-lg">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <select
          value={mealType}
          onChange={e => setMealType(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Snacks</option>
          <option>Dinner</option>
        </select>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={!!copyFromDate}
            onChange={(e) => {
              if (!e.target.checked) setCopyFromDate("");
              else setCopyFromDate(date);
            }}
          />
          <span>Select date to copy menu from</span>

          {copyFromDate && (
            <input
              type="date"
              value={copyFromDate}
              onChange={(e) => setCopyFromDate(e.target.value)}
              className="border p-2 rounded"
            />
          )}
        </div>

        <Button className="text-white" onClick={submitMenu} disabled={!hostelAssigned}>
          Save Menu
        </Button>
      </div>

      {/* SAVED MENU DISPLAY (TABULAR) */}
      <div className="mt-10 max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">Saved Menus</h2>
        {Object.keys(menuData).length === 0 ? (
          <p className="text-gray-500">No menu created yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Meal</th>
                  <th className="border p-2">Category</th>
                  <th className="border p-2">Foods</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(menuData).map(([menuDate, menu]: any) =>
                  Object.entries(menu.meals).map(([meal, categories]: any) => {
                    const categoryEntries = Object.entries(categories);
                    return categoryEntries.map(([category, foods]: any, idx) => (
                      <tr key={`${menuDate}-${meal}-${category}`}>
                        {idx === 0 && (
                          <td rowSpan={categoryEntries.length} className="border p-2 text-center">
                            {formatDate(menuDate)}
                          </td>
                        )}
                        {idx === 0 && (
                          <td rowSpan={categoryEntries.length} className="border p-2 text-center">
                            {meal}
                          </td>
                        )}
                        <td className="border p-2">{category}</td>
                        <td className="border p-2">{foods.join(", ")}</td>
                      </tr>
                    ));
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WardenMessMenu;