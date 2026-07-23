'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function GameNav() {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => setSignedIn(Boolean(sessionStorage.getItem('accessToken'))), [pathname]);
  const signOut = () => { sessionStorage.removeItem('accessToken'); setSignedIn(false); };
  return <nav className="game-nav" aria-label="Game navigation"><Link href="/">GameDev Idle</Link><span /><Link href="/dashboard">Dashboard</Link><Link href="/inventory">Inventory</Link><Link href="/crafting">Crafting</Link><Link href="/exploration">Explore</Link><Link href="/quests">Quests</Link><Link href="/studio">Studio</Link><Link href="/market">Market</Link><Link href="/projects">Projects</Link>{signedIn ? <Link href="/login" onClick={signOut}>Log out</Link> : <Link href="/login">Log in</Link>}</nav>;
}
