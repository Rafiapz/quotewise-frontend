import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { RfqListPage } from '../features/rfq/pages/RfqListPage';
import { RfqDetailPage } from '../features/rfq/pages/RfqDetailPage';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Authentication Routes (accessible only when NOT logged in) */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route path="/signin" element={<Navigate to="/login" replace />} />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route path="/signup" element={<Navigate to="/register" replace />} />

      {/* Protected Routes (all require authentication, otherwise redirected to /login) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/rfqs" replace />} />
          <Route path="/rfqs" element={<RfqListPage />} />
          <Route path="/rfqs/:id" element={<RfqDetailPage />} />
          <Route path="/quotations" element={<Navigate to="/rfqs" replace />} />
          <Route path="*" element={<Navigate to="/rfqs" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};
