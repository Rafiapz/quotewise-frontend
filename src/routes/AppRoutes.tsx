import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { RfqListPage } from '../features/rfq/pages/RfqListPage';
import { RfqDetailPage } from '../features/rfq/pages/RfqDetailPage';
import { QuotationsPage } from '../features/quotations/pages/QuotationsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/rfqs" replace />} />
        <Route path="/rfqs" element={<RfqListPage />} />
        <Route path="/rfqs/:id" element={<RfqDetailPage />} />
        <Route path="/quotations" element={<QuotationsPage />} />
        <Route path="*" element={<Navigate to="/rfqs" replace />} />
      </Route>
    </Routes>
  );
};
