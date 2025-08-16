
'use client';
import Link from "next/link"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowRight, LayoutDashboard, FileSignature, FileUp, User, CreditCard, PlayCircle, BookOpen } from "lucide-react"
import { useLanguage } from "@/context/language-context";
import Image from "next/image";

const forms = [
  { id: 'income-tax-return', title: { en: 'Income Tax Return', ur: 'انکم ٹیکس ریٹرن' }, icon: FileText },
  { id: 'sales-tax-return', title: { en: 'Sales Tax Return', ur: 'سیلز ٹیکس ریٹرن' }, icon: FileText },
  { id: 'wealth-statement', title: { en: 'Wealth Statement', ur: 'دولت کا بیان' }, icon: FileText },
  { id: 'withholding-tax-statement', title: { en: 'Withholding Tax', ur: 'ودہولڈنگ ٹیکس' }, icon: FileText },
  { href: "/filing", title: { en: "Tax Filing", ur: "ٹیکس فائلنگ" }, icon: FileSignature },
  { href: "/documents", title: { en: "Documents", ur: "دستاویزات" }, icon: FileUp },
  { href: "/profile", title: { en: "IRIS Profile", ur: "IRIS پروفائل" }, icon: User },
  { href: "/services", title: { en: "Service Charges", ur: "سروس چارجز" }, icon: CreditCard },
];

const blogPosts = [
  {
    title: { en: "Understanding Income Tax in Pakistan", ur: "پاکستان میں انکم ٹیکس کو سمجھنا" },
    description: { en: "A comprehensive guide to the income tax system for individuals and businesses.", ur: "افراد اور کاروبار کے لیے انکم ٹیکس کے نظام کے لیے ایک جامع گائیڈ۔" },
    image: "https://placehold.co/600x400.png",
    hint: "tax guide",
    href: "#"
  },
  {
    title: { en: "How to File Your Sales Tax Return Online", ur: "اپنا سیلز ٹیکس ریٹرن آن لائن کیسے فائل کریں۔" },
    description: { en: "A step-by-step walkthrough of the online filing process for sales tax.", ur: "سیلز ٹیکس کے لیے آن لائن فائلنگ کے عمل کا مرحلہ وار واک تھرو۔" },
    image: "https://placehold.co/600x400.png",
    hint: "online filing",
    href: "#"
  },
  {
    title: { en: "Maximizing Your Tax Deductions", ur: "اپنی ٹیکس کٹوتیوں کو زیادہ سے زیادہ کرنا" },
    description: { en: "Learn about the various deductions you can claim to reduce your tax liability.", ur: "اپنی ٹیکس کی ذمہ داری کو کم کرنے کے لیے آپ مختلف کٹوتیوں کے بارے میں جانیں۔" },
    image: "https://placehold.co/600x400.png",
    hint: "tax deductions",
    href: "#"
  }
];

export default function DashboardPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Dashboard", ur: "ڈیش بورڈ" })}>
      <div className="space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 text-center">
          {forms.map((form) => (
            <Link href={form.id ? `/forms/${form.id}` : form.href!} key={form.id || form.href} className="block hover:bg-accent/50 hover:shadow-lg transition-all rounded-lg">
              <Card className="cursor-pointer h-full">
                <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                  <div className="bg-primary/10 text-primary p-4 rounded-full mb-2">
                      <form.icon className="h-8 w-8" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{t(form.title)}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <section>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6 flex items-center gap-2">
            <PlayCircle className="h-7 w-7 text-primary" />
            {t({ en: "Featured Videos", ur: "نمایاں ویڈیوز" })}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-2">
                <div className="aspect-video">
                  <iframe 
                    className="w-full h-full rounded-md" 
                    src="https://www.youtube.com/embed/example1" 
                    title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-2">
                <div className="aspect-video">
                  <iframe 
                    className="w-full h-full rounded-md" 
                    src="https://www.youtube.com/embed/example2" 
                    title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-2">
                <div className="aspect-video">
                  <iframe 
                    className="w-full h-full rounded-md" 
                    src="https://www.youtube.com/embed/example3" 
                    title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6 flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            {t({ en: "Latest From Our Blog", ur: "ہمارے بلاگ سے تازہ ترین" })}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={post.href}>
                  <Image src={post.image} alt={t(post.title)} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={post.hint} />
                  <CardHeader>
                    <CardTitle>{t(post.title)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2">{t(post.description)}</CardDescription>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button variant="link" className="p-0">
                      {t({ en: "Read More", ur: "مزید پڑھیں" })}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
