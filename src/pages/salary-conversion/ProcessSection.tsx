import { useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Mail, Car, FileText, CheckCircle, Bell, Truck, ArrowRight, LucideIcon } from "lucide-react"

interface Step {
  icon: LucideIcon
  title: string
  description: string
  note: string
}

interface TimelineStepProps {
  step: Step
  index: number
  isLast: boolean
}

const steps: Step[] = [
  {
    icon: Mail,
    title: "Mitarbeiter einladen",
    description: "Laden Sie Ihre Mitarbeiter zum Gehaltsumwandlungsportal per Email oder Registrierungslink ein.",
    note: "Bei Registrierungslink müssen Sie diesen freigeben.",
  },
  {
    icon: Car,
    title: "Fahrzeugauswahl",
    description: "Ihre Mitarbeiter suchen sich Ihr Wunschfahrzeug aus und berechnen Ihren Vorteil.",
    note: "Große Auswahl an E-Fahrzeugen verfügbar.",
  },
  {
    icon: FileText,
    title: "Anfrage erhalten",
    description: "Ihr Mitarbeiter schickt Ihnen eine Gehaltsumwandlungsanfrage.",
    note: "Sie sehen alle Kosten, Informationen und Daten.",
  },
  {
    icon: CheckCircle,
    title: "Genehmigung",
    description: "Sie genehmigen die Anfrage.",
    note: "Einfache Überprüfung und Freigabe.",
  },
  {
    icon: Bell,
    title: "Status-Updates",
    description: "Sie werden über jeden Status über Anfrage, Lieferung und mehr informiert.",
    note: "Transparenter Prozess mit regelmäßigen Updates.",
  },
  {
    icon: Truck,
    title: "Kostenlose Lieferung",
    description: "Das Fahrzeug wird KOSTENLOS zu Ihrer Firma oder Ihrem Wunschstandort geliefert.",
    note: "Inklusive Einweisung vor Ort.",
  },
]

const TimelineStep: React.FC<TimelineStepProps> = ({ step, index, isLast }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 },
      }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="flex items-start mb-12 relative"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: inView ? 1 : 0 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center z-10"
      >
        <step.icon className="w-6 h-6 text-white" />
      </motion.div>
      <div className="ml-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
        <p className="text-gray-600 mb-2">{step.description}</p>
        <p className="text-sm text-blue-600">{step.note}</p>
      </div>
      {!isLast && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: inView ? "100%" : 0 }}
          transition={{ duration: 0.5, delay: (index + 1) * 0.2 }}
          className="absolute left-6 top-12 bottom-0 w-0.5 bg-blue-200 -ml-0.5"
        ></motion.div>
      )}
    </motion.div>
  )
}

interface CTAButtonProps {
  onInviteClick: () => void;
}

const CTAButton: React.FC<CTAButtonProps> = ({ onInviteClick }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0, scale: 1 },
        hidden: { opacity: 0, y: 50, scale: 0.8 },
      }}
      transition={{ duration: 0.5, delay: steps.length * 0.2 }}
      className="flex items-start mb-12 relative"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: inView ? 1 : 0 }}
        transition={{ duration: 0.5, delay: steps.length * 0.2 }}
        className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 flex items-center justify-center z-10"
      >
        <ArrowRight className="w-6 h-6 text-white" />
      </motion.div>
      <div className="ml-6">
        <button 
          onClick={onInviteClick}
          className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition duration-300 flex items-center"
        >
          Jetzt Mitarbeiter einladen
          <ArrowRight className="ml-2" size={20} />
        </button>
      </div>
    </motion.div>
  )
}

interface ProcessSectionProps {
  onInviteClick: () => void;
}

export function ProcessSection({ onInviteClick }: ProcessSectionProps) {
  const [animationsEnabled, setAnimationsEnabled] = useState(true) // Default to true since we're not using Next.js env vars

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">So funktioniert's</h2>
        <p className="text-center text-gray-600 mb-12">Der Weg zum E-Firmenwagen in nur wenigen Schritten</p>
        <div className="relative max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <TimelineStep key={index} step={step} index={index} isLast={index === steps.length - 1} />
          ))}
          <CTAButton onInviteClick={onInviteClick} />
        </div>
      </div>
    </section>
  )
}
