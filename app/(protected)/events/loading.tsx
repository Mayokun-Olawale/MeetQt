import { PageContainer } from "@/components/ui/layout";

export default function LoadingEvents() {
  return <PageContainer><p className="eyebrow">Find your next plan</p><h1>Events</h1><div className="discovery-loading" role="status"><div className="discovery-loading-card" aria-hidden="true" /><p>Finding upcoming events…</p></div></PageContainer>;
}
