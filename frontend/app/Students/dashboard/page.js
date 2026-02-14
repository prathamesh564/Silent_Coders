"use client";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import Dashboard from "../../components/StudentDashboard";
const StudentDashboardPage = () => {
  const { user } = useAuth();
    return (
        <div>
            <Dashboard user={user} />
        </div>
    );
}

