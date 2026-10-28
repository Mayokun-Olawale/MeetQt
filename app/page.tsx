import Link from "next/link";
import { PageContainer, SiteHeader } from "@/components/ui/layout";

export default function HomePage() {
  return <><SiteHeader /><PageContainer><section className="hero"><p className="eyebrow">Meet people. Find your common ground.</p><h1>Life’s better with <em>your people.</em></h1><p className="hero-description">Meet people who share your interests, find your kind of plans, and turn a first hello into something more.</p><div className="actions"><Link className="button" href="/signup">Find your people <span aria-hidden="true">↗</span></Link><Link className="button button-secondary" href="/login">I have an account</Link></div></section><div className="home-note"><p>A little more in common. A little closer together.</p><p>Welcome to MeetQ.</p></div></PageContainer></>;
}
