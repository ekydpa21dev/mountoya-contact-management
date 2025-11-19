'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Contact, ContactsContextType, ContactInput } from '@/types';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { reverseGeocode } from '@/utils/geocoding';

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export function ContactsProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadContacts();
    } else {
      setContacts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadContacts = () => {
    try {
      const storedContacts = localStorage.getItem(`contacts_${user?.id}`);
      if (storedContacts) {
        const parsedContacts = JSON.parse(storedContacts);
        // Convert date strings back to Date objects
        const contactsWithDates = parsedContacts.map((c: Contact) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt)
        }));
        setContacts(contactsWithDates);
      }
    } catch {
      setError('Gagal memuat kontak');
    }
  };

  const saveContacts = (newContacts: Contact[]) => {
    if (user) {
      localStorage.setItem(`contacts_${user.id}`, JSON.stringify(newContacts));
      setContacts(newContacts);
    }
  };

  const addContact = async (contactInput: ContactInput) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch address data from coordinates
      const addressData = await reverseGeocode(contactInput.location.latitude, contactInput.location.longitude);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newContact: Contact = {
        ...contactInput,
        location: {
          ...contactInput.location,
          address: { ...addressData.address, display_name: addressData.display_name || '' }
        },
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedContacts = [...contacts, newContact];
      saveContacts(updatedContacts);

      toast.success('Kontak Berhasil Ditambahkan', {
        description: `${newContact.name} telah ditambahkan ke daftar kontak`
      });
    } catch {
      const errorMessage = 'Gagal menambahkan kontak';
      setError(errorMessage);
      toast.error('Error', {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (id: string, contactInput: ContactInput) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch address data from coordinates
      const addressData = await reverseGeocode(contactInput.location.latitude, contactInput.location.longitude);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const contactIndex = contacts.findIndex((c) => c.id === id);
      if (contactIndex === -1) {
        throw new Error('Kontak tidak ditemukan');
      }

      const updatedContact: Contact = {
        ...contactInput,
        location: {
          ...contactInput.location,
          address: { ...addressData.address, display_name: addressData.display_name || '' }
        },
        id,
        createdAt: contacts[contactIndex].createdAt,
        updatedAt: new Date()
      };

      const updatedContacts = [...contacts];
      updatedContacts[contactIndex] = updatedContact;
      saveContacts(updatedContacts);

      toast.success('Kontak Berhasil Diperbarui', {
        description: `${updatedContact.name} telah diperbarui`
      });
    } catch (err) {
      const errorMessage = 'Gagal memperbarui kontak';
      setError(errorMessage);
      toast.error('Error', {
        description: errorMessage
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const contact = contacts.find((c) => c.id === id);
      const updatedContacts = contacts.filter((c) => c.id !== id);
      saveContacts(updatedContacts);

      toast.success('Kontak Berhasil Dihapus', {
        description: contact ? `${contact.name} telah dihapus` : 'Kontak telah dihapus'
      });
    } catch (err) {
      const errorMessage = 'Gagal menghapus kontak';
      setError(errorMessage);
      toast.error('Error', {
        description: errorMessage
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getContact = (id: string) => {
    return contacts.find((c) => c.id === id);
  };

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        loading,
        error,
        addContact,
        updateContact,
        deleteContact,
        getContact
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
}
