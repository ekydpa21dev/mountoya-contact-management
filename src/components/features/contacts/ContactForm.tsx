'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useContacts } from '@/contexts/ContactsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { validateName, validatePhone, validateEmail, validateFileSize, validateFileType } from '@/utils/validation';
import { fetchAddress } from '@/utils/geocoding';
import { DEFAULT_LOCATION, ERROR_MESSAGES } from '@/constants';

// Dynamic import for LocationPicker to avoid SSR issues with Leaflet
const LocationPicker = dynamic(() => import('@/components/features/contacts/LocationPicker').then((mod) => mod.LocationPicker), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center border rounded-md">
      <LoadingSpinner />
    </div>
  )
});

interface ContactFormProps {
  contactId?: string;
}

export function ContactForm({ contactId }: ContactFormProps) {
  const router = useRouter();
  const { addContact, updateContact, getContact, loading } = useContacts();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [latitude, setLatitude] = useState<number>(DEFAULT_LOCATION.latitude);
  const [longitude, setLongitude] = useState<number>(DEFAULT_LOCATION.longitude);
  const [address, setAddress] = useState('');

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    photo?: string;
  }>({});

  useEffect(() => {
    if (contactId) {
      const contact = getContact(contactId);
      if (contact) {
        setName(contact.name);
        setPhone(contact.phone);
        setEmail(contact.email);
        setPhoto(contact.photo);
        setPhotoPreview(contact.photo);
        setLatitude(contact.location.latitude);
        setLongitude(contact.location.longitude);
        setAddress(contact.location.address?.display_name || '');
      } else {
        router.push('/contacts');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId]);

  const validateForm = () => {
    const newErrors: {
      name?: string;
      phone?: string;
      email?: string;
      photo?: string;
    } = {};

    newErrors.name = validateName(name);
    newErrors.phone = validatePhone(phone);
    newErrors.email = validateEmail(email);

    if (!photo) {
      newErrors.photo = ERROR_MESSAGES.PHOTO_REQUIRED;
    }

    // Remove undefined values
    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key as keyof typeof newErrors] === undefined) {
        delete newErrors[key as keyof typeof newErrors];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeError = validateFileSize(file);
    if (sizeError) {
      setErrors({ ...errors, photo: sizeError });
      return;
    }

    const typeError = validateFileType(file);
    if (typeError) {
      setErrors({ ...errors, photo: typeError });
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPhoto(base64String);
      setPhotoPreview(base64String);
      setErrors({ ...errors, photo: undefined });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhoto('');
    setPhotoPreview('');
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    const addressString = await fetchAddress(lat, lng);
    setAddress(addressString);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const contactData = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        photo,
        location: {
          latitude,
          longitude
        }
      };

      if (contactId) {
        await updateContact(contactId, contactData);
      } else {
        await addContact(contactData);
      }

      router.push('/contacts');
    } catch {
      // Error handled by ContactsContext
    }
  };
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{contactId ? 'Edit Kontak' : 'Tambah Kontak Baru'}</CardTitle>
        <CardDescription>{contactId ? 'Perbarui informasi kontak' : 'Isi form di bawah untuk menambahkan kontak baru'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Foto Profil *</Label>
            {photoPreview ? (
              <div className="relative w-32 h-32 mx-auto">
                <Image src={photoPreview} alt="Preview" fill className="rounded-full object-cover border-4 border-gray-200" />
                <button type="button" onClick={handleRemovePhoto} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-sidebar">
                <label htmlFor="photo-upload" className="cursor-pointer text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Klik untuk upload foto</span>
                  <span className="text-xs text-gray-400 block mt-1">Maks. 1MB</span>
                </label>
                <input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={loading} />
              </div>
            )}
            {errors.photo && <p className="text-sm text-red-500">{errors.photo}</p>}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap *</Label>
            <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon *</Label>
            <Input id="phone" type="tel" placeholder="08123456789" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" placeholder="john@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Address (optional) */}
          <div className="space-y-2">
            <Label htmlFor="address">Alamat (Opsional)</Label>
            <Input id="address" type="text" placeholder="Jl. Contoh No. 123" value={address} onChange={(e) => setAddress(e.target.value)} disabled={loading} />
          </div>

          {/* Location Picker */}
          <div className="space-y-2">
            <Label>Pilih Lokasi di Peta *</Label>
            <p className="text-sm text-gray-500">Klik pada peta untuk memilih lokasi</p>
            <LocationPicker position={[latitude, longitude]} onLocationSelect={handleLocationSelect} />
            <div className="text-xs text-gray-500 mt-2">
              Koordinat: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => router.push('/contacts')} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Menyimpan...
                </>
              ) : contactId ? (
                'Update Kontak'
              ) : (
                'Simpan Kontak'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
