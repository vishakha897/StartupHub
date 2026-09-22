import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePlan from './pages/CreatePlan';
import GeneratedPlan from './pages/GeneratedPlan';
import MyPlans from './pages/MyPlans';
import PlanDetails from './pages/PlanDetails';
import EditPlan from './pages/EditPlan';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const withDashboard = (el) => (
  <ProtectedRoute>{el}</ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      {/* Public pages keep the marketing navbar/footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Authenticated app pages get the sidebar layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={withDashboard(<Dashboard />)} />
        <Route path="/plans/new" element={withDashboard(<CreatePlan />)} />
        <Route path="/plans/generated" element={withDashboard(<GeneratedPlan />)} />
        <Route path="/plans" element={withDashboard(<MyPlans />)} />
        <Route path="/plans/:id" element={withDashboard(<PlanDetails />)} />
        <Route path="/plans/:id/edit" element={withDashboard(<EditPlan />)} />
        <Route path="/profile" element={withDashboard(<Profile />)} />
        <Route path="/settings" element={withDashboard(<Settings />)} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
