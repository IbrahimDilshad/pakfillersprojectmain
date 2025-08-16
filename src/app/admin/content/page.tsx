
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
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminContentPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const [blogTitle, setBlogTitle] = useState('');
  const [blogDescription, setBlogDescription] = useState('');
  const [blogImage, setBlogImage] = useState('');
  const [blogHint, setBlogHint] = useState('');

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
  
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogDescription || !blogImage || !blogHint) {
        toast({ variant: 'destructive', title: 'All fields are required.' });
        return;
    }
    try {
      await addDoc(collection(db, 'blogPosts'), {
        title: { en: blogTitle, ur: blogTitle },
        description: { en: blogDescription, ur: blogDescription },
        image: blogImage,
        hint: blogHint,
        href: '#', // Placeholder href
        createdAt: serverTimestamp()
      });
      toast({
        title: "Blog Post Created",
        description: "The new blog post has been added.",
      });
      setBlogTitle('');
      setBlogDescription('');
      setBlogImage('');
      setBlogHint('');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error creating post', description: (error as Error).message });
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle || !videoDescription || !videoUrl) {
      toast({ variant: 'destructive', title: 'All fields are required.' });
      return;
    }
    try {
        const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

        await addDoc(collection(db, 'videos'), {
            title: { en: videoTitle, ur: videoTitle },
            description: { en: videoDescription, ur: videoDescription },
            src: embedUrl,
            createdAt: serverTimestamp()
        });
        toast({
            title: "Video Added",
            description: "The new video has been added.",
        });
        setVideoTitle('');
        setVideoDescription('');
        setVideoUrl('');
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error adding video', description: (error as Error).message });
    }
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
                 <div className="space-y-2">
                  <Label htmlFor="blog-hint">{t({ en: "Image AI Hint", ur: "تصویر کا اشارہ" })}</Label>
                  <Input id="blog-hint" value={blogHint} onChange={(e) => setBlogHint(e.target.value)} placeholder={t({ en: "e.g., 'tax guide'", ur: "مثلاً 'ٹیکس گائیڈ'" })} required />
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
