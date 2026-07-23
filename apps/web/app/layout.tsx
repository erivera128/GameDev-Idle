import type { Metadata } from 'next';
import './globals.css';
import { GameNav } from './game-nav';
import { CurrencyHud } from './currency-hud';

export const metadata: Metadata = { title: 'GameDev Idle', description: 'Build your indie game studio.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><GameNav /><CurrencyHud />{children}</body></html>;
}
