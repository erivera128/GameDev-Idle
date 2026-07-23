import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'GameDev Idle', description: 'Build your indie game studio.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
