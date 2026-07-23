'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

type Mode = 'login' | 'register';
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const isRegistering = mode === 'register';
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(undefined); setMessage(undefined); setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const body = { email: form.get('email'), password: form.get('password'), ...(isRegistering ? { username: form.get('username') } : {}) };
    try {
      const response = await fetch(`${apiUrl}/auth/${mode}`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(Array.isArray(result.message) ? result.message.join(' ') : result.message);
      sessionStorage.setItem('accessToken', result.accessToken);
      router.replace('/dashboard');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to reach the game server.'); }
    finally { setSubmitting(false); }
  }
  return <main className="auth"><p className="eyebrow">GAMEDEV IDLE</p><h1>{isRegistering ? 'Start your studio.' : 'Welcome back.'}</h1><form onSubmit={submit}><label>{isRegistering && <>Studio name<input name="username" minLength={3} maxLength={32} pattern="[A-Za-z0-9_]+" required autoComplete="username" /></>}</label><label>Email<input name="email" type="email" required autoComplete="email" /></label><label>Password<input name="password" type="password" minLength={12} required autoComplete={isRegistering ? 'new-password' : 'current-password'} /></label><button type="submit" disabled={submitting}>{submitting ? 'Working…' : isRegistering ? 'Create account' : 'Log in'}</button></form>{error && <p className="form-error" role="alert">{error}</p>}{message && <p className="form-success">{message}</p>}<p className="auth-switch">{isRegistering ? 'Already building?' : 'New here?'} <Link href={isRegistering ? '/login' : '/register'}>{isRegistering ? 'Log in' : 'Create an account'}</Link></p></main>;
}
