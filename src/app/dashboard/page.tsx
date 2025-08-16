
'use client';
import Link from "next/link"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowRight, PlayCircle, BookOpen, Calculator, FileQuestion, Landmark, Users, Building, FileUp, Tv, Rss, CreditCard, User } from "lucide-react"
import { useLanguage } from "@/context/language-context";
import Image from "next/image";

const services = [
  { href: "/gst-registration", title: { en: "GST Registration", ur: "جی ایس ٹی رجسٹریشن" }, icon: Landmark },
  { href: "/family-tax-filing", title: { en: "Family Tax Filing", ur: "فیملی ٹیکس فائلنگ" }, icon: Users },
  { href: "/ntn-registration", title: { en: "NTN Registration", ur: "این ٹی این رجسٹریشن" }, icon: FileUp },
  { href: "/iris-profile", title: { en: "IRIS Profile", ur: "IRIS پروفائل" }, icon: User },
  { href: "/business-incorporation", title: { en: "Business Incorporation", ur: "کاروبار کی شمولیت" }, icon: Building },
  { href: "/services", title: { en: "Service Charges", ur: "سروس چارجز" }, icon: CreditCard },
  { href: "/salary-tax-calculator", title: { en: "Salary Tax Calculator", ur: "تنخواہ ٹیکس کیلکولیٹر" }, icon: Calculator },
  { href: "/faqs", title: { en: "FAQs", ur: "اکثر پوچھے گئے سوالات" }, icon: FileQuestion },
  { href: "/blog", title: { en: "Blog & Updates", ur: "بلاگ اور اپڈیٹس" }, icon: Rss },
  { href: "/videos", title: { en: "Videos", ur: "ویڈیوز" }, icon: Tv },
];


const videos = [
  {
    title: { en: "How to File Your Income Tax Return", ur: "انکم ٹیکس ریٹرن فائل کرنے کا طریقہ" },
    description: { en: "A step-by-step guide to filing your income tax return online through PakFiler.", ur: "پاک فائلر کے ذریعے اپنا انکم ٹیکس ریٹرن آن لائن فائل کرنے کے لیے مرحلہ وار گائیڈ۔" },
    src: "https://www.youtube.com/embed/gD8jQd6I1gQ",
  },
  {
    title: { en: "Understanding Sales Tax in Pakistan", ur: "پاکستان میں سیلز ٹیکس کو سمجھنا" },
    description: { en: "An overview of the sales tax system and how it applies to your business.", ur: "سیلز ٹیکس کے نظام کا ایک جائزہ اور یہ آپ کے کاروبار پر کیسے لاگو ہوتا ہے۔" },
    src: "https://www.youtube.com/embed/RAu3c0Gj9pA",
  },
  {
    title: { en: "Wealth Statement Explained", ur: "دولت کے بیان کی وضاحت" },
    description: { en: "Learn why the wealth statement is important and how to fill it out correctly.", ur: "جانیں کہ دولت کا بیان کیوں ضروری ہے اور اسے صحیح طریقے سے کیسے پُر کیا جائے۔" },
    src: "https://www.youtube.com/embed/5Uu7Y_mJz-8",
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
];

export default function DashboardPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Dashboard", ur: "ڈیش بورڈ" })}>
      <div className="space-y-12">
        <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 text-center">
            {services.map((service) => (
                <Link href={service.href} key={service.href} className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="text-primary p-4 rounded-full mb-2">
                        <service.icon className="h-8 w-8" />
                    </div>
                    <span className="text-sm font-medium text-foreground text-center">{t(service.title)}</span>
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
