'use client';

import { ProtectedRoute } from '@/components/routes/ProtectedRoute';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ContactForm } from '@/components/features/contacts/ContactForm';

export default function NewContactPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ContactForm />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
