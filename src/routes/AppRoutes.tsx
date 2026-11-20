import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute';

// Lazy-loaded page components for on-demand code-splitting
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const RfqListPage = lazy(() => import('../features/rfq/pages/RfqListPage'));
const RfqDetailPage = lazy(() => import('../features/rfq/pages/RfqDetailPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const PageFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-8">
    <LoadingSpinner size="lg" label="Loading page..." />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageFallback />}>
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
          </Route>
        </Route>

        {/* 404 Catch-All Route */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
