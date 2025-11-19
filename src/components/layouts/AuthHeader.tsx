'use client';

import Image from 'next/image';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useRouter } from 'next/navigation';

export function AuthHeader() {
  const router = useRouter();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Image
          src="/logo.svg"
          alt="Manajemen Kontak Logo"
          width={180}
          height={40}
          className="h-8 w-auto dark:brightness-100 dark:invert cursor-pointer"
          priority
          onClick={() => router.push('/')}
        />
        <ThemeToggle />
      </div>
    </header>
  );
}
