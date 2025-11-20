'use client';

import React from 'react';
import { AppointmentsTable } from '@/components/appointments-table'; // Import the AppointmentsTable

const AdminPage = () => {
  const TENANT_ID = 'c1a2b3c4-d5e6-7890-1234-567890abcdef'; // Hardcoded TENANT_ID for now

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <AppointmentsTable tenantId={TENANT_ID} /> {/* Render the AppointmentsTable */}
    </div>
  );
};

export default AdminPage;
