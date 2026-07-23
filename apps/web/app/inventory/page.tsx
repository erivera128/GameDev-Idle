'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { WriteCodeAction } from '../write-code-action';
import { SellItemButton } from '../sell-item-button';

type InventoryItem = { id: string; slug: string; name: string; category: string; rarity: string; description: string; quantity: number; lockedQuantity: number; baseSellValue: number; tradable: boolean };
type CurrencyBalance = { cash: number; fans: number; reputation: number };
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(); const [currencies, setCurrencies] = useState<CurrencyBalance>(); const [error, setError] = useState<string>(); const [search, setSearch] = useState(''); const [category, setCategory] = useState('all');
  useEffect(() => { const load = () => { const token = sessionStorage.getItem('accessToken'); if (!token) { setError('Log in to view your inventory.'); return; } const options = { headers: { Authorization: `Bearer ${token}` } }; Promise.all([fetch(`${apiUrl}/inventory`, options), fetch(`${apiUrl}/currencies`, options)]).then(async ([inventory, balance]) => { if (!inventory.ok || !balance.ok) throw new Error('Your session has expired. Please log in again.'); setItems(await inventory.json()); setCurrencies(await balance.json()); }).catch((reason) => setError(reason.message)); }; load(); window.addEventListener('inventory-updated', load); return () => window.removeEventListener('inventory-updated', load); }, []);
  const categories = useMemo(() => ['all', ...new Set((items ?? []).map((item) => item.category))], [items]);
  const visible = (items ?? []).filter((item) => (category === 'all' || item.category === category) && item.name.toLowerCase().includes(search.toLowerCase()));
  return <main className="inventory"><p className="eyebrow">YOUR STUDIO</p><h1>Inventory</h1>{currencies && <div className="currency-bar"><span>Cash <b>{currencies.cash}</b></span><span>Fans <b>{currencies.fans}</b></span><span>Reputation <b>{currencies.reputation}</b></span></div>}<WriteCodeAction /><div className="inventory-controls"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search items" aria-label="Search inventory" />{categories.map((value) => <button key={value} className={category === value ? 'selected' : ''} onClick={() => setCategory(value)}>{value}</button>)}</div>{error && <p className="form-error">{error} <Link href="/login">Log in</Link></p>}{items && <p className="inventory-summary">{items.reduce((total, item) => total + item.quantity, 0)} items across {items.length} stacks</p>}<div className="item-grid">{visible.map((item) => <article className={`item-card rarity-${item.rarity}`} key={item.id}><div><strong>{item.name}</strong><span>{item.rarity}</span></div><p>{item.description}</p><footer><b>×{item.quantity}</b><span>{item.baseSellValue} cash each</span></footer><SellItemButton slug={item.slug} name={item.name} value={item.baseSellValue} disabled={item.lockedQuantity >= item.quantity || !item.tradable} /></article>)}</div></main>;
}
