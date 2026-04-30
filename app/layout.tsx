import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'THRVCLUB',
  description: 'Área de membros THRVCLUB',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">{children}</body>
    </html>
  );
}
