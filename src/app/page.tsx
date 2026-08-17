import HeroSection from '@/components/hero-section-2'
import FeaturesThree from '@/components/features-3'
import FeaturesFour from '@/components/features-4'
import Content from '@/components/content-2'
import FeaturesFive from '@/components/features-5'
import FAQs from '@/components/faqs-1'
import CallToAction from '@/components/call-to-action-2'
import Footer from '@/components/footer-2'

// Composes Tailark OSS Dusk sources installed through @tailark-oss/dusk-landing-2
// and @tailark-oss/dusk-features-5. See docs/TAILARK.md for provenance.
export default function Home() {
    return (<main lang="en" className="overflow-hidden bg-background text-foreground">
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Skip to content</a>
            <HeroSection />
            <div id="main-content"><FeaturesThree /><Content /><FeaturesFour /><FeaturesFive /><FAQs /><CallToAction /></div>
            <Footer />
        </main>)
}
