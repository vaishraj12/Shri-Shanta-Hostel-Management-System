import React, { useEffect, useState } from "react";
import { Coffee, Sun, Cookie, Moon, UtensilsCrossed, CalendarDays } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const MessMenu: React.FC = () => {

  const { user } = useAuth();
  const [menuData, setMenuData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:5000/mess-menu/student/${user.email}`)
      .then(res => res.json())
      .then(data => {
        setMenuData(data);
        setLoading(false);
      })
      .catch(() => {
        setMenuData({});
        setLoading(false);
      });
  }, [user]);

  // ✅ FIXED LOCAL DATE (IMPORTANT)
  const getLocalDate = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().split("T")[0];
  };

  const todayISO = getLocalDate();

  const sortedDates = Object.keys(menuData)
    .sort()
    .filter(date => date >= todayISO);

  // ✅ SAFE ACCESS
  const todayMenu = menuData[todayISO]?.meals ? menuData[todayISO] : null;

  // DATE FORMAT
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-GB", { weekday: "long" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold mb-1">Mess Menu</h1>
          <p className="text-gray-500">Weekly meal schedule</p>
        </div>

        {/* TODAY MENU */}
        {loading ? (
          <p className="text-gray-500">Loading today's menu...</p>
        ) : todayMenu ? (
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl border border-primary/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                <UtensilsCrossed className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Today's Menu</p>
                <h2 className="text-xl font-bold">
                  {formatDate(todayISO)} ({getDayName(todayISO)})
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MealCard title="Breakfast" icon={<Coffee />} value={todayMenu.meals?.breakfast} />
              <MealCard title="Lunch" icon={<Sun />} value={todayMenu.meals?.lunch} />
              <MealCard title="Snacks" icon={<Cookie />} value={todayMenu.meals?.snacks} />
              <MealCard title="Dinner" icon={<Moon />} value={todayMenu.meals?.dinner} />
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Today menu not available</p>
        )}

        {/* UPCOMING MENU */}
        {!loading && sortedDates.length > 0 && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <h2 className="text-lg font-semibold p-4 border-b flex items-center gap-2">
              <CalendarDays className="w-5 h-5" /> Upcoming Menu
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-4 text-left font-semibold">Date</th>
                    <th className="p-4">Breakfast</th>
                    <th className="p-4">Lunch</th>
                    <th className="p-4">Snacks</th>
                    <th className="p-4">Dinner</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedDates.map(date => {
                    const dayMenu = menuData[date];
                    return (
                      <tr
                        key={date}
                        className={cn(
                          "border-b hover:bg-gray-50 transition",
                          date === todayISO && "bg-blue-50 font-medium"
                        )}
                      >
                        <td className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary font-medium">
                          {formatDate(date)} ({getDayName(date)})
                          {date === todayISO && (
                            <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                              Today
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-sm text-gray-600">
                          {dayMenu.meals?.breakfast?.join(", ") || "—"}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {dayMenu.meals?.lunch?.join(", ") || "—"}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {dayMenu.meals?.snacks?.join(", ") || "—"}
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {dayMenu.meals?.dinner?.join(", ") || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

// MEAL CARD
const MealCard = ({ title, value, icon }: any) => (
  <div className="bg-white rounded-xl p-4 border hover:shadow-md transition">
    <div className="flex items-center gap-2 mb-2 text-blue-600">
      {icon}
      <span className="font-medium">{title}</span>
    </div>
    <p className="text-sm text-gray-700">
      {value?.length > 0 ? value.join(", ") : "Not Updated"}
    </p>
  </div>
);

export default MessMenu;