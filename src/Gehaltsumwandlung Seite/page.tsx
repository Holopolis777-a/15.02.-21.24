import { HeroSection } from "@/components/HeroSection"
import { BenefitsSection } from "@/components/BenefitsSection"
import { CalculatorSection } from "@/components/CalculatorSection"
import { VehiclesSection } from "@/components/VehiclesSection"
import { ProcessSection } from "@/components/ProcessSection"
import { CTASection } from "@/components/CTASection"

export default function SalaryConversionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <HeroSection />
      <BenefitsSection />
      <CalculatorSection />
      <VehiclesSection />
      <ProcessSection />
      <CTASection />
    </div>
  )
}

