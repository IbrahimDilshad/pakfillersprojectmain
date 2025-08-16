
'use client';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText } from "lucide-react"
import { useLanguage } from "@/context/language-context";

export default function SignupPage() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground rounded-full p-3">
              <FileText className="h-8 w-8" />
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
                <Input id="full-name" placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t({ en: "Email", ur: "ای میل" })}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t({ en: "Password", ur: "پاس ورڈ" })}</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
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
