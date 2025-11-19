'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { AuthHeader } from '@/components/layouts/AuthHeader';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-muted/50 to-accent/20">
      <AuthHeader />
      <div className="flex min-h-screen items-center justify-center p-4 pt-20">
        <Card className="w-full max-w-2xl">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            {/* Image */}
            <div className="mb-8 w-full max-w-md">
              <Image src="/page-not-found.jpg" alt="Page Not Found" width={400} height={300} className="w-full h-auto rounded-lg" priority />
            </div>

            {/* Text Content */}
            <p className="text-muted-foreground text-center mb-8 max-w-md">Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.</p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <Button className="flex-1" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
