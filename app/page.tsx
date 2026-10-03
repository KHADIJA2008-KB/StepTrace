import { HeroSection } from '@/components/HeroSection'
import { FeaturesSection } from '@/components/FeaturesSection'
import { AboutSection } from '@/components/AboutSection'
import { FAQSection } from '@/components/FAQSection'
import { MarketingHeader } from '@/components/MarketingHeader'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07130f]">
      <MarketingHeader />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <FAQSection />
      <Footer />
    </main>
  )
}
