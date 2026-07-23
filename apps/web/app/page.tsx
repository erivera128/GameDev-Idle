import Link from 'next/link';

export default function Home() {
  return <main><p className="eyebrow">GAMEDEV IDLE</p><h1>Your studio starts with one good idea.</h1><p className="intro">Create your developer profile, then begin collecting the tools and talent to ship your first game.</p><p className="actions"><Link href="/register">Create account</Link><Link className="secondary" href="/login">Log in</Link></p><section aria-label="Development status"><span>Foundation</span><strong>In development</strong></section></main>;
}
