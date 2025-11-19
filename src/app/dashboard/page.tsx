'use client';

import { ProtectedRoute } from '@/components/routes/ProtectedRoute';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useContacts } from '@/contexts/ContactsContext';
import { AddContactButton } from '@/components/features/contacts/AddContactButton';

export default function DashboardPage() {
  const { user } = useAuth();
  const { contacts } = useContacts();

  return (
    <ProtectedRoute>
      <DashboardLayout action={<AddContactButton />}>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Halo, {user?.name}!</h1>
            <p className="text-muted-foreground mt-1">Selamat datang kembali di aplikasi manajemen kontak.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Kontak</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contacts.length}</div>
                <p className="text-xs text-muted-foreground">Kontak tersimpan</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
