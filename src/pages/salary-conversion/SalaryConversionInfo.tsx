import { useState } from "react"
import { HeroSection } from "./HeroSection"
import { BenefitsSection } from "./BenefitsSection"
import { SalaryCalculator } from "./SalaryCalculator"
import { ProcessSection } from "./ProcessSection"
import { CTASection } from "./CTASection"
import { SalaryInviteModal } from "../../components/SalaryInviteModal"

export default function SalaryConversionInfo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <HeroSection onInviteClick={handleOpenModal} />
      <BenefitsSection />
      <SalaryCalculator />
      <ProcessSection onInviteClick={handleOpenModal} />
      <CTASection onInviteClick={handleOpenModal} />

      <SalaryInviteModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
