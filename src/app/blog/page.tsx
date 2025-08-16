
'use client';
import Link from "next/link";
import Image from "next/image";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { ArrowRight, BookOpen } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPage() {
  const { t } = useLanguage();
  const { posts, loading } = useBlogPosts();

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
          {loading ? (
             Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <Skeleton className="w-full h-48" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mt-2" />
                </CardContent>
                 <div className="p-6 pt-0">
                   <Skeleton className="h-5 w-24" />
                </div>
              </Card>
            ))
          ) : (
            posts.map((post) => (
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
      </div>
    </AppLayout>
  );
}
