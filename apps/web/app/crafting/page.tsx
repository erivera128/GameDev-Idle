'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Recipe = { slug: string; name: string; description: string; durationSeconds: number; output: { itemName: string; quantity: number }; ingredients: { itemName: string; quantity: number }[] };
type Job = { id: string; recipeName: string; status: string; completesAt: string; outputItemName: string; outputQuantity: number };

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function CraftingPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [now, setNow] = useState(Date.now());

  const load = async () => {
    const token = sessionStorage.getItem('accessToken');
    const recipeResponse = await fetch(`${apiUrl}/crafting/recipes`);
    setRecipes(await recipeResponse.json());
    if (!token) { setError('Log in to start crafting.'); return; }
    const jobsResponse = await fetch(`${apiUrl}/crafting/jobs`, { headers: { Authorization: `Bearer ${token}` } });
    if (jobsResponse.ok) setJobs(await jobsResponse.json());
  };

  useEffect(() => {
    load().catch(() => setError('Unable to load crafting.'));
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const start = async (recipeSlug: string) => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return;
    const response = await fetch(`${apiUrl}/crafting/jobs`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ recipeSlug }) });
    const result = await response.json();
    setMessage(response.ok ? `${result.recipeName} is in progress.` : result.message);
    if (response.ok) load();
  };

  const claim = async (jobId: string) => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return;
    const response = await fetch(`${apiUrl}/crafting/jobs/${jobId}/claim`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    const result = await response.json();
    setMessage(response.ok ? `Claimed ${result.quantity} ${result.itemName}.` : result.message);
    if (response.ok) load();
  };

  return <main className="crafting">
    <p className="eyebrow">WORKSHOP</p><h1>Crafting</h1>
    {error && <p className="form-error">{error} <Link href="/login">Log in</Link></p>}
    {message && <p className="form-success">{message}</p>}
    <section className="recipe-grid">{recipes.map((recipe) => <article key={recipe.slug}>
      <h2>{recipe.name}</h2><p>{recipe.description}</p>
      <small>{recipe.durationSeconds}s &middot; Makes {recipe.output.quantity} {recipe.output.itemName}</small>
      <ul>{recipe.ingredients.map((ingredient) => <li key={ingredient.itemName}>{ingredient.quantity} &times; {ingredient.itemName}</li>)}</ul>
      <button onClick={() => start(recipe.slug)}>Start craft</button>
    </article>)}</section>
    <section className="craft-jobs"><h2>Crafting queue</h2>{jobs.length ? jobs.map((job) => <article key={job.id}>
      <span>{job.recipeName} &rarr; {job.outputQuantity} {job.outputItemName}</span>
      {job.status === 'crafting' && new Date(job.completesAt).getTime() <= now
        ? <button onClick={() => claim(job.id)}>Claim</button>
        : <small>{job.status === 'completed' ? 'Claimed' : `Ready ${new Date(job.completesAt).toLocaleTimeString()}`}</small>}
    </article>) : <p>No active crafts.</p>}</section>
  </main>;
}
