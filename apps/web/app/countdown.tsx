'use client';

import { useEffect, useState } from 'react';
export function Countdown({ completesAt, durationSeconds }: { completesAt: string; durationSeconds: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const interval = window.setInterval(() => setNow(Date.now()), 250); return () => window.clearInterval(interval); }, []);
  const remaining = Math.max(0, new Date(completesAt).getTime() - now); const seconds = Math.ceil(remaining / 1000); const progress = Math.min(100, Math.max(0, 100 - (remaining / (durationSeconds * 1000)) * 100));
  return <span className="countdown" style={{ '--progress': `${progress}%` } as React.CSSProperties}><b>{seconds ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}` : 'Ready'}</b><small>{seconds ? 'remaining' : 'claim reward'}</small></span>;
}
