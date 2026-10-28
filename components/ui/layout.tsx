import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import logo from "@/M-removebg-preview.png";

export function SiteHeader({ children }: { children?: ReactNode }) {
  return <header className="site-header"><Link className="brand" href="/" aria-label="MeetQ home"><span className="brand-mark"><Image src={logo} alt="" sizes="300px" /></span><span><span className="brand-caption">A little more in common.</span></span></Link><nav aria-label="Main navigation">{children ?? <><Link href="/login">Sign in</Link><Link className="button button-small" href="/signup">Join MeetQ</Link></>}</nav></header>;
}

export function PageContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <main id="main-content" className={`page-container ${className}`}>{children}</main>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function AuthLayout({ children }: { children: ReactNode }) {
  return <><SiteHeader /><PageContainer className="auth-layout"><aside className="auth-intro"><p className="eyebrow">Good company starts here</p><h2>Your people.<br />Your kind of plans.</h2><p>Shared interests. Easy introductions. A reason to get together.</p><div className="intro-note"><span aria-hidden="true">✳</span><p>A little about you.<br />A lot to connect over.</p></div></aside><Card className="auth-card">{children}</Card></PageContainer><footer className="site-footer">MeetQ · Make room for connection.</footer></>;
}
