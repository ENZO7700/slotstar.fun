import { AffiliateFloatingButton } from "@/components/ui/AffiliateComponents";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="landing relative min-h-dvh flex flex-col bg-[var(--landing-bg)] text-[var(--landing-text)]">
      {children}
      <AffiliateFloatingButton />
    </div>
  );
}
