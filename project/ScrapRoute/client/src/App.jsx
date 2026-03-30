// client/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

// Public
import RoleSelection from "./pages/roleselection";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";

// Seller/User module
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
<<<<<<< HEAD
import AgentAnalytics from "./pages/vendor/AgentAnalytics";

// Field Agent module
import FieldAgentDashboard from "./pages/fieldagent/FADashboard";

// Admin module
=======

// Field Agent module (Option B)
import FieldAgentDashboard from "./pages/fieldagent/FADashboard";

// Admin module (NEW)
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
=======
        {/* Public */}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

<<<<<<< HEAD
=======
        {/* ✅ Admin ONLY */}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>

<<<<<<< HEAD
=======
        {/* ✅ Field Agent (FIELD_AGENT OR ADMIN) */}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
        <Route
          path="/agent"
          element={
            <RoleProtectedRoute allowedRoles={["FIELD_AGENT", "ADMIN"]}>
              <FieldAgentDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/agent/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["FIELD_AGENT", "ADMIN"]}>
              <FieldAgentDashboard />
            </RoleProtectedRoute>
          }
        />

<<<<<<< HEAD
=======
        {/* ✅ Vendor (VENDOR OR ADMIN) */}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
        <Route
          path="/vendor"
          element={
            <RoleProtectedRoute allowedRoles={["VENDOR", "ADMIN"]}>
              <VendorLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<IncomingRequests />} />
          <Route path="incoming" element={<IncomingRequests />} />
          <Route path="pickups" element={<Pickups />} />
          <Route path="agents" element={<Agents />} />
<<<<<<< HEAD
          <Route path="analytics" element={<AgentAnalytics />} />
        </Route>

=======
        </Route>

        {/* ✅ Seller/User (USER OR ADMIN) */}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
        <Route
          path="/seller"
          element={
            <RoleProtectedRoute allowedRoles={["USER", "ADMIN"]}>
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

<<<<<<< HEAD
=======
        {/* Fallback */}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
