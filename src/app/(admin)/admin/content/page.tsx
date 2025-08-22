
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
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
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { useBlogPosts, BlogPost } from '@/hooks/useBlogPosts';
import { useVideos, Video } from '@/hooks/useVideos';
import { useFaqs, Faq } from '@/hooks/useFaqs';
import { useServices, Service } from '@/hooks/useServices';
import { useFormPrices, FormPrice } from '@/hooks/useFormPrices';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, Pencil, PlusCircle, DollarSign } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

const allForms = [
    { id: 'personal_tax_filing', name: { en: 'Personal Tax Filing', ur: 'ذاتی ٹیکس فائلنگ' } },
    { id: 'sole_proprietor', name: { en: 'Sole Proprietor Registration', ur: 'واحد ملکیت رجسٹریشن' } },
    { id: 'aop_partnership', name: { en: 'AOP/Partnership Registration', ur: 'اے او پی/شراکت داری کی رجسٹریشن' } },
    { id: 'add_business_to_ntn', name: { en: 'Add Business to NTN', ur: 'این ٹی این میں کاروبار شامل کریں' } },
    { id: 'remove_business_from_ntn', name: { en: 'Remove Business from NTN', ur: 'این ٹی این سے کاروبار ہٹائیں' } },
    { id: 'password_recovery', name: { en: 'Password Recovery Assistance', ur: 'پاس ورڈ کی بازیابی میں معاونت' } },
    { id: 'gst_registration', name: { en: 'GST Registration', ur: 'جی ایس ٹی رجسٹریشن' } },
    { id: 'iris_profile_update', name: { en: 'IRIS Profile Update', ur: 'آئرس پروفائل اپ ڈیٹ' } },
    { id: 'ntn_registration', name: { en: 'NTN Registration', ur: 'این ٹی این رجسٹریشن' } },
    { id: 'ntn_recovery', name: { en: 'NTN Recovery', ur: 'این ٹی این کی بازیابی' } },
];


