'use client';

import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/routes/ProtectedRoute';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ContactForm } from '@/components/features/contacts/ContactForm';

export default function EditContactPage() {
  const params = useParams();
  const contactId = params.id as string;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ContactForm contactId={contactId} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
