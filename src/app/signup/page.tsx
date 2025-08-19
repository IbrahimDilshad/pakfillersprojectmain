
'use client';
import { useState, useEffect } from "react";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/context/language-context";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";
import { useAuth } from "@/context/auth-context";

export default function SignupPage() {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cnic, setCnic] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSignup = async () => {
    if (!fullName || !email || !password || !mobileNumber || !cnic) {
        toast({
            variant: "destructive",
            title: "Signup Failed",
            description: "All fields are required.",
        });
        return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: fullName,
      });

      // Save additional user info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: fullName,
        email: user.email,
        mobileNumber: mobileNumber,
        cnic: cnic,
        role: 'user', // Default role
      });


      toast({
        title: "Account Created",
        description: "Your account has been successfully created. Please log in.",
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message,
      });
    }
  };

  if (loading || user) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <div className="flex justify-center mb-4">
             <Link href="/" className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground rounded-full p-3">
                <Logo className="h-8 w-8" />
                </div>
            </Link>
          </div>
          <CardTitle className="text-2xl text-center font-bold text-primary">PakFiler</CardTitle>
          <CardDescription className="text-center">
            {t({ en: "Create an account to start filing your taxes", ur: "اپنے ٹیکس فائل کرنے کے لیے ایک اکاؤنٹ بنائیں۔" })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="full-name">{t({ en: "Full Name (as per CNIC)", ur: "پورا نام (شناختی کارڈ کے مطابق)" })}</Label>
                <Input 
                  id="full-name" 
                  placeholder="John Doe" 
                  required 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t({ en: "Email", ur: "ای میل" })}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="mobile-number">{t({ en: "Mobile Number", ur: "موبائل نمبر" })}</Label>
                <Input 
                  id="mobile-number" 
                  type="tel"
                  placeholder="03001234567" 
                  required 
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="cnic">{t({ en: "CNIC", ur: "شناختی کارڈ نمبر" })}</Label>
                <Input 
                  id="cnic" 
                  placeholder="12345-1234567-1" 
                  required 
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t({ en: "Password", ur: "پاس ورڈ" })}</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleSignup} className="w-full">
              {t({ en: "Create account", ur: "اکاؤنٹ بنائیں" })}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            {t({ en: "Already have an account?", ur: "پہلے سے ہی ایک اکاؤنٹ ہے؟" })}{" "}
            <Link href="/login" className="underline">
              {t({ en: "Log in", ur: "لاگ ان کریں" })}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
