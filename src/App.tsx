
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import Attendance from "./pages/student/Attendance";
import Leave from "./pages/student/Leave";
import Complaints from "./pages/student/Complaints";
import MessMenu from "./pages/student/MessMenu";

// Maintenance Department Pages
import MunicipalDashboard from "./pages/maintenance_department/Dashboard";
import ComplaintsManagement from "./pages/maintenance_department/ComplaintsManagement";
import CategoryManagement from "./pages/maintenance_department/CategoryManagement";
import WorkersDetail from "./pages/maintenance_department/WorkersDetail";

// Warden Pages
import WardenDashboard from "./pages/warden/Dashboard";
import WardenComplaints from "./pages/warden/Complaints";
import WardenMessMenu from "./pages/warden/MessMenu";
import AssignRoom from "./pages/warden/AssignRoom";
import AddFoodPage from "./pages/warden/AddFoodPage";
import WardenAttendance from "./pages/warden/WardenAttendence";
import WardenAttendanceRecords from "./pages/warden/WardenAttendanceRecords ";

// Report Pages
import ReportPage from "./pages/warden/ReportPage";
import ComplaintReport from "./pages/warden/ComplaintReport";
import MessReport from "./pages/warden/MessReport";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddStudent from "./pages/Admin/addstudent";
import UpdatedStudent from "./pages/Admin/UploadStudents";
import AdminAssignWarden from "./pages/Admin/assign";
import AdminLogin from "./pages/Admin/AdminLogin";

const queryClient = new QueryClient();

// ================= PROTECTED ROUTE =================
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRole && user?.role !== allowedRole) {
    switch (user?.role) {
      case "student":
        return <Navigate to="/dashboard" replace />;
      case "warden":
        return <Navigate to="/warden/dashboard" replace />;
      case "maintenance_department":
        return <Navigate to="/municipal/dashboard" replace />;
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

// ================= ROUTES =================
const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ================= STUDENT ================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute allowedRole="student">
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leave"
        element={
          <ProtectedRoute allowedRole="student">
            <Leave />
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaints"
        element={
          <ProtectedRoute allowedRole="student">
            <Complaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mess-menu"
        element={
          <ProtectedRoute allowedRole="student">
            <MessMenu />
          </ProtectedRoute>
        }
      />

      {/* ================= MAINTENANCE ================= */}
      <Route
        path="/municipal/dashboard"
        element={
          <ProtectedRoute allowedRole="maintenance_department">
            <MunicipalDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/municipal/complaints"
        element={
          <ProtectedRoute allowedRole="maintenance_department">
            <ComplaintsManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/municipal/categories"
        element={
          <ProtectedRoute allowedRole="maintenance_department">
            <CategoryManagement />
          </ProtectedRoute>
        }
      />

      {/* ✅ NEW ROUTE ADDED */}
      <Route
        path="/municipal/workers"
        element={
          <ProtectedRoute allowedRole="maintenance_department">
            <WorkersDetail />
          </ProtectedRoute>
        }
      />

      {/* ================= WARDEN ================= */}
      <Route
        path="/warden/dashboard"
        element={
          <ProtectedRoute allowedRole="warden">
            <WardenDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/warden/attendance"
        element={
          <ProtectedRoute allowedRole="warden">
            <WardenAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/warden/attendance-records"
        element={
          <ProtectedRoute allowedRole="warden">
            <WardenAttendanceRecords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/warden/complaints"
        element={
          <ProtectedRoute allowedRole="warden">
            <WardenComplaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/warden/mess-menu"
        element={
          <ProtectedRoute allowedRole="warden">
            <WardenMessMenu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/warden/assignroom"
        element={
          <ProtectedRoute allowedRole="warden">
            <AssignRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/warden/add-food"
        element={
          <ProtectedRoute allowedRole="warden">
            <AddFoodPage />
          </ProtectedRoute>
        }
      />

      {/* ================= REPORTS ================= */}
      <Route
        path="/warden/reports"
        element={
          <ProtectedRoute allowedRole="warden">
            <ReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/warden/reports/complaints"
        element={
          <ProtectedRoute allowedRole="warden">
            <ComplaintReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/warden/reports/mess"
        element={
          <ProtectedRoute allowedRole="warden">
            <MessReport />
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/addstudent"
        element={
          <ProtectedRoute allowedRole="admin">
            <AddStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/upload-students"
        element={
          <ProtectedRoute allowedRole="admin">
            <UpdatedStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/assign"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminAssignWarden />
          </ProtectedRoute>
        }
      />

      {/* ================= NOT FOUND ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// ================= APP ROOT =================
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

