import Link from 'next/link';

export default function Home() {
  return <main><p className="eyebrow">GAMEDEV IDLE</p><h1>Your studio starts with one good idea.</h1><p className="intro">Create your developer profile, then begin collecting the tools and talent to ship your first game.</p><p className="actions"><Link href="/register">Create account</Link><Link className="secondary" href="/login">Log in</Link><Link className="secondary" href="/dashboard">Dashboard</Link><Link className="secondary" href="/crafting">Crafting</Link><Link className="secondary" href="/exploration">Explore</Link><Link className="secondary" href="/quests">Quests</Link></p><section aria-label="Development status"><span>Milestone 4</span><strong>City contacts available</strong></section></main>;
}
