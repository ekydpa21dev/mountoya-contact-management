'use client';

import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function toast({ title, description, variant }: ToastOptions) {
  if (variant === 'destructive') {
    sonnerToast.error(title || 'Error', {
      description
    });
  } else {
    sonnerToast.success(title || 'Success', {
      description
    });
  }
}

export { toast as sonnerToast } from 'sonner';
