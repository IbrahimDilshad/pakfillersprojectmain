
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
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
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useBlogPosts, BlogPost } from '@/hooks/useBlogPosts';
import { useVideos, Video } from '@/hooks/useVideos';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, Pencil, PlusCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


export default function AdminContentPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { posts, loading: postsLoading, setPosts } = useBlogPosts();
  const { videos, loading: videosLoading, setVideos } = useVideos();

  const [isBlogDialogOpen, setBlogDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);

  const [isVideoDialogOpen, setVideoDialogOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Partial<Video> | null>(null);

  const handleEditPost = (post: BlogPost) => {
    setCurrentPost(post);
    setBlogDialogOpen(true);
  };

  const handleAddNewPost = () => {
    setCurrentPost(null);
    setBlogDialogOpen(true);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'blogPosts', postId));
      setPosts(posts.filter(p => p.id !== postId));
      toast({ title: 'Success', description: 'Blog post deleted successfully.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete blog post.' });
    }
  };

  const handleEditVideo = (video: Video) => {
    setCurrentVideo(video);
    setVideoDialogOpen(true);
  };

  const handleAddNewVideo = () => {
    setCurrentVideo(null);
    setVideoDialogOpen(true);
  };

  const handleDeleteVideo = async (videoId: string) => {
     try {
      await deleteDoc(doc(db, 'videos', videoId));
      setVideos(videos.filter(v => v.id !== videoId));
      toast({ title: 'Success', description: 'Video deleted successfully.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete video.' });
    }
  };


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

  return (
    <AppLayout pageTitle={t({ en: "Content Management", ur: "مواد کا انتظام" })}>
      <Tabs defaultValue="blog" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="blog">{t({ en: "Blog Posts", ur: "بلاگ پوسٹس" })}</TabsTrigger>
          <TabsTrigger value="video">{t({ en: "Videos", ur: "ویڈیوز" })}</TabsTrigger>
        </TabsList>
        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                    <CardTitle>{t({ en: "Manage Blog Posts", ur: "بلاگ پوسٹس کا نظم کریں" })}</CardTitle>
                    <CardDescription>{t({ en: "Add, edit, or delete blog posts.", ur: "بلاگ پوسٹس شامل کریں، ترمیم کریں یا حذف کریں۔" })}</CardDescription>
                </div>
                <Button onClick={handleAddNewPost}><PlusCircle className="mr-2"/>{t({en: "Add New Post", ur: "نئی پوسٹ شامل کریں"})}</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {postsLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
              ) : (
                posts.map(post => (
                  <Card key={post.id} className="flex items-center p-4 gap-4">
                    <Image src={post.image} alt={t(post.title)} width={100} height={100} className="rounded-md object-cover w-24 h-24" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{t(post.title)}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{t(post.description)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditPost(post)}><Pencil className="h-4 w-4" /></Button>
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the blog post.
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeletePost(post.id)}>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="video">
           <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>{t({ en: "Manage Videos", ur: "ویڈیوز کا نظم کریں" })}</CardTitle>
                        <CardDescription>{t({ en: "Add, edit, or delete videos.", ur: "ویڈیوز شامل کریں، ترمیم کریں یا حذف کریں۔" })}</CardDescription>
                    </div>
                    <Button onClick={handleAddNewVideo}><PlusCircle className="mr-2" />{t({en: "Add New Video", ur: "نئی ویڈیو شامل کریں"})}</Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
               {videosLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
              ) : (
                videos.map(video => {
                    const videoId = video.src.split('embed/')[1];
                    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
                    return (
                        <Card key={video.id} className="flex items-center p-4 gap-4">
                            <Image src={thumbnailUrl} alt={t(video.title)} width={120} height={90} className="rounded-md object-cover" />
                            <div className="flex-1">
                            <h3 className="font-semibold">{t(video.title)}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{t(video.description)}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={() => handleEditVideo(video)}><Pencil className="h-4 w-4" /></Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the video.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteVideo(video.id)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </Card>
                    );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <BlogEditDialog 
        isOpen={isBlogDialogOpen} 
        setIsOpen={setBlogDialogOpen} 
        post={currentPost} 
        onSave={(updatedPosts) => setPosts(updatedPosts)}
        allPosts={posts}
      />
      <VideoEditDialog 
        isOpen={isVideoDialogOpen}
        setIsOpen={setVideoDialogOpen}
        video={currentVideo}
        onSave={(updatedVideos) => setVideos(updatedVideos)}
        allVideos={videos}
      />
    </AppLayout>
  );
}


// Blog Dialog Component
interface BlogEditDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    post: Partial<BlogPost> | null;
    onSave: (posts: BlogPost[]) => void;
    allPosts: BlogPost[];
}

function BlogEditDialog({ isOpen, setIsOpen, post, onSave, allPosts }: BlogEditDialogProps) {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [hint, setHint] = useState('');
    
    useEffect(() => {
        if (post) {
            setTitle(t(post.title || {en: '', ur: ''}));
            setDescription(t(post.description || {en: '', ur: ''}));
            setImage(post.image || '');
            setHint(post.hint || '');
        } else {
            setTitle('');
            setDescription('');
            setImage('');
            setHint('');
        }
    }, [post, isOpen, t]);

    const handleBlogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !image || !hint) {
            toast({ variant: 'destructive', title: 'All fields are required.' });
            return;
        }
        try {
            if (post?.id) { // Editing existing post
                const postRef = doc(db, 'blogPosts', post.id);
                await updateDoc(postRef, {
                    title: { en: title, ur: title },
                    description: { en: description, ur: description },
                    image: image,
                    hint: hint,
                });
                 onSave(allPosts.map(p => p.id === post.id ? { ...p, title: { en: title, ur: title }, description: { en: description, ur: description }, image, hint } : p));
                toast({ title: "Success", description: "Blog post updated." });
            } else { // Adding new post
                const docRef = await addDoc(collection(db, 'blogPosts'), {
                    title: { en: title, ur: title },
                    description: { en: description, ur: description },
                    image: image,
                    hint: hint,
                    href: '#',
                    createdAt: serverTimestamp()
                });
                onSave([{ id: docRef.id, title: { en: title, ur: title }, description: { en: description, ur: description }, image, hint, createdAt: new Date() }, ...allPosts]);
                toast({ title: "Success", description: "Blog post created." });
            }
            setIsOpen(false);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{post?.id ? t({en: "Edit Blog Post", ur: "بلاگ پوسٹ میں ترمیم کریں"}) : t({en: "Add New Blog Post", ur: "نئی بلاگ پوسٹ شامل کریں"})}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="blog-title">{t({ en: "Title", ur: "عنوان" })}</Label>
                        <Input id="blog-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="blog-description">{t({ en: "Description", ur: "تفصیل" })}</Label>
                        <Textarea id="blog-description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="blog-image">{t({ en: "Image URL", ur: "تصویر کا یو آر ایل" })}</Label>
                        <Input id="blog-image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://placehold.co/600x400.png" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="blog-hint">{t({ en: "Image AI Hint", ur: "تصویر کا اشارہ" })}</Label>
                        <Input id="blog-hint" value={hint} onChange={(e) => setHint(e.target.value)} placeholder="e.g., 'tax guide'" required />
                    </div>
                    <DialogFooter>
                       <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                       </DialogClose>
                        <Button type="submit">{post?.id ? t({en: "Save Changes", ur: "تبدیلیاں محفوظ کریں"}) : t({en: "Add Post", ur: "پوسٹ شامل کریں"})}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


// Video Dialog Component
interface VideoEditDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    video: Partial<Video> | null;
    onSave: (videos: Video[]) => void;
    allVideos: Video[];
}

function VideoEditDialog({ isOpen, setIsOpen, video, onSave, allVideos }: VideoEditDialogProps) {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (video) {
            setTitle(t(video.title || {en: '', ur: ''}));
            setDescription(t(video.description || {en: '', ur: ''}));
            // Convert embed URL back to watch URL for editing
            const videoId = video.src?.split('embed/')[1];
            setUrl(videoId ? `https://www.youtube.com/watch?v=${videoId}` : '');
        } else {
            setTitle('');
            setDescription('');
            setUrl('');
        }
    }, [video, isOpen, t]);

    const handleVideoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !url) {
            toast({ variant: 'destructive', title: 'All fields are required.' });
            return;
        }
        try {
            const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
            if (!videoId) {
                toast({ variant: 'destructive', title: 'Invalid YouTube URL' });
                return;
            }
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            
            if (video?.id) { // Editing
                const videoRef = doc(db, 'videos', video.id);
                await updateDoc(videoRef, {
                    title: { en: title, ur: title },
                    description: { en: description, ur: description },
                    src: embedUrl,
                });
                onSave(allVideos.map(v => v.id === video.id ? { ...v, title: { en: title, ur: title }, description: { en: description, ur: description }, src: embedUrl } : v));
                toast({ title: "Success", description: "Video updated." });
            } else { // Adding
                const docRef = await addDoc(collection(db, 'videos'), {
                    title: { en: title, ur: title },
                    description: { en: description, ur: description },
                    src: embedUrl,
                    createdAt: serverTimestamp()
                });
                onSave([{ id: docRef.id, title: { en: title, ur: title }, description: { en: description, ur: description }, src: embedUrl, createdAt: new Date() }, ...allVideos]);
                toast({ title: "Success", description: "Video added." });
            }
            setIsOpen(false);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{video?.id ? t({en: "Edit Video", ur: "ویڈیو میں ترمیم کریں"}) : t({en: "Add New Video", ur: "نئی ویڈیو شامل کریں"})}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleVideoSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="video-title">{t({ en: "Title", ur: "عنوان" })}</Label>
                        <Input id="video-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="video-description">{t({ en: "Description", ur: "تفصیل" })}</Label>
                        <Textarea id="video-description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="video-url">{t({ en: "YouTube Video URL", ur: "یوٹیوب ویڈیو کا یو آر ایل" })}</Label>
                        <Input id="video-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." required />
                    </div>
                    <DialogFooter>
                         <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                       </DialogClose>
                        <Button type="submit">{video?.id ? t({en: "Save Changes", ur: "تبدیلیاں محفوظ کریں"}) : t({en: "Add Video", ur: "ویڈیو شامل کریں"})}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
