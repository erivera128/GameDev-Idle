'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type InventoryItem = { id: string; name: string; category: string; rarity: string; description: string; quantity: number; lockedQuantity: number; baseSellValue: number };
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(); const [error, setError] = useState<string>(); const [search, setSearch] = useState(''); const [category, setCategory] = useState('all');
  useEffect(() => { const token = sessionStorage.getItem('accessToken'); if (!token) { setError('Log in to view your inventory.'); return; } fetch(`${apiUrl}/inventory`, { headers: { Authorization: `Bearer ${token}` } }).then(async (response) => { if (!response.ok) throw new Error('Your session has expired. Please log in again.'); return response.json(); }).then(setItems).catch((reason) => setError(reason.message)); }, []);
  const categories = useMemo(() => ['all', ...new Set((items ?? []).map((item) => item.category))], [items]);
  const visible = (items ?? []).filter((item) => (category === 'all' || item.category === category) && item.name.toLowerCase().includes(search.toLowerCase()));
  return <main className="inventory"><p className="eyebrow">YOUR STUDIO</p><h1>Inventory</h1><div className="inventory-controls"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search items" aria-label="Search inventory" />{categories.map((value) => <button key={value} className={category === value ? 'selected' : ''} onClick={() => setCategory(value)}>{value}</button>)}</div>{error && <p className="form-error">{error} <Link href="/login">Log in</Link></p>}{items && <p className="inventory-summary">{items.reduce((total, item) => total + item.quantity, 0)} items across {items.length} stacks</p>}<div className="item-grid">{visible.map((item) => <article className={`item-card rarity-${item.rarity}`} key={item.id}><div><strong>{item.name}</strong><span>{item.rarity}</span></div><p>{item.description}</p><footer><b>×{item.quantity}</b><span>{item.baseSellValue} cash each</span></footer></article>)}</div></main>;
}
