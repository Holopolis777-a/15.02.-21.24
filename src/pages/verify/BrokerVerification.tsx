import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useToast } from "../../components/ui/use-toast"
import { ArrowRight, Check } from "lucide-react"
import { db } from "../../lib/firebase/config"
import { startVerification, updateVerificationStatus, markVerificationFailed } from "../../services/verificationService"

const advantages = [
  "Attraktive Provisionen für jedes vermittelte Fahrzeug",
  "Flexible und kosteneffiziente Leasinglösungen für Ihre Kunden",
  "Skalierbares Einkommen durch Einladung von Unter-Maklern",
]

const BrokerVerification = () => {
  const [currentAdvantage, setCurrentAdvantage] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { verificationId } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<"loading" | "verifying" | "password" | "success" | "error">("loading")
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [inviteData, setInviteData] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdvantage((prev) => (prev + 1) % advantages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const verifyInvitation = async () => {
      if (!verificationId) {
        setStatus('error');
        setError('Ungültiger Verifizierungslink');
        return;
      }

      try {
        // Check verification document
        const verificationRef = doc(db, 'verifications', verificationId);
        const verificationDoc = await getDoc(verificationRef);

        if (!verificationDoc.exists() || verificationDoc.data().type !== 'broker_invite') {
          setStatus('error');
          setError('Ungültiger Verifizierungslink');
          return;
        }

        const inviteRef = doc(db, 'brokerInvites', verificationId);
        const inviteDoc = await getDoc(inviteRef);

        if (!inviteDoc.exists()) {
          setStatus('error');
          setError('Einladung nicht gefunden');
          return;
        }

        const data = inviteDoc.data();
        setInviteData(data);
        
        if (data.status === 'accepted') {
          setStatus('error');
          setError('Diese Einladung wurde bereits angenommen');
          return;
        }

        setStatus('password');

      } catch (err) {
        console.error('Error verifying invitation:', err);
        setStatus('error');
        setError('Ein Fehler ist aufgetreten');
      }
    };

    verifyInvitation();
  }, [verificationId, navigate]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      return;
    }

    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus('verifying');
      const auth = getAuth();
      
      if (!verificationId) {
        throw new Error('Verification ID is missing');
      }
      
      try {
        // Create user account first
        const userCredential = await createUserWithEmailAndPassword(auth, inviteData.email, password);
        
        // Get broker document first to ensure it exists
        const brokerRef = doc(db, 'brokers', inviteData.email);
        const brokerDoc = await getDoc(brokerRef);
        
        if (!brokerDoc.exists()) {
          throw new Error('Broker document not found');
        }

        const existingBrokerData = brokerDoc.data();
        if (!existingBrokerData.brokerId) {
          throw new Error('Broker ID not found');
        }

        // Create user document with broker role
        const userDoc = {
          email: inviteData.email,
          role: 'broker',
          createdAt: new Date(),
          inviteType: 'broker',
          inviteId: verificationId,
          status: 'active',
          verificationId: verificationId,
          brokerId: existingBrokerData.brokerId // Link to broker ID
        };
        
        // Set user document
        await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
        
        // Create user document first
        await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
        
        // Wait for user document to be properly created and propagated
        let attempts = 0;
        let userDocCheck;
        while (attempts < 5) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          userDocCheck = await getDoc(doc(db, 'users', userCredential.user.uid));
          if (userDocCheck.exists() && userDocCheck.data()?.role === 'broker') {
            break;
          }
          attempts++;
          if (attempts < 5) {
            // Try setting the document again
            await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
          }
        }
        
        if (!userDocCheck?.exists() || userDocCheck.data()?.role !== 'broker') {
          throw new Error('Failed to create user document with broker role');
        }

        // Start verification process after user document is confirmed
        await startVerification(verificationId);

        // Update broker document
        await setDoc(brokerRef, {
          ...existingBrokerData,
          userId: userCredential.user.uid,
          status: 'active',
          inviteStatus: 'accepted'
        }, { merge: true });

        // Update verification status
        await updateVerificationStatus(verificationId, userCredential.user.uid);

        // Update broker invite
        await setDoc(doc(db, 'brokerInvites', verificationId), {
          ...inviteData,
          status: 'accepted',
          acceptedAt: new Date(),
          userId: userCredential.user.uid,
          brokerId: existingBrokerData.brokerId
        }, { merge: true });
      } catch (error: any) {
        console.error('Error in registration process:', error);
        await markVerificationFailed(verificationId!, error.message || 'Unknown error during registration');
        throw error;
      }

      setStatus('success');
      
      // Redirect to broker portal after short delay
      setTimeout(() => {
        const portalUrl = import.meta.env.VITE_BROKER_PORTAL_URL || '/login';
        window.location.href = portalUrl;
      }, 3000);

    } catch (err: any) {
      console.error('Error setting up account:', err);
      
      // If error is email-already-in-use, treat as success since user can still login
      if (err.code === 'auth/email-already-in-use') {
        setStatus('success');
        // Redirect to broker portal after short delay
        setTimeout(() => {
          const portalUrl = import.meta.env.VITE_BROKER_PORTAL_URL || '/login';
          window.location.href = portalUrl;
        }, 3000);
      } else {
        await markVerificationFailed(verificationId!, err.message);
        setStatus('error');
        setError('Ein Fehler ist beim Erstellen Ihres Kontos aufgetreten');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-6xl bg-white bg-opacity-70 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Column - Image and Advantages */}
        <div className="lg:w-1/2 relative">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Design%20ohne%20Titel%20(79)-IqSyabeHD2NZAxAB5AJegTgGc1ijiq.png')`,
              backgroundPosition: "center 20%",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/70 to-indigo-700/70 backdrop-blur-sm" />
          <div className="relative z-10 p-8 lg:p-12 flex flex-col h-full justify-between text-white">
            <div>
              <h1 className="text-4xl font-bold mb-6">Broker bei VILOCAR</h1>
              <p className="text-xl mb-8">Maximale Vorteile & attraktive Provisionen</p>
              <div className="space-y-6">
                {advantages.map((advantage, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-start"
                  >
                    <Check className="mr-2 mt-1 flex-shrink-0" />
                    <span>{advantage}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <p className="mt-8 text-lg font-semibold">
              💡 Fazit: Bauen Sie ein starkes Netzwerk auf, helfen Sie Kunden und profitieren Sie finanziell – eine
              echte Win-Win-Situation! 🚀
            </p>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white">
          {(status === "loading" || status === "verifying") && (
            <div className="text-center">
              <p className="text-gray-600">
                {status === "loading" ? "Einladung wird verifiziert..." : "Konto wird erstellt..."}
              </p>
            </div>
          )}

          {status === "password" && (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Jetzt registrieren</h2>
              <p className="text-gray-600 mb-8">Erstellen Sie Ihr Konto in wenigen Schritten und starten Sie noch heute.</p>

              <form onSubmit={handleSetPassword} className="space-y-6">
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Passwort
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Passwort bestätigen
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1"
                    placeholder="••••••••"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                  {isSubmitting ? (
                    "Registrierung läuft..."
                  ) : (
                    <>
                      Als Broker registrieren
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Bereits registriert?{" "}
                <a
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
                >
                  Hier anmelden
                </a>
              </p>
            </>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="rounded-full bg-green-100 p-3 mx-auto w-fit">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="mt-4 text-gray-600">
                Ihr Konto wurde erfolgreich erstellt. Sie werden in Kürze weitergeleitet...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="rounded-full bg-red-100 p-3 mx-auto w-fit">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="mt-4 text-red-600">
                {error || "Ein unbekannter Fehler ist aufgetreten"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Animated advantage display */}
      <div className="fixed bottom-4 left-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAdvantage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-800"
          >
            {advantages[currentAdvantage]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BrokerVerification;
