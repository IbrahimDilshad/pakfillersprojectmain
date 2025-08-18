
'use client';
import Link from "next/link"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowRight, PlayCircle, BookOpen, Calculator, FileQuestion, Landmark, Users, Building, FileUp, Tv, Rss, CreditCard, User, FileSignature } from "lucide-react"
import { useLanguage } from "@/context/language-context";
import Image from "next/image";
import { useVideos } from "@/hooks/useVideos";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";

const services = [
  { href: "/personal-tax-filing", title: { en: "Personal Tax Filing", ur: "ذاتی ٹیکس فائلنگ" }, icon: FileSignature },
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

export default function DashboardPage() {
  const { t } = useLanguage();
  const { videos, loading: videosLoading } = useVideos();
  const { posts, loading: postsLoading } = useBlogPosts();

  return (
    <AppLayout pageTitle={t({ en: "Dashboard", ur: "ڈیش بورڈ" })}>
      <div className="space-y-12">
        <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {videosLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <Card key={index}>
                  <Skeleton className="w-full aspect-video rounded-t-md" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6 mt-2" />
                  </CardContent>
                </Card>
              ))
            ) : (
              videos.slice(0, 8).map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
            )))}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {postsLoading ? (
               Array.from({ length: 8 }).map((_, index) => (
                <Card key={index}>
                  <Skeleton className="w-full h-48" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6 mt-2" />
                  </CardContent>
                </Card>
              ))
            ) : (
              posts.slice(0, 8).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={post.href || '#'}>
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
            ))
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
