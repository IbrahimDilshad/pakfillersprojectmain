
'use client';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { PlayCircle } from "lucide-react";
import { useVideos } from "@/hooks/useVideos";
import { Skeleton } from "@/components/ui/skeleton";

export default function VideosPage() {
    const { t } = useLanguage();
    const { videos, loading } = useVideos();

  return (
    <AppLayout pageTitle={t({ en: "Videos", ur: "ویڈیوز" })}>
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <PlayCircle className="h-8 w-8 text-primary" />
              {t({ en: "All Videos", ur: "تمام ویڈیوز" })}
            </h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
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
                videos.map((video) => (
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
                ))
            )}
            {!loading && videos.length === 0 && (
                <p className="text-center text-muted-foreground col-span-full py-16">
                    {t({ en: "No videos have been added yet.", ur: "ابھی تک کوئی ویڈیو شامل نہیں کی گئی ہے۔" })}
                </p>
            )}
          </div>
      </div>
    </AppLayout>
  );
}

    