'use client';

import { ProtectedRoute } from '@/components/routes/ProtectedRoute';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ContactsList } from '@/components/features/contacts/ContactsList';
import { AddContactButton } from '@/components/features/contacts/AddContactButton';

export default function ContactsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout action={<AddContactButton />}>
        <ContactsList />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
