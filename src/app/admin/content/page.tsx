
'use client';
import { useState } from 'react';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/context/auth-context";
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminContentPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [blogTitle, setBlogTitle] = useState('');
  const [blogDescription, setBlogDescription] = useState('');
  const [blogImage, setBlogImage] = useState('');

  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  if (user?.role !== 'admin') {
    return (
      <AppLayout pageTitle={t({ en: "Access Denied", ur: "رسائی مسترد" })}>
        <Card className="m-auto mt-12 max-w-lg text-center">
          <CardHeader>
            <CardTitle>{t({ en: "Access Denied", ur: "رسائی مسترد" })}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t({ en: "You do not have permission to view this page.", ur: "آپ کو یہ صفحہ دیکھنے کی اجازت نہیں ہے۔" })}
            </p>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }
  
  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd save this to a database.
    // For now, we'll just show a toast.
    toast({
      title: "Blog Post Created",
      description: "The new blog post has been added.",
    });
    console.log({ blogTitle, blogDescription, blogImage });
    // Clear form
    setBlogTitle('');
    setBlogDescription('');
    setBlogImage('');
  };

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Video Added",
      description: "The new video has been added.",
    });
    console.log({ videoTitle, videoDescription, videoUrl });
    // Clear form
    setVideoTitle('');
    setVideoDescription('');
    setVideoUrl('');
  };


  return (
    <AppLayout pageTitle={t({ en: "Content Management", ur: "مواد کا انتظام" })}>
      <Tabs defaultValue="blog" className="max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="blog">{t({ en: "New Blog Post", ur: "نئی بلاگ پوسٹ" })}</TabsTrigger>
          <TabsTrigger value="video">{t({ en: "New Video", ur: "نئی ویڈیو" })}</TabsTrigger>
        </TabsList>
        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <CardTitle>{t({ en: "Create a New Blog Post", ur: "ایک نئی بلاگ پوسٹ بنائیں" })}</CardTitle>
              <CardDescription>{t({ en: "Fill in the details below to add a new post to the blog.", ur: "بلاگ میں نئی پوسٹ شامل کرنے کے لیے نیچے دی گئی تفصیلات پر کریں۔" })}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blog-title">{t({ en: "Title", ur: "عنوان" })}</Label>
                  <Input id="blog-title" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} placeholder={t({ en: "Blog post title", ur: "بلاگ پوسٹ کا عنوان" })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blog-description">{t({ en: "Description", ur: "تفصیل" })}</Label>
                  <Textarea id="blog-description" value={blogDescription} onChange={(e) => setBlogDescription(e.target.value)} placeholder={t({ en: "Short description for the blog post.", ur: "بلاگ پوسٹ کے لیے مختصر تفصیل۔" })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blog-image">{t({ en: "Image URL", ur: "تصویر کا یو آر ایل" })}</Label>
                  <Input id="blog-image" value={blogImage} onChange={(e) => setBlogImage(e.target.value)} placeholder="https://placehold.co/600x400.png" required />
                </div>
                <Button type="submit">{t({ en: "Add Blog Post", ur: "بلاگ پوسٹ شامل کریں" })}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="video">
           <Card>
            <CardHeader>
              <CardTitle>{t({ en: "Add a New Video", ur: "ایک نئی ویڈیو شامل کریں" })}</CardTitle>
              <CardDescription>{t({ en: "Fill in the details below to add a new video.", ur: "نئی ویڈیو شامل کرنے کے لیے نیچے دی گئی تفصیلات پر کریں۔" })}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVideoSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video-title">{t({ en: "Title", ur: "عنوان" })}</Label>
                  <Input id="video-title" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder={t({ en: "Video title", ur: "ویڈیو کا عنوان" })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video-description">{t({ en: "Description", ur: "تفصیل" })}</Label>
                  <Textarea id="video-description" value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)} placeholder={t({ en: "Short description for the video.", ur: "ویڈیو کے لیے مختصر تفصیل۔" })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video-url">{t({ en: "YouTube Video URL", ur: "یوٹیوب ویڈیو کا یو آر ایل" })}</Label>
                  <Input id="video-url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." required />
                </div>
                <Button type="submit">{t({ en: "Add Video", ur: "ویڈیو شامل کریں" })}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
