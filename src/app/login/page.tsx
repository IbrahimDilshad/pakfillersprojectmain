
'use client';
import { useState, useEffect } from "react";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/context/language-context"
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);


  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
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
            {t({ en: "Enter your email below to login to your account", ur: "اپنے اکاؤنٹ میں لاگ ان کرنے کے لیے نیچے اپنا ای میل درج کریں۔" })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
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
              <div className="flex items-center">
                <Label htmlFor="password">{t({ en: "Password", ur: "پاس ورڈ" })}</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  {t({ en: "Forgot your password?", ur: "اپنا پاس ورڈ بھول گئے؟" })}
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              {t({ en: "Login", ur: "لاگ ان کریں" })}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            {t({ en: "Don't have an account?", ur: "اکاؤنٹ نہیں ہے؟" })}{" "}
            <Link href="/signup" className="underline">
              {t({ en: "Sign up", ur: "سائن اپ" })}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

    