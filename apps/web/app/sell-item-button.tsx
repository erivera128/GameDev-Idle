'use client';

import { useState } from 'react';
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function SellItemButton({ slug, name, value, disabled }: { slug: string; name: string; value: number; disabled: boolean }) {
  const [working, setWorking] = useState(false);
  async function sell() { if (!window.confirm(`Sell one ${name} for ${value} Cash?`)) return; const token = sessionStorage.getItem('accessToken'); if (!token) return; setWorking(true); try { const response = await fetch(`${apiUrl}/inventory/sell`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ itemIdOrSlug: slug, quantity: 1 }) }); if (!response.ok) throw new Error(); window.dispatchEvent(new Event('inventory-updated')); } finally { setWorking(false); } }
  return <button className="sell-button" onClick={sell} disabled={disabled || working}>{working ? 'Selling…' : `Sell 1 · ${value} Cash`}</button>;
}
