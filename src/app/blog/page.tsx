
'use client';
import Link from "next/link";
import Image from "next/image";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { ArrowRight, BookOpen } from "lucide-react";

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

export default function BlogPage() {
  const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Blog", ur: "بلاگ" })}>
       <div className="space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            {t({ en: "Latest From Our Blog", ur: "ہمارے بلاگ سے تازہ ترین" })}
          </h1>
        </div>
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
      </div>
    </AppLayout>
  );
}
