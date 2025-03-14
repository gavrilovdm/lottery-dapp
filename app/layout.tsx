import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import '@rainbow-me/rainbowkit/styles.css';

export const metadata: Metadata = {
  title: 'Lottery DApp',
  description: 'Decentralized application for participating in a lottery on the Base Sepolia Testnet blockchain',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
