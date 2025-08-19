
'use client';
import { useState } from "react";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/context/language-context";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";

export default function SignupPage() {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update the user's profile for display name
      await updateProfile(user, {
        displayName: fullName,
      });

      // We no longer create a document in Firestore for the user role.
      // The role is determined by the email address in the auth context.

      toast({
        title: "Account Created",
        description: "Your account has been successfully created. Please log in.",
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground rounded-full p-3">
              <Logo className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold text-primary">PakFiler</CardTitle>
          <CardDescription className="text-center">
            {t({ en: "Create an account to start filing your taxes", ur: "اپنے ٹیکس فائل کرنے کے لیے ایک اکاؤنٹ بنائیں۔" })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="full-name">{t({ en: "Full Name", ur: "پورا نام" })}</Label>
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
            <Link href="/" className="underline">
              {t({ en: "Log in", ur: "لاگ ان کریں" })}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
