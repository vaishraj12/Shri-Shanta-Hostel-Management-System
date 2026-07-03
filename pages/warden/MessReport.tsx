import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

interface MessMenu {
  id: number;
  hostel_id: number;
  menu_date: string;
  meal_type: string;
}

export default function MessReport() {
  const [messMenu, setMessMenu] = useState<MessMenu[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snacks: 0,
  });

  useEffect(() => {
    fetchMessMenu();
  }, []);

  const fetchMessMenu = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/reports/messmenu");
      const data: MessMenu[] = await res.json();
      setMessMenu(data);

      // Calculate stats
      const total = data.length;
      const breakfast = data.filter((m) => m.meal_type.toLowerCase() === "breakfast").length;
      const lunch = data.filter((m) => m.meal_type.toLowerCase() === "lunch").length;
      const dinner = data.filter((m) => m.meal_type.toLowerCase() === "dinner").length;
      const snacks = data.filter((m) => m.meal_type.toLowerCase() === "snacks").length;

      setStats({ total, breakfast, lunch, dinner, snacks });
    } catch (err) {
      console.error("Error fetching mess menu:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Mess Menu Report</h1>

        {/* Stats Cards */}
        <div className="flex gap-4 mb-6">
          <div className="p-4 bg-green-100 rounded">Total Items: {stats.total}</div>
          <div className="p-4 bg-yellow-100 rounded">Breakfast: {stats.breakfast}</div>
          <div className="p-4 bg-blue-100 rounded">Lunch: {stats.lunch}</div>
          <div className="p-4 bg-purple-100 rounded">Dinner: {stats.dinner}</div>
          <div className="p-4 bg-pink-100 rounded">Snacks: {stats.snacks}</div>
        </div>

        {/* Mess Menu Table */}
        {loading ? (
          <p>Loading mess menu...</p>
        ) : messMenu.length === 0 ? (
          <p>No mess menu items found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Menu Date</th>
                <th className="border px-4 py-2">Meal Type</th>
              </tr>
            </thead>
            <tbody>
              {messMenu.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{item.id}</td>
                  <td className="border px-4 py-2">
                    {new Date(item.menu_date).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">{item.meal_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}