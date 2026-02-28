import { PricingPlans } from "@/components/pricing-plans";
import { FeaturesGrid } from "./components/features-grid";
import { FAQSection } from "./components/faq-section";

// Import data
import featuresData from "./data/features.json";
import faqsData from "./data/faqs.json";
import PageConponentsAdmin from "@/components/page-components";

export default function PricingPage() {
  return (
    <PageConponentsAdmin
      breadcrumb={[
        {
          label: "Pricing",
          href: "/pricing",
        },
      ]}
      title="Pricing"
      description="Manage your pricing"
    >
      <div className="px-4 lg:px-6">
        {/* Pricing Cards */}
        <section className="pb-12" id="pricing">
          <PricingPlans mode="pricing" />
        </section>

        {/* Features Section */}
        <FeaturesGrid features={featuresData} />

        {/* FAQ Section */}
        <FAQSection faqs={faqsData} />
      </div>
    </PageConponentsAdmin>
  );
}
