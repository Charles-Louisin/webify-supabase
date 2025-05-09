'use client';

import { ThemeProvider } from '@/components/ThemeProvider';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  );
} 