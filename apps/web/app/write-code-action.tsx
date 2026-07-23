'use client';

import { useState } from 'react';
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function WriteCodeAction() {
  const [message, setMessage] = useState<string>(); const [working, setWorking] = useState(false);
  async function writeCode() { const token = sessionStorage.getItem('accessToken'); if (!token) { setMessage('Log in before writing code.'); return; } setWorking(true); setMessage(undefined); try { const response = await fetch(`${apiUrl}/gathering/write-code`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); const result = await response.json(); if (!response.ok) throw new Error(result.message); setMessage(`+${result.quantity} ${result.item.name}, +${result.cash} Cash${result.fans ? `, +${result.fans} Fans` : ''}.`); window.dispatchEvent(new Event('inventory-updated')); } catch (reason) { setMessage(reason instanceof Error ? reason.message : 'Unable to write code right now.'); } finally { setWorking(false); } }
  return <section className="write-code"><div><p className="eyebrow">FOCUS SESSION</p><h2>Write Code</h2><p>Turn focused work into resources for your studio.</p></div><button onClick={writeCode} disabled={working}>{working ? 'Writing…' : 'Write Code'}</button>{message && <p className="action-message">{message}</p>}</section>;
}