export default function AdminContentPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const { posts, loading: postsLoading, setPosts } = useBlogPosts();
  const { videos, loading: videosLoading, setVideos } = useVideos();
  const { faqs, loading: faqsLoading, setFaqs } = useFaqs();
  const { services, loading: servicesLoading, setServices } = useServices();
  const { formPrices, loading: formPricesLoading, setFormPrices } = useFormPrices();


  const [isBlogDialogOpen, setBlogDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);

  const [isVideoDialogOpen, setVideoDialogOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Partial<Video> | null>(null);
  
  const [isFaqDialogOpen, setFaqDialogOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState<Partial<Faq> | null>(null);

  const [isServiceDialogOpen, setServiceDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);

  const [isFormPriceDialogOpen, setFormPriceDialogOpen] = useState(false);
  const [currentFormPrice, setCurrentFormPrice] = useState<Partial<FormPrice> | null>(null);


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
      // toast({ title: 'Success', description: 'Blog post deleted successfully.' });
    } catch (error) {
      // toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete blog post.' });
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
      // toast({ title: 'Success', description: 'Video deleted successfully.' });
    } catch (error) {
      // toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete video.' });
    }
  };

  const handleEditFaq = (faq: Faq) => {
    setCurrentFaq(faq);
    setFaqDialogOpen(true);
  };

  const handleAddNewFaq = () => {
    setCurrentFaq(null);
    setFaqDialogOpen(true);
  };

  const handleDeleteFaq = async (faqId: string) => {
    try {
      await deleteDoc(doc(db, 'faqs', faqId));
      setFaqs(faqs.filter(f => f.id !== faqId));
      // toast({ title: 'Success', description: 'FAQ deleted successfully.' });
    } catch (error) {
      // toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete FAQ.' });
    }
  };

  const handleEditService = (service: Service) => {
    setCurrentService(service);
    setServiceDialogOpen(true);
  };

  const handleAddNewService = () => {
    setCurrentService(null);
    setServiceDialogOpen(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteDoc(doc(db, 'services', serviceId));
      setServices(services.filter(s => s.id !== serviceId));
      // toast({ title: 'Success', description: 'Service deleted successfully.' });
    } catch (error) {
      // toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete service.' });
    }
  };

  const handleEditFormPrice = (formPrice: Partial<FormPrice>) => {
    const existingPrice = formPrices.find(p => p.id === formPrice.id);
    setCurrentFormPrice(existingPrice || formPrice);
    setFormPriceDialogOpen(true);
  };

  return (
    <>
      <Tabs defaultValue="form-pricing">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="form-pricing">{t({ en: "Form Pricing", ur: "فارم کی قیمتیں" })}</TabsTrigger>
          <TabsTrigger value="services">{t({ en: "Services", ur: "خدمات" })}</TabsTrigger>
          <TabsTrigger value="blog">{t({ en: "Blog Posts", ur: "بلاگ پوسٹس" })}</TabsTrigger>
          <TabsTrigger value="video">{t({ en: "Videos", ur: "ویڈیوز" })}</TabsTrigger>
          <TabsTrigger value="faq">{t({ en: "FAQs", ur: "اکثر پوچھے گئے سوالات" })}</TabsTrigger>
        </TabsList>
        <TabsContent value="form-pricing">
          <Card>
            <CardHeader>
              <CardTitle>{t({ en: "Manage Form Pricing", ur: "فارم کی قیمتوں کا نظم کریں" })}</CardTitle>
              <CardDescription>{t({ en: "Set the prices for different forms available on the website.", ur: "ویب سائٹ پر دستیاب مختلف فارموں کی قیمتیں مقرر کریں۔" })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formPricesLoading ? (
                Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
              ) : (
                allForms.map(form => {
                    const priceInfo = formPrices.find(p => p.id === form.id);
                    return (
                        <Card key={form.id} className="p-4">
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{t(form.name)}</h3>
                                    <p className="text-sm text-muted-foreground font-mono">{form.id}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {priceInfo ? (
                                        <Badge variant="secondary" className="text-base font-bold py-1 px-3">
                                            PKR {priceInfo.price.toLocaleString()}
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-base font-bold py-1 px-3">
                                            {t({ en: "Not Set", ur: "غیر مقرر" })}
                                        </Badge>
                                    )}
                                    <Button variant="outline" size="icon" onClick={() => handleEditFormPrice(form)}><Pencil className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </Card>
                    )
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                    <CardTitle>{t({ en: "Manage Services & Forms", ur: "خدمات اور فارم کا نظم کریں" })}</CardTitle>
                    <CardDescription>{t({ en: "Add, edit, or delete service offerings.", ur: "خدمات کی پیشکشیں شامل کریں، ترمیم کریں یا حذف کریں۔" })}</CardDescription>
                </div>
                <Button onClick={handleAddNewService}><PlusCircle className="mr-2 h-4 w-4" />{t({en: "Add New Service", ur: "نئی سروس شامل کریں"})}</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
               {servicesLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
              ) : services.length > 0 ? (
                services.map(service => (
                  <Card key={service.id} className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-semibold">{t(service.title)}</h3>
                             <div className="text-sm text-muted-foreground mt-1 flex items-center gap-4">
                                <Badge variant="secondary">PKR {service.price.toLocaleString()}</Badge>
                                <span>{t(service.completionTime)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{t(service.details)}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                            <Button variant="outline" size="icon" onClick={() => handleEditService(service)}><Pencil className="h-4 w-4" /></Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this service.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteService(service.id)}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-10">{t({en: "No services added yet.", ur: "ابھی تک کوئی خدمات شامل نہیں کی گئی ہیں۔"})}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                    <CardTitle>{t({ en: "Manage Blog Posts", ur: "بلاگ پوسٹس کا نظم کریں" })}</CardTitle>
                    <CardDescription>{t({ en: "Add, edit, or delete blog posts.", ur: "بلاگ پوسٹس شامل کریں، ترمیم کریں یا حذف کریں۔" })}</CardDescription>
                </div>
                <Button onClick={handleAddNewPost}><PlusCircle className="mr-2 h-4 w-4"/>{t({en: "Add New Post", ur: "نئی پوسٹ شامل کریں"})}</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {postsLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
              ) : posts.length > 0 ? (
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
               ) : (
                <p className="text-center text-muted-foreground py-10">{t({en: "No blog posts added yet.", ur: "ابھی تک کوئی بلاگ پوسٹس شامل نہیں کی گئی ہیں۔"})}</p>
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
                    <Button onClick={handleAddNewVideo}><PlusCircle className="mr-2 h-4 w-4" />{t({en: "Add New Video", ur: "نئی ویڈیو شامل کریں"})}</Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
               {videosLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
              ) : videos.length > 0 ? (
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
               ) : (
                <p className="text-center text-muted-foreground py-10">{t({en: "No videos added yet.", ur: "ابھی تک کوئی ویڈیوز شامل نہیں کی گئی ہیں۔"})}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                    <CardTitle>{t({ en: "Manage FAQs", ur: "اکثر پوچھے گئے سوالات کا نظم کریں" })}</CardTitle>
                    <CardDescription>{t({ en: "Add, edit, or delete frequently asked questions.", ur: "اکثر پوچھے گئے سوالات شامل کریں، ترمیم کریں یا حذف کریں۔" })}</CardDescription>
                </div>
                <Button onClick={handleAddNewFaq}><PlusCircle className="mr-2 h-4 w-4" />{t({en: "Add New FAQ", ur: "نیا سوال شامل کریں"})}</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
               {faqsLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
              ) : faqs.length > 0 ? (
                faqs.map(faq => (
                  <Card key={faq.id} className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-semibold">{t(faq.question)}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{t(faq.answer)}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                            <Button variant="outline" size="icon" onClick={() => handleEditFaq(faq)}><Pencil className="h-4 w-4" /></Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this FAQ.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteFaq(faq.id)}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-10">{t({en: "No FAQs added yet.", ur: "ابھی تک کوئی سوالات شامل نہیں کیے گئے ہیں۔"})}</p>
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
      <FaqEditDialog
        isOpen={isFaqDialogOpen}
        setIsOpen={setFaqDialogOpen}
        faq={currentFaq}
        onSave={(updatedFaqs) => setFaqs(updatedFaqs)}
        allFaqs={faqs}
      />
       <ServiceEditDialog
        isOpen={isServiceDialogOpen}
        setIsOpen={setServiceDialogOpen}
        service={currentService}
        onSave={(updatedServices) => setServices(updatedServices)}
        allServices={services}
      />
       <FormPriceEditDialog
        isOpen={isFormPriceDialogOpen}
        setIsOpen={setFormPriceDialogOpen}
        formPrice={currentFormPrice}
        onSave={(updatedPrices) => {
            setFormPriceDialogOpen(false);
            setFormPrices(updatedPrices);
        }}
        allPrices={formPrices}
      />
    </>
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
            const blogData = {
                title: { en: title, ur: title },
                description: { en: description, ur: description },
                image: image,
                hint: hint,
            };

            if (post?.id) { // Editing existing post
                const postRef = doc(db, 'blogPosts', post.id);
                await updateDoc(postRef, blogData);
                 onSave(allPosts.map(p => p.id === post.id ? { ...p, ...blogData, createdAt: p.createdAt } : p));
                toast({ title: "Success", description: "Blog post updated." });
            } else { // Adding new post
                const docRef = await addDoc(collection(db, 'blogPosts'), {
                    ...blogData,
                    href: '#',
                    createdAt: serverTimestamp()
                });
                onSave([{ id: docRef.id, ...blogData, createdAt: new Date() }, ...allPosts]);
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
            
            const videoData = {
                title: { en: title, ur: title },
                description: { en: description, ur: description },
                src: embedUrl,
            };

            if (video?.id) { // Editing
                const videoRef = doc(db, 'videos', video.id);
                await updateDoc(videoRef, videoData);
                onSave(allVideos.map(v => v.id === video.id ? { ...v, ...videoData, createdAt: v.createdAt } : v));
                toast({ title: "Success", description: "Video updated." });
            } else { // Adding
                const docRef = await addDoc(collection(db, 'videos'), {
                    ...videoData,
                    createdAt: serverTimestamp()
                });
                onSave([{ id: docRef.id, ...videoData, createdAt: new Date() }, ...allVideos]);
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

// FAQ Dialog Component
interface FaqEditDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    faq: Partial<Faq> | null;
    onSave: (faqs: Faq[]) => void;
    allFaqs: Faq[];
}

function FaqEditDialog({ isOpen, setIsOpen, faq, onSave, allFaqs }: FaqEditDialogProps) {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        if (faq) {
            setQuestion(t(faq.question || {en: '', ur: ''}));
            setAnswer(t(faq.answer || {en: '', ur: ''}));
        } else {
            setQuestion('');
            setAnswer('');
        }
    }, [faq, isOpen, t]);

    const handleFaqSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question || !answer) {
            toast({ variant: 'destructive', title: 'All fields are required.' });
            return;
        }
        try {
            const faqData = {
                question: { en: question, ur: question },
                answer: { en: answer, ur: answer },
            };

            if (faq?.id) { // Editing
                const faqRef = doc(db, 'faqs', faq.id);
                await updateDoc(faqRef, faqData);
                onSave(allFaqs.map(f => f.id === faq.id ? { ...f, ...faqData, createdAt: f.createdAt } : f));
                toast({ title: "Success", description: "FAQ updated." });
            } else { // Adding
                const docRef = await addDoc(collection(db, 'faqs'), {
                    ...faqData,
                    createdAt: serverTimestamp()
                });
                onSave([{ id: docRef.id, ...faqData, createdAt: new Date() }, ...allFaqs]);
                toast({ title: "Success", description: "FAQ added." });
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
                    <DialogTitle>{faq?.id ? t({en: "Edit FAQ", ur: "سوال میں ترمیم کریں"}) : t({en: "Add New FAQ", ur: "نیا سوال شامل کریں"})}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFaqSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="faq-question">{t({ en: "Question", ur: "سوال" })}</Label>
                        <Input id="faq-question" value={question} onChange={(e) => setQuestion(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="faq-answer">{t({ en: "Answer", ur: "جواب" })}</Label>
                        <Textarea id="faq-answer" value={answer} onChange={(e) => setAnswer(e.target.value)} required />
                    </div>
                    <DialogFooter>
                         <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                       </DialogClose>
                        <Button type="submit">{faq?.id ? t({en: "Save Changes", ur: "تبدیلیاں محفوظ کریں"}) : t({en: "Add FAQ", ur: "سوال شامل کریں"})}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


// Service Dialog Component
interface ServiceEditDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    service: Partial<Service> | null;
    onSave: (services: Service[]) => void;
    allServices: Service[];
}

function ServiceEditDialog({ isOpen, setIsOpen, service, onSave, allServices }: ServiceEditDialogProps) {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [serviceCode, setServiceCode] = useState('');
    const [price, setPrice] = useState<number | string>('');
    const [completionTime, setCompletionTime] = useState('');
    const [details, setDetails] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    
    useEffect(() => {
        if (service) {
            setTitle(t(service.title || {en: '', ur: ''}));
            setServiceCode(service.serviceCode || '');
            setPrice(service.price || '');
            setCompletionTime(t(service.completionTime || {en: '', ur: ''}));
            setDetails(t(service.details || {en: '', ur: ''}));
            setWhatsappNumber(service.whatsappNumber || '');
        } else {
            setTitle('');
            setServiceCode('');
            setPrice('');
            setCompletionTime('');
            setDetails('');
            setWhatsappNumber('');
        }
    }, [service, isOpen, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !price || !completionTime || !details || !whatsappNumber || !serviceCode) {
            toast({ variant: 'destructive', title: 'All fields are required.' });
            return;
        }
        try {
            const serviceData = {
                title: { en: title, ur: title },
                serviceCode: serviceCode.toLowerCase().replace(/\s+/g, '_'),
                price: Number(price),
                completionTime: { en: completionTime, ur: completionTime },
                details: { en: details, ur: details },
                whatsappNumber: whatsappNumber.replace(/\D/g, ''),
            };

            if (service?.id) { // Editing
                const serviceRef = doc(db, 'services', service.id);
                await updateDoc(serviceRef, serviceData);
                onSave(allServices.map(s => s.id === service.id ? { ...s, ...serviceData, createdAt: s.createdAt } : s));
                toast({ title: "Success", description: "Service updated." });
            } else { // Adding
                const docRef = await addDoc(collection(db, 'services'), {
                    ...serviceData,
                    createdAt: serverTimestamp()
                });
                onSave([{ id: docRef.id, ...serviceData, createdAt: new Date() }, ...allServices]);
                toast({ title: "Success", description: "Service added." });
            }
            setIsOpen(false);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{service?.id ? t({en: "Edit Service", ur: "سروس میں ترمیم کریں"}) : t({en: "Add New Service", ur: "نئی سروس شامل کریں"})}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="service-title">{t({ en: "Title", ur: "عنوان" })}</Label>
                            <Input id="service-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="service-code">
                                {t({ en: "Service Code", ur: "سروس کوڈ" })}
                                <span className="text-xs text-muted-foreground ml-2">(e.g., personal_tax_filing)</span>
                            </Label>
                            <Input id="service-code" value={serviceCode} onChange={(e) => setServiceCode(e.target.value)} required disabled={!!service?.id} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="service-price">{t({ en: "Price (PKR)", ur: "قیمت (PKR)" })}</Label>
                            <Input id="service-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="service-completion">{t({ en: "Completion Time", ur: "تکمیل کا وقت" })}</Label>
                            <Input id="service-completion" value={completionTime} onChange={(e) => setCompletionTime(e.target.value)} placeholder="e.g., 1-2 weeks" required />
                        </div>
                         <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="service-whatsapp">{t({ en: "WhatsApp Number", ur: "واٹس ایپ نمبر" })}</Label>
                            <Input id="service-whatsapp" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="e.g., 923001234567" required />
                        </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="service-details">{t({ en: "Details", ur: "تفصیلات" })}</Label>
                        <Textarea id="service-details" value={details} onChange={(e) => setDetails(e.target.value)} required rows={5}/>
                    </div>
                    <DialogFooter className="pt-4">
                         <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                       </DialogClose>
                        <Button type="submit">{service?.id ? t({en: "Save Changes", ur: "تبدیلیاں محفوظ کریں"}) : t({en: "Add Service", ur: "سروس شامل کریں"})}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Form Price Dialog Component
interface FormPriceEditDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formPrice: Partial<FormPrice> | null;
  onSave: (prices: FormPrice[]) => void;
  allPrices: FormPrice[];
}

function FormPriceEditDialog({ isOpen, setIsOpen, formPrice, onSave, allPrices }: FormPriceEditDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [price, setPrice] = useState<number | string>('');

  useEffect(() => {
    if (formPrice) {
      setPrice(formPrice.price || '');
    } else {
      setPrice('');
    }
  }, [formPrice, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price || !formPrice?.id || !formPrice?.name) {
      toast({ variant: 'destructive', title: 'Price is required.' });
      return;
    }
    try {
      const priceData = { price: Number(price), name: formPrice.name };
      const priceRef = doc(db, 'formPrices', formPrice.id);
      await setDoc(priceRef, priceData, { merge: true });

      const updatedPrices = [...allPrices];
      const priceIndex = updatedPrices.findIndex(p => p.id === formPrice.id);
      if (priceIndex > -1) {
          updatedPrices[priceIndex] = { ...updatedPrices[priceIndex], ...priceData };
      } else {
          updatedPrices.push({ id: formPrice.id, ...priceData });
      }

      onSave(updatedPrices);
      toast({ title: "Success", description: "Form price updated." });
      setIsOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t({ en: "Edit Form Price for", ur: "کے لیے فارم کی قیمت میں ترمیم کریں" })}: {formPrice ? t(formPrice.name!) : ''}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="form-price">{t({ en: "Price (PKR)", ur: "قیمت (PKR)" })}</Label>
            <Input id="form-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
