
'use client';
import { useState } from "react";
import { useBlogPosts, BlogPost } from "@/hooks/useBlogPosts";
import { useLanguage } from "@/context/language-context";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Image from "next/image";

type PostFormData = Omit<BlogPost, 'id' | 'createdAt'>;

export default function AdminContentBlogsPage() {
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const { posts, loading } = useBlogPosts();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);

    const mutation = useMutation({
        mutationFn: async (postData: { id?: string; data: PostFormData }) => {
            if (postData.id) {
                const postRef = doc(db, "blogPosts", postData.id);
                await updateDoc(postRef, postData.data);
                return postData.id;
            } else {
                const docRef = await addDoc(collection(db, "blogPosts"), { ...postData.data, createdAt: serverTimestamp() });
                return docRef.id;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
            toast({ title: t({ en: "Success", ur: "کامیابی" }), description: t({ en: "Blog post saved successfully.", ur: "بلاگ پوسٹ کامیابی سے محفوظ ہو گئی۔" }) });
            setIsDialogOpen(false);
            setCurrentPost(null);
        },
        onError: (error: any) => {
            toast({ variant: 'destructive', title: t({ en: "Error", ur: "خرابی" }), description: error.message });
        }
    });

     const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const postRef = doc(db, "blogPosts", id);
            await deleteDoc(postRef);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
            toast({ title: t({ en: "Post Deleted", ur: "پوسٹ حذف کر دی گئی" }), description: t({ en: "The blog post has been successfully deleted.", ur: "بلاگ پوسٹ کامیابی سے حذف کر دی گئی ہے۔" }) });
        },
        onError: (error: any) => {
            toast({ variant: 'destructive', title: t({ en: "Error", ur: "خرابی" }), description: error.message });
        }
    });

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: PostFormData = {
            title: { en: formData.get('title_en') as string, ur: formData.get('title_ur') as string },
            description: { en: formData.get('description_en') as string, ur: formData.get('description_ur') as string },
            image: formData.get('image') as string,
            hint: formData.get('hint') as string,
            href: formData.get('href') as string,
        };
        mutation.mutate({ id: currentPost?.id, data });
    };

    const openDialog = (post: BlogPost | null = null) => {
        setCurrentPost(post);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if(confirm(t({en: 'Are you sure you want to delete this post?', ur:'کیا آپ واقعی اس پوسٹ کو حذف کرنا چاہتے ہیں؟'}))) {
            deleteMutation.mutate(id);
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{t({ en: "Manage Blog Posts", ur: "بلاگ پوسٹس کا نظم کریں" })}</CardTitle>
                    <CardDescription>{t({ en: "Add, edit, or delete posts.", ur: "پوسٹس شامل کریں، ترمیم کریں، یا حذف کریں۔" })}</CardDescription>
                </div>
                <Button onClick={() => openDialog()}>
                    <PlusCircle /> {t({ en: "Add Post", ur: "پوسٹ شامل کریں" })}
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t({en: "Image", ur: "تصویر"})}</TableHead>
                            <TableHead>{t({en: "Title", ur: "عنوان"})}</TableHead>
                            <TableHead className="text-right">{t({en: "Actions", ur: "کارروائیاں"})}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-16 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                    <TableCell className="text-right space-x-2"><Skeleton className="h-8 w-8 inline-block" /><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                                </TableRow>
                            ))
                        ) : posts.map(post => (
                            <TableRow key={post.id}>
                                <TableCell>
                                    <Image src={post.image} alt={t(post.title)} width={100} height={66} className="rounded-md" />
                                </TableCell>
                                <TableCell>{t(post.title)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openDialog(post)}><Edit /></Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(post.id)}><Trash2 /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{currentPost ? t({ en: "Edit Blog Post", ur: "بلاگ پوسٹ میں ترمیم کریں" }) : t({ en: "Add New Blog Post", ur: "نئی بلاگ پوسٹ شامل کریں" })}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="title_en">Title (EN)</Label><Input id="title_en" name="title_en" defaultValue={currentPost?.title.en || ''} /></div>
                                <div className="space-y-2"><Label htmlFor="title_ur">Title (UR)</Label><Input id="title_ur" name="title_ur" defaultValue={currentPost?.title.ur || ''} dir="rtl" /></div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="description_en">Description (EN)</Label><Textarea id="description_en" name="description_en" defaultValue={currentPost?.description.en || ''} /></div>
                                <div className="space-y-2"><Label htmlFor="description_ur">Description (UR)</Label><Textarea id="description_ur" name="description_ur" defaultValue={currentPost?.description.ur || ''} dir="rtl" /></div>
                            </div>
                             <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="image">Image URL</Label><Input id="image" name="image" defaultValue={currentPost?.image || ''} placeholder="https://picsum.photos/600/400" /></div>
                                <div className="space-y-2"><Label htmlFor="hint">Image AI Hint</Label><Input id="hint" name="hint" defaultValue={currentPost?.hint || ''} placeholder="e.g. tax filing" /></div>
                             </div>
                             <div className="space-y-2"><Label htmlFor="href">Link (optional)</Label><Input id="href" name="href" defaultValue={currentPost?.href || ''} placeholder="/blog/my-post-slug" /></div>
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? t({en: 'Saving...', ur: 'محفوظ ہو رہا ہے...'}) : t({en: 'Save', ur: 'محفوظ کریں'})}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
