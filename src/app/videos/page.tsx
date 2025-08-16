
'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { PlayCircle } from "lucide-react";

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


export default function VideosPage() {
    const { t } = useLanguage();
  return (
    <AppLayout pageTitle={t({ en: "Videos", ur: "ویڈیوز" })}>
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <PlayCircle className="h-8 w-8 text-primary" />
              {t({ en: "Featured Videos", ur: "نمایاں ویڈیوز" })}
            </h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, index) => (
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
      </div>
    </AppLayout>
  );
}
