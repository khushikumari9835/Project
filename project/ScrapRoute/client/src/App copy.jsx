import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

// Public pages
import RoleSelection from "./pages/roleselection";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";

// Seller module (nested routes)
import SellerLayout from "./pages/seller/SellerLayout";
import SellerDashboardNew from "./pages/seller/SellerDashboardNew";
import UploadEWaste from "./pages/seller/UploadEWaste";
import MyListings from "./pages/seller/MyListings";
import PickupStatus from "./pages/seller/PickupStatus";
import Profile from "./pages/seller/Profile";

// Vendor module
import VendorLayout from "./pages/vendor/VendorLayout";
import IncomingRequests from "./pages/vendor/IncomingRequests";
import Pickups from "./pages/vendor/Pickups";
import Agents from "./pages/vendor/Agents";

// Field Agent (Option B)
import FieldAgentDashboard from "./pages/fieldagent/FADashboard";

// Admin (keep if you use it)
import AdminDashboard from "./pages/admin/ADashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Unauthorized message page */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ✅ Field Agent - only FIELD_AGENT */}
        <Route
          path="/agent"
          element={
            <RoleProtectedRoute allowedRoles={["FIELD_AGENT"]}>
              <FieldAgentDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/agent/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["FIELD_AGENT"]}>
              <FieldAgentDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* ✅ Vendor - only VENDOR */}
        <Route
          path="/vendor"
          element={
            <RoleProtectedRoute allowedRoles={["VENDOR"]}>
              <VendorLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<IncomingRequests />} />
          <Route path="incoming" element={<IncomingRequests />} />
          <Route path="pickups" element={<Pickups />} />
          <Route path="agents" element={<Agents />} />
        </Route>

        {/* ✅ User/Seller - only USER */}
        <Route
          path="/seller"
          element={
            <RoleProtectedRoute allowedRoles={["USER"]}>
              <SellerLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<SellerDashboardNew />} />
          <Route path="dashboard" element={<SellerDashboardNew />} />

          <Route
            path="upload"
            element={
              <ProtectedRoute>
                <UploadEWaste />
              </ProtectedRoute>
            }
          />
          <Route
            path="listings"
            element={
              <ProtectedRoute>
                <MyListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="pickup-status"
            element={
              <ProtectedRoute>
                <PickupStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin - keep if you really use it (requires ADMIN role) */}
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;