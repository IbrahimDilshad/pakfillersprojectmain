
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

const videos = [
  {
    title: { en: "How to File Your Income Tax Return", ur: "انکم ٹیکس ریٹرن فائل کرنے کا طریقہ" },
    description: { en: "A step-by-step guide to filing your income tax return online through PakFiler.", ur: "پاک فائلر کے ذریعے اپنا انکم ٹیکس ریٹرن آن لائن فائل کرنے کے لیے مرحلہ وار گائیڈ۔" },
    src: "https://www.youtube.com/embed/example1",
  },
  {
    title: { en: "Understanding Sales Tax in Pakistan", ur: "پاکستان میں سیلز ٹیکس کو سمجھنا" },
    description: { en: "An overview of the sales tax system and how it applies to your business.", ur: "سیلز ٹیکس کے نظام کا ایک جائزہ اور یہ آپ کے کاروبار پر کیسے لاگو ہوتا ہے۔" },
    src: "https://www.youtube.com/embed/example2",
  },
  {
    title: { en: "Wealth Statement Explained", ur: "دولت کے بیان کی وضاحت" },
    description: { en: "Learn why the wealth statement is important and how to fill it out correctly.", ur: "جانیں کہ دولت کا بیان کیوں ضروری ہے اور اسے صحیح طریقے سے کیسے پُر کیا جائے۔" },
    src: "https://www.youtube.com/embed/example3",
  },
  {
    title: { en: "Navigating the IRIS Portal", ur: "IRIS پورٹل پر تشریف لے جائیں۔" },
    description: { en: "A complete walkthrough of the FBR's IRIS portal for all your tax needs.", ur: "آپ کی تمام ٹیکس ضروریات کے لیے FBR کے IRIS پورٹل کا مکمل واک تھرو۔" },
    src: "https://www.youtube.com/embed/example4",
  },
  {
    title: { en: "Understanding Your Tax Challan", ur: "اپنے ٹیکس چالان کو سمجھنا" },
    description: { en: "A guide to reading and understanding your tax payment challan.", ur: "اپنے ٹیکس ادائیگی کے چالان کو پڑھنے اور سمجھنے کے لیے ایک گائیڈ۔" },
    src: "https://www.youtube.com/embed/example5",
  },
  {
    title: { en: "How to Respond to an FBR Notice", ur: "FBR نوٹس کا جواب کیسے دیں۔" },
    description: { en: "Learn the correct procedure for responding to a notice from the FBR.", ur: "FBR سے نوٹس کا جواب دینے کا صحیح طریقہ کار جانیں۔" },
    src: "https://www.youtube.com/embed/example6",
  },
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
  },
   {
    title: { en: "The Difference Between Active and Inactive Taxpayer Status", ur: "فعال اور غیر فعال ٹیکس دہندہ کی حیثیت کے درمیان فرق" },
    description: { en: "Understand the implications of your taxpayer status and how to check it.", ur: "اپنے ٹیکس دہندہ کی حیثیت کے مضمرات کو سمجھیں اور اسے کیسے چیک کریں۔" },
    image: "https://placehold.co/600x400.png",
    hint: "taxpayer status",
    href: "#"
  },
  {
    title: { en: "A Guide to Withholding Tax in Pakistan", ur: "پاکستان میں ودہولڈنگ ٹیکس کے لیے ایک گائیڈ" },
    description: { en: "Everything you need to know about withholding tax, its rates, and how to manage it.", ur: "ودہولڈنگ ٹیکس، اس کی شرحوں، اور اسے منظم کرنے کے طریقے کے بارے میں آپ کو جاننے کی ضرورت ہے۔" },
    image: "https://placehold.co/600x400.png",
    hint: "withholding tax",
    href: "#"
  },
  {
    title: { en: "Understanding NTN and How to Register", ur: "NTN کو سمجھنا اور رجسٹر کرنے کا طریقہ" },
    description: { en: "A detailed explanation of the National Tax Number (NTN) and the registration process.", ur: "قومی ٹیکس نمبر (NTN) اور رجسٹریشن کے عمل کی تفصیلی وضاحت۔" },
    image: "https://placehold.co/600x400.png",
    hint: "ntn registration",
    href: "#"
  }
];

export default function DashboardPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Dashboard", ur: "ڈیش بورڈ" })}>
      <div className="space-y-12">
        <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {forms.map((form) => (
                <Link href={form.id ? `/forms/${form.id}` : form.href!} key={form.id || form.href} className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="bg-primary/10 text-primary p-4 rounded-full mb-2">
                        <form.icon className="h-8 w-8" />
                    </div>
                    <span className="text-sm font-medium text-foreground text-center">{t(form.title)}</span>
                </Link>
            ))}
            </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <PlayCircle className="h-7 w-7 text-primary" />
              {t({ en: "Featured Videos", ur: "نمایاں ویڈیوز" })}
            </h2>
            <Link href="/videos">
                <Button variant="outline">
                  {t({ en: "View More", ur: "مزید دیکھیں" })}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.slice(0, 3).map((video, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video">
                  <iframe 
                    className="w-full h-full rounded-t-md" 
                    src={video.src} 
                    title={t(video.title)} 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                </div>
                <CardHeader>
                  <CardTitle>{t(video.title)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2">{t(video.description)}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-primary" />
              {t({ en: "Latest From Our Blog", ur: "ہمارے بلاگ سے تازہ ترین" })}
            </h2>
             <Link href="/blog">
                <Button variant="outline">
                  {t({ en: "View More", ur: "مزید دیکھیں" })}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post, index) => (
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

    