import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { getUser, getRole } from "../utils/role";

/**
 * Usage:
 * <RoleProtectedRoute allowedRoles={["VENDOR"]}><VendorLayout /></RoleProtectedRoute>
 * <RoleProtectedRoute allowedRoles={["FIELD_AGENT"]}><FADashboard /></RoleProtectedRoute>
 * <RoleProtectedRoute allowedRoles={["USER"]}><SellerLayout /></RoleProtectedRoute>
 */
export default function RoleProtectedRoute({ allowedRoles = [], children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Prefer AuthContext user, fallback to localStorage
  const u = user || getUser();
  const currentRole = getRole(); // returns USER / VENDOR / FIELD_AGENT / ADMIN

  // Not logged in -> go to login
  if (!u) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // No roles configured -> allow by default
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    return children;
  }

  // Normalize allowed roles to uppercase (matches getRole())
  const allowed = allowedRoles.map((r) => String(r).toUpperCase());

  // Role mismatch -> unauthorized message page
  if (!allowed.includes(currentRole)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{
          from: location.pathname,
          role: currentRole,
          allowedRoles: allowed,
        }}
      />
    );
  }

  return children;
}
