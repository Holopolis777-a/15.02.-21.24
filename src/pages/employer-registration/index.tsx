import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { addDoc, collection, doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db, storage } from '../../lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Upload, X, Check } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card } from '../../components/ui/card';
import { useToast } from '../../components/ui/use-toast';

const legalForms = ["GmbH", "AG", "GmbH & Co. KG", "GbR", "Einzelunternehmen", "Freiberufler"];

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
];

const EmployerRegistration = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailPrefilled, setIsEmailPrefilled] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [legalForm, setLegalForm] = useState('');
  const [industry, setIndustry] = useState('');
  const [employeeCount, setEmployeeCount] = useState<number>(0);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 1024 * 1024 && (file.type === "image/png" || file.type === "image/jpeg")) {
      setLogo(file);
    } else {
      toast({
        title: "Fehler beim Logo-Upload",
        description: "Bitte laden Sie ein PNG oder JPG-Bild mit maximal 1MB Größe hoch.",
        variant: "destructive"
      });
    }
  };

  const removeLogo = () => {
    setLogo(null);
  };

  const brokerId = searchParams.get('brokerId');
  const inviteId = searchParams.get('inviteId');

  useEffect(() => {
    const validateInvite = async () => {
      if (!inviteId || !brokerId) {
        setError('Ungültige Einladung');
        return;
      }

      try {
        const verificationRef = doc(db, 'verifications', inviteId);
        const verificationDoc = await getDoc(verificationRef);

        if (!verificationDoc.exists()) {
          setError('Einladung nicht gefunden');
          return;
        }

        const verificationData = verificationDoc.data();
        if (verificationData.verified || verificationData.status !== 'pending') {
          setError('Diese Einladung wurde bereits verwendet oder ist ungültig');
          return;
        }

        if (verificationData.brokerId !== brokerId) {
          setError('Ungültige Broker-Zuordnung');
          return;
        }

        if (verificationData.email) {
          setEmail(verificationData.email);
          setIsEmailPrefilled(true);
        }
      } catch (error) {
        console.error('Error validating invite:', error);
        setError('Fehler beim Validieren der Einladung');
      }
    };

    validateInvite();
  }, [brokerId, inviteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!companyName.trim()) {
      setError('Bitte geben Sie einen Firmennamen ein.');
      return;
    }
    if (!legalForm) {
      setError('Bitte wählen Sie eine Rechtsform aus.');
      return;
    }
    if (!industry) {
      setError('Bitte wählen Sie eine Branche aus.');
      return;
    }
    if (!contactPerson.trim()) {
      setError('Bitte geben Sie einen Ansprechpartner ein.');
      return;
    }
    if (!email.trim()) {
      setError('Bitte geben Sie eine E-Mail-Adresse ein.');
      return;
    }
    if (!phone.trim()) {
      setError('Bitte geben Sie eine Telefonnummer ein.');
      return;
    }
    if (!street.trim()) {
      setError('Bitte geben Sie eine Straße ein.');
      return;
    }
    if (!zipCode.trim()) {
      setError('Bitte geben Sie eine PLZ ein.');
      return;
    }
    if (!city.trim()) {
      setError('Bitte geben Sie eine Stadt ein.');
      return;
    }
    if (!password) {
      setError('Bitte geben Sie ein Passwort ein.');
      return;
    }
    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }
    if (!inviteId || !brokerId) {
      setError('Ungültige Einladungsparameter');
      return;
    }

    try {
      setLoading(true);
      console.log('Starting registration process...');

      const verificationRef = doc(db, 'verifications', inviteId);
      const verificationDoc = await getDoc(verificationRef);

      if (!verificationDoc.exists()) {
        throw new Error('Einladung nicht gefunden');
      }

      const verificationData = verificationDoc.data();
      if (verificationData.verified || verificationData.status !== 'pending') {
        throw new Error('Diese Einladung wurde bereits verwendet oder ist ungültig');
      }

      if (verificationData.brokerId !== brokerId) {
        throw new Error('Ungültige Broker-Zuordnung');
      }

      // Upload logo if exists
      let logoUrl = '';
      if (logo) {
        try {
          const logoRef = ref(storage, `company-logos/${Date.now()}-${logo.name}`);
          await uploadBytes(logoRef, logo);
          logoUrl = await getDownloadURL(logoRef);
          console.log('Logo uploaded successfully:', logoUrl);
        } catch (error) {
          console.error('Error uploading logo:', error);
          toast({
            title: "Warnung",
            description: "Logo konnte nicht hochgeladen werden. Die Registrierung wird trotzdem fortgesetzt.",
            variant: "destructive"
          });
        }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User account created successfully', user.uid);

      await updateDoc(verificationRef, {
        status: 'in_progress',
        userId: user.uid,
        updatedAt: serverTimestamp()
      });

      let companyId: string;
      console.log('Broker ID:', brokerId);
      const companyRef = await addDoc(collection(db, 'companies'), {
        name: companyName,
        status: 'active',
        brokerId: brokerId,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        email: email,
        verificationId: inviteId,
        legalForm: legalForm,
        industry: industry,
        employeeCount: employeeCount || 0,
        street: street,
        zipCode: zipCode,
        city: city,
        phone: phone,
        contactPerson: contactPerson,
        logoUrl: logoUrl // Add the logo URL to company document
      });

      companyId = companyRef.id;

      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        role: 'employer',
        companyId: companyId,
        verificationId: inviteId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        firstName: contactPerson.split(' ')[0],
        lastName: contactPerson.split(' ').slice(1).join(' '),
        street: street,
        houseNumber: '',
        postalCode: zipCode,
        city: city,
        mobileNumber: phone,
        companyName: companyName,
        legalForm: legalForm,
        industry: industry,
        employeeCount: employeeCount || 0,
        isProfileComplete: true,
        brokerId: brokerId
      });

      await updateDoc(doc(db, 'verifications', inviteId), {
        verified: true,
        status: 'completed',
        verifiedAt: serverTimestamp(),
        userId: user.uid,
        companyId: companyId
      });

      // Benutzer ausloggen
      await signOut(auth);

      toast({
        title: "Registrierung erfolgreich",
        description: "Sie wurden erfolgreich registriert - Sie können sich jetzt einloggen"
      });

      // Zur Login-Seite weiterleiten
      navigate('/auth/login');
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Ein unerwarteter Fehler ist aufgetreten.';

      if (error instanceof Error) {
        console.error('Error details:', error.message);

        if (error.message.includes('email-already-in-use')) {
          errorMessage = 'Diese E-Mail-Adresse wird bereits verwendet.';
        } else if (error.message.includes('weak-password')) {
          errorMessage = 'Das Passwort muss mindestens 6 Zeichen lang sein.';
        } else if (error.message.includes('invalid-email')) {
          errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
        } else if (error.message.includes('operation-not-allowed')) {
          errorMessage = 'Die E-Mail/Passwort-Anmeldung ist nicht aktiviert.';
        }

        if (error.message.includes('permission-denied')) {
          errorMessage = 'Keine Berechtigung für diese Operation.';
        } else if (error.message.includes('not-found')) {
          errorMessage = 'Die angeforderte Ressource wurde nicht gefunden.';
        }
      }

      setError(errorMessage);
      setLoading(false);

      toast({
        title: "Registrierung fehlgeschlagen",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-red-600 text-center">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/2 relative">
        <div className="sticky top-0 h-[300px] lg:h-screen w-full">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2149052434.jpg-FUaOmYRmYFnV9XZ1kraIphNWNtdJYK.jpeg"
            alt="Winding mountain road"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60">
            <div className="h-full flex flex-col items-center justify-center p-8">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vilocar-logo-dark-Zq7x4qYJqGveXrY7z1MDfI3fO4dmUz.png"
                alt="VILOCAR Logo"
                className="h-16 md:h-20 mb-6"
              />
              <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
                Willkommen bei VILOCAR
              </h1>
              <p className="text-white/90 mt-4 text-center max-w-lg">
                Mobilität neu gedacht - Registrieren Sie sich jetzt als Arbeitgeber und entdecken Sie die Zukunft des Leasings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-primary mb-8">
              Arbeitgeber Registrierung
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
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
                            src={URL.createObjectURL(logo)}
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
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="legalForm">Rechtsform *</Label>
                    <Select value={legalForm} onValueChange={setLegalForm}>
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
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bitte wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem key={ind} value={ind}>
                            {ind}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeCount">Mitarbeiteranzahl</Label>
                    <Input
                      id="employeeCount"
                      type="number"
                      min="1"
                      value={employeeCount}
                      onChange={(e) => setEmployeeCount(parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Ansprechpartner *</Label>
                    <Input
                      id="contactPerson"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isEmailPrefilled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Card className="p-4 border-primary/10">
                  <h3 className="font-medium mb-4 text-primary">Adresse</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="street">Straße und Hausnummer *</Label>
                      <Input
                        id="street"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">PLZ *</Label>
                      <Input
                        id="zipCode"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Stadt *</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-primary/10">
                  <h3 className="font-medium mb-4 text-primary">Sicherheit</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="password">Passwort erstellen *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Passwort bestätigen *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
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

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="w-full py-4 text-2xl font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 rounded-full shadow-2xl transition-transform duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registrierung wird durchgeführt...
                    </div>
                  ) : 'Jetzt registrieren'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerRegistration;
