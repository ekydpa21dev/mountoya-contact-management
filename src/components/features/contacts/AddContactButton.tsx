import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface AddContactButtonProps {
  label?: string;
}

export function AddContactButton({ label = 'Tambah Kontak' }: AddContactButtonProps) {
  return (
    <Link href="/contacts/new">
      <Button size="lg">
        <Plus className="h-5 w-5 mr-2" />
        {label}
      </Button>
    </Link>
  );
}
