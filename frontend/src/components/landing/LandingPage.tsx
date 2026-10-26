import { usePriorityAreas } from '@/features/hotspots';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingInsightSection } from './LandingInsightSection';
import { LandingScrollStatement } from './LandingScrollStatement';
import { LandingCoreFeatures } from './LandingCoreFeatures';
import { LandingHowItWorksSection } from './LandingHowItWorksSection';
import { LandingCitizenFeed } from './LandingCitizenFeed';
import { LandingEmergencySection } from './LandingEmergencySection';
import { LandingCtaSection } from './LandingCtaSection';
import { LandingFooter } from './LandingFooter';

export function LandingPage() {
  // Ambil data live klaster titik panas satelit
  const { data: priorityData } = usePriorityAreas();

  const areas = priorityData?.areas || [];

  const totalHotspots =
    priorityData?.areas?.reduce<number | null>(
      (acc, area) => (acc != null && area.hotspotCount != null ? acc + area.hotspotCount : null),
      0
    ) ?? 18;

  const topArea = priorityData?.areas?.[0];
  const highestRiskArea = topArea
    ? topArea.district
      ? `${topArea.name} (${topArea.district})`
      : topArea.regency
      ? `${topArea.name} (${topArea.regency})`
      : topArea.name
    : 'Kecamatan Sintang';

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-orange-500 selection:text-white">
      <LandingNavbar />
      <main>
        {/* 1. Command Center Live Hero with Motion Counter & Leaflet Map Window */}
        <LandingHero
          areas={areas}
          totalHotspots={totalHotspots}
          highestRiskArea={highestRiskArea}
        />

        {/* 2. Problem & Evidence Staggered Insight Section (Ordina LAYOUT-A) */}
        <LandingInsightSection />

        {/* 3. Signature Pinned Scroll-Highlight Statement (GSAP ScrollTrigger) */}
        <LandingScrollStatement />

        {/* 4. Core Interactive Engines (Threat Risk & Zero-Hoax Dispatch) */}
        <LandingCoreFeatures />

        {/* 5. Interactive How It Works Tabbed Showcase with Progress Bar & Previews */}
        <LandingHowItWorksSection />

        {/* 5. Real Citizen Ground Truth Verification Feed */}
        <LandingCitizenFeed />

        {/* 6. 24/7 Crisis Hotline & Evacuation Protocols */}
        <LandingEmergencySection />

        {/* 7. Interactive Mouse Parallax CTA Section with Spring Physics */}
        <LandingCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}

