import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Intern Workflow Management',
  description: 'Track your daily learning progress',
  keywords: [
    'internship',
    'workflow management',
    'learning progress',
    'Enigma LMS',
    'productivity',
    'task tracking',
    'intern management',
  ],
  authors: [
    {
      name: 'Jution Candra Kirana',
      url: 'https://github.com/jutionck',
    },
  ],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
