import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GearGuard',
  description: 'Enterprise Maintenance Tracker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="app-shell">
          {/* We will check auth here or in a sub-layout */}
          {children}
        </div>
      </body>
    </html>
  );
}
