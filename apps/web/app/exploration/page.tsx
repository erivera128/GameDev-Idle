'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Countdown } from '../countdown';

type Location = { slug: string; name: string; description: string; durationSeconds: number; reward: { itemName: string; minQuantity: number; maxQuantity: number } };
type Expedition = { id: string; locationName: string; status: string; completesAt: string; durationSeconds: number; rewardItemName: string; rewardQuantity: number | null };
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function ExplorationPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [now, setNow] = useState(Date.now());
  const load = async () => { const token = sessionStorage.getItem('accessToken'); const locationsResponse = await fetch(`${apiUrl}/exploration/locations`); setLocations(await locationsResponse.json()); if (!token) { setError('Log in to begin an expedition.'); return; } const expeditionsResponse = await fetch(`${apiUrl}/exploration/expeditions`, { headers: { Authorization: `Bearer ${token}` } }); if (expeditionsResponse.ok) setExpeditions(await expeditionsResponse.json()); };
  useEffect(() => { load().catch(() => setError('Unable to load exploration.')); const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const start = async (locationSlug: string) => { const token = sessionStorage.getItem('accessToken'); if (!token) return; const response = await fetch(`${apiUrl}/exploration/expeditions`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ locationSlug }) }); const result = await response.json(); setMessage(response.ok ? `${result.locationName} expedition has begun.` : result.message); if (response.ok) load(); };
  const claim = async (expeditionId: string) => { const token = sessionStorage.getItem('accessToken'); if (!token) return; const response = await fetch(`${apiUrl}/exploration/expeditions/${expeditionId}/claim`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); const result = await response.json(); setMessage(response.ok ? `Found ${result.quantity} ${result.itemName}.` : result.message); if (response.ok) load(); };
  return <main className="crafting"><p className="eyebrow">CITY MAP</p><h1>Exploration</h1>{error && <p className="form-error">{error} <Link href="/login">Log in</Link></p>}{message && <p className="form-success">{message}</p>}<section className="recipe-grid">{locations.map((location) => <article key={location.slug}><h2>{location.name}</h2><p>{location.description}</p><small>{location.durationSeconds}s &middot; Finds {location.reward.minQuantity}-{location.reward.maxQuantity} {location.reward.itemName}</small><button onClick={() => start(location.slug)}>Start expedition</button></article>)}</section><section className="craft-jobs"><h2>Expedition log</h2>{expeditions.length ? expeditions.map((expedition) => <article key={expedition.id}><span>{expedition.locationName} &rarr; {expedition.rewardItemName}</span>{expedition.status === 'exploring' && new Date(expedition.completesAt).getTime() <= now ? <button onClick={() => claim(expedition.id)}>Claim</button> : expedition.status === 'completed' ? <small>Found {expedition.rewardQuantity} {expedition.rewardItemName}</small> : <Countdown completesAt={expedition.completesAt} durationSeconds={expedition.durationSeconds} />}</article>) : <p>No expeditions yet.</p>}</section></main>;
}
