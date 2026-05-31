import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// Public
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersList from "./pages/admin/UsersList";
import StoresList from "./pages/admin/StoresList";
import AddUser from "./pages/admin/AddUser";
import AddStore from "./pages/admin/AddStore";

// User
import UserDashboard from "./pages/user/UserDashboard";

// Owner
import OwnerDashboard from "./pages/owner/OwnerDashboard";

// Shared
import Settings from "./pages/Settings";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <UsersList />
          </ProtectedRoute>
        } />
        <Route path="/admin/stores" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <StoresList />
          </ProtectedRoute>
        } />
        <Route path="/admin/add-user" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AddUser />
          </ProtectedRoute>
        } />
        <Route path="/admin/add-store" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AddStore />
          </ProtectedRoute>
        } />

        {/* User Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        } />

        {/* Owner Routes */}
        <Route path="/owner" element={
          <ProtectedRoute allowedRoles={["store_owner"]}>
            <OwnerDashboard />
          </ProtectedRoute>
        } />

        {/* Shared Settings */}
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={["admin", "user", "store_owner"]}>
            <Settings />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
