import React from "react";
import { useAuth } from "@/context/AuthContext";
// Import your three dashboard components
// We will create these next
import DonorDashboard from "@/pages/DonorDashboard/DonorDashboard";
import NgoDashboard from "@/pages/NgoDashboard/NgoDashboard";
import AdminDashboard from "@/pages/AdminDashboard/AdminDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading user data...</div>;
  }

  // Render the correct dashboard based on user role
  switch (user.role) {
    case "donor":
      return <DonorDashboard />;
    case "ngo":
      return <NgoDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <div>Error: Unknown user role. Please contact support.</div>;
  }
}