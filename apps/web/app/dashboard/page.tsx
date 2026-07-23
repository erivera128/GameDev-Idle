'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Dashboard = { player: { username: string }; currencies: { cash: number; fans: number; reputation: number }; inventoryStacks: number; inventoryItems: number; recentLoot: { itemName: string; quantity: number; cashAwarded: number; fansAwarded: number; occurredAt: string }[] };
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard>(); const [error, setError] = useState<string>();
  useEffect(() => { const token = sessionStorage.getItem('accessToken'); if (!token) { setError('Log in to open your dashboard.'); return; } fetch(`${apiUrl}/dashboard`, { headers: { Authorization: `Bearer ${token}` } }).then(async (response) => { if (!response.ok) throw new Error('Your session has expired. Please log in again.'); setDashboard(await response.json()); }).catch((reason) => setError(reason.message)); }, []);
  if (error) return <main className="dashboard"><h1>Dashboard</h1><p className="form-error">{error} <Link href="/login">Log in</Link></p></main>;
  return <main className="dashboard"><p className="eyebrow">DEVELOPER DASHBOARD</p><h1>{dashboard ? `${dashboard.player.username}'s studio` : 'Loading studio…'}</h1>{dashboard && <><div className="dashboard-stats"><article><span>Cash</span><b>{dashboard.currencies.cash}</b></article><article><span>Fans</span><b>{dashboard.currencies.fans}</b></article><article><span>Reputation</span><b>{dashboard.currencies.reputation}</b></article><article><span>Inventory</span><b>{dashboard.inventoryItems}</b><small>{dashboard.inventoryStacks} stacks</small></article></div><section className="recent-loot"><div><h2>Recent work</h2><Link href="/inventory">Write Code & manage inventory →</Link></div>{dashboard.recentLoot.length ? <ul>{dashboard.recentLoot.map((loot, index) => <li key={`${loot.occurredAt}-${index}`}><b>+{loot.quantity} {loot.itemName}</b><span>+{loot.cashAwarded} Cash{loot.fansAwarded ? ` · +${loot.fansAwarded} Fans` : ''}</span></li>)}</ul> : <p>Your first focused session is waiting.</p>}</section></>}</main>;
}
