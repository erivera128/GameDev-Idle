'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Quest = { slug: string; title: string; description: string; npcName: string; npcRole: string; requirement: { itemName: string; quantity: number }; rewards: { cash: number; fans: number; reputation: number }; status: string; claimable: boolean };
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]); const [error, setError] = useState<string>(); const [message, setMessage] = useState<string>();
  const load = async () => { const token = sessionStorage.getItem('accessToken'); if (!token) { setError('Log in to meet the city contacts.'); return; } const response = await fetch(`${apiUrl}/quests`, { headers: { Authorization: `Bearer ${token}` } }); if (!response.ok) throw new Error('Unable to load quests.'); setQuests(await response.json()); };
  useEffect(() => { load().catch((reason) => setError(reason.message)); }, []);
  const claim = async (slug: string) => { const token = sessionStorage.getItem('accessToken'); if (!token) return; const response = await fetch(`${apiUrl}/quests/${slug}/claim`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); const result = await response.json(); setMessage(response.ok ? `${result.title} completed: +${result.rewards.cash} Cash, +${result.rewards.fans} Fans, +${result.rewards.reputation} Reputation.` : result.message); if (response.ok) load(); };
  return <main className="crafting"><p className="eyebrow">CITY CONTACTS</p><h1>Quests</h1>{error && <p className="form-error">{error} <Link href="/login">Log in</Link></p>}{message && <p className="form-success">{message}</p>}<section className="recipe-grid">{quests.map((quest) => <article key={quest.slug}><p className="eyebrow">{quest.npcName} &middot; {quest.npcRole}</p><h2>{quest.title}</h2><p>{quest.description}</p><small>Bring {quest.requirement.quantity} {quest.requirement.itemName}</small><p className="quest-reward">Reward: {quest.rewards.cash} Cash &middot; {quest.rewards.fans} Fans &middot; {quest.rewards.reputation} Reputation</p>{quest.status === 'completed' ? <small>Completed</small> : <button onClick={() => claim(quest.slug)} disabled={!quest.claimable}>{quest.claimable ? 'Claim reward' : 'Keep working'}</button>}</article>)}</section></main>;
}
