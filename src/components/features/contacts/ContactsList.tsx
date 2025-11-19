'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useContacts } from '@/contexts/ContactsContext';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Edit, Trash2, Mail, Phone, MapPin, Search } from 'lucide-react';
import { AddContactButton } from './AddContactButton';

const MapView = dynamic(() => import('@/components/features/contacts/MapView').then((mod) => mod.MapView), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] flex items-center justify-center border rounded-md">
      <LoadingSpinner size="sm" />
    </div>
  )
});

export function ContactsList() {
  const { contacts, loading, deleteContact } = useContacts();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [selectedMapContact, setSelectedMapContact] = useState<(typeof contacts)[number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Filter contacts based on debounced search query
  const filteredContacts = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return contacts;

    const query = debouncedSearchQuery.toLowerCase();
    return contacts.filter((contact) => contact.name.toLowerCase().includes(query) || contact.email.toLowerCase().includes(query) || contact.phone.includes(query));
  }, [contacts, debouncedSearchQuery]);

  const handleDeleteClick = (contactId: string) => {
    setContactToDelete(contactId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;

    setDeleting(true);
    try {
      await deleteContact(contactToDelete);
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    } catch {
      // Error handled by context
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setContactToDelete(null);
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const contactToDeleteData = contacts.find((c) => c.id === contactToDelete);

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Daftar Kontak</h1>
            <p className="text-muted-foreground mt-1">Kelola kontak Anda dengan mudah</p>
          </div>
        </div>

        {/* Search Bar */}
        {contacts.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari kontak berdasarkan nama, email, atau telepon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
      </div>

      {/* Contacts Grid */}
      {contacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-6 mb-4">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Kontak</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">Mulai tambahkan kontak baru untuk mengelola daftar kontak Anda</p>
            <AddContactButton label="Tambah Kontak Pertama" />
          </CardContent>
        </Card>
      ) : filteredContacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Tidak Ada Hasil</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">Tidak ada kontak yang cocok dengan pencarian "{searchQuery}"</p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Hapus Pencarian
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="overflow-hidden hover:shadow-lg transition-shadow h-max">
              <CardContent className="p-6 space-y-4">
                {/* Profile Photo */}
                <div className="flex items-center gap-2">
                  <div className="relative w-16 h-16 shrink-0">
                    <Image src={contact.photo} alt={contact.name} fill className="rounded-full object-cover border-2 border-border" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{contact.name}</h3>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a href={`tel:${contact.phone}`} className="text-foreground hover:text-primary">
                      {contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a href={`mailto:${contact.email}`} className="text-foreground hover:text-primary truncate">
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-foreground">{`${contact?.location?.address?.city || contact?.location?.address?.county}, ${contact?.location?.address?.country}`}</span>
                  </div>
                </div>

                {/* Map */}
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMapContact(contact);
                      setMapDialogOpen(true);
                    }}
                    className={`block w-full rounded-md z-0 overflow-hidden border cursor-pointer hover:shadow-sm transition-shadow relative ${
                      mapDialogOpen && selectedMapContact?.id === contact.id ? 'opacity-0 pointer-events-none' : ''
                    }`}
                    aria-label={`Buka peta untuk ${contact.name}`}
                  >
                    <MapView
                      position={[contact.location.latitude, contact.location.longitude]}
                      name={contact.name}
                      height="120px"
                      interactive={false}
                      zoom={15}
                      mapClassName="leaflet-preview"
                      containerClassName="leaflet-preview-container"
                    />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link href={`/contacts/${contact.id}/edit`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button className="flex-1 bg-red-600 text-white" onClick={() => handleDeleteClick(contact.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Kontak</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kontak <span className="font-semibold text-foreground">{contactToDeleteData?.name}</span>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel} disabled={deleting}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleting} className="bg-red-600 text-white">
              {deleting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Menghapus...
                </>
              ) : (
                'Hapus Kontak'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Map Preview Dialog */}
      <Dialog
        open={mapDialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedMapContact(null);
          setMapDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-3xl w-full">
          <DialogHeader>
            <DialogTitle>{selectedMapContact ? `Lokasi: ${selectedMapContact.name}` : 'Lokasi'}</DialogTitle>
            <DialogDescription>{selectedMapContact?.location.address?.display_name}</DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            {selectedMapContact && (
              <MapView
                position={[selectedMapContact.location.latitude, selectedMapContact.location.longitude]}
                name={selectedMapContact.name}
                height="420px"
                interactive={true}
                zoom={16}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMapDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
