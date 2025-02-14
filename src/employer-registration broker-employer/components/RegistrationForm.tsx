"use client"

import { useState } from "react"
import { Upload, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

const legalForms = ["GmbH", "AG", "GmbH & Co. KG", "GbR", "Einzelunternehmen", "Freiberufler"]

const industries = [
  "Automobilindustrie",
  "Baugewerbe",
  "Dienstleistungen",
  "E-Commerce",
  "Energiewirtschaft",
  "Finanzdienstleistungen",
  "Gesundheitswesen",
  "IT und Telekommunikation",
  "Logistik und Transport",
  "Medien und Unterhaltung",
]

export default function RegistrationForm() {
  const [logo, setLogo] = useState<File | null>(null)

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.size <= 1024 * 1024 && (file.type === "image/png" || file.type === "image/jpeg")) {
      setLogo(file)
    } else {
      alert("Bitte laden Sie ein PNG oder JPG-Bild mit maximal 1MB Größe hoch.")
    }
  }

  const removeLogo = () => {
    setLogo(null)
  }

  return (
    <form className="space-y-8">
      <div className="space-y-6">
        <div>
          <Label htmlFor="logo" className="block text-sm font-medium mb-2">
            Firmenlogo
          </Label>
          <div className="mt-1 flex items-center space-x-6">
            <div className="flex-shrink-0">
              {logo ? (
                <div className="relative inline-block">
                  <img
                    src={URL.createObjectURL(logo) || "/placeholder.svg"}
                    alt="Firmenlogo Vorschau"
                    className="h-24 w-24 rounded-lg object-cover border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-lg hover:bg-destructive/90 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="relative group">
                  <div className="h-24 w-24 rounded-lg border-2 border-dashed border-primary/20 flex items-center justify-center bg-accent hover:bg-accent/70 transition-colors">
                    <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="h-8 w-8 text-primary/60 group-hover:text-primary" />
                      <span className="mt-1 text-xs text-primary/60 group-hover:text-primary">Logo hochladen</span>
                      <input
                        id="logo-upload"
                        name="logo"
                        type="file"
                        className="sr-only"
                        accept=".png,.jpg,.jpeg"
                        onChange={handleLogoUpload}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              <p>PNG oder JPG</p>
              <p>Maximal 1MB</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Firmenname *</Label>
            <Input id="companyName" name="companyName" required className="w-full" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="legalForm">Rechtsform *</Label>
            <Select name="legalForm" required>
              <SelectTrigger>
                <SelectValue placeholder="Bitte wählen" />
              </SelectTrigger>
              <SelectContent>
                {legalForms.map((form) => (
                  <SelectItem key={form} value={form}>
                    {form}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Branche *</Label>
            <Select name="industry" required>
              <SelectTrigger>
                <SelectValue placeholder="Bitte wählen" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeCount">Mitarbeiteranzahl</Label>
            <Input id="employeeCount" name="employeeCount" type="number" min="1" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Ansprechpartner *</Label>
            <Input id="contactPerson" name="contactPerson" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-Mail *</Label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon *</Label>
            <Input id="phone" name="phone" type="tel" required />
          </div>
        </div>

        <Card className="p-4 border-primary/10">
          <h3 className="font-medium mb-4 text-primary">Adresse</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="street">Straße und Hausnummer *</Label>
              <Input id="street" name="street" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">PLZ *</Label>
              <Input id="zipCode" name="zipCode" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Stadt *</Label>
              <Input id="city" name="city" required />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-primary/10">
          <h3 className="font-medium mb-4 text-primary">Sicherheit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="password">Passwort erstellen *</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen *</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent to-accent/50 border-primary/10">
          <h2 className="text-xl font-semibold mb-4 text-primary">Vorteile von VILOCAR</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2">🚀</span>
              <span>Die Zukunft des Leasings – 100 % digital & einfach</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔥</span>
              <span>Maximale Vorteile für Unternehmen</span>
            </li>
            <li className="flex items-start">
              <Check size={20} className="mr-2 text-primary flex-shrink-0" />
              <span>Full-Service-Leasing – von der Bestellung bis zur Rückgabe alles aus einer Hand</span>
            </li>
            <li className="flex items-start">
              <Check size={20} className="mr-2 text-primary flex-shrink-0" />
              <span>Digitaler Vertragsabschluss – kein Papierkram, keine Verzögerungen</span>
            </li>
            <li className="flex items-start">
              <Check size={20} className="mr-2 text-primary flex-shrink-0" />
              <span>Benefit- & Gehaltsumwandlungsportal – einfache Verwaltung von Firmenwagen</span>
            </li>
            <li className="flex items-start">
              <Check size={20} className="mr-2 text-primary flex-shrink-0" />
              <span>Top-Konditionen ohne Verhandlungen – immer der beste Preis, ohne Zeitverlust</span>
            </li>
            <li className="flex items-start">
              <Check size={20} className="mr-2 text-primary flex-shrink-0" />
              <span>Große Auswahl an Marken & Modellen – flexibel für jede Unternehmensgröße</span>
            </li>
            <li className="flex items-start">
              <Check size={20} className="mr-2 text-primary flex-shrink-0" />
              <span>Optimale Arbeitgeber-Attraktivität – begehrte Mitarbeiterbenefits leicht gemacht</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Mit VILOCAR setzen Unternehmen auf die modernste und effizienteste Lösung für Firmenfahrzeuge – zeitgemäß,
            digital & preislich unschlagbar. 🚗💨
          </p>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90">
          Jetzt registrieren
        </Button>
      </div>
    </form>
  )
}

