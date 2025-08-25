
'use client';
import { useState } from "react";
import { useVideos, Video } from "@/hooks/useVideos";
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

type VideoFormData = Omit<Video, 'id' | 'createdAt'>;

export default function AdminContentVideosPage() {
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const { videos, loading } = useVideos();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

    const mutation = useMutation({
        mutationFn: async (videoData: { id?: string; data: VideoFormData }) => {
            if (videoData.id) {
                const videoRef = doc(db, "videos", videoData.id);
                await updateDoc(videoRef, videoData.data);
                return videoData.id;
            } else {
                const docRef = await addDoc(collection(db, "videos"), { ...videoData.data, createdAt: serverTimestamp() });
                return docRef.id;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['videos'] });
            toast({ title: t({ en: "Success", ur: "کامیابی" }), description: t({ en: "Video saved successfully.", ur: "ویڈیو کامیابی سے محفوظ ہو گئی۔" }) });
            setIsDialogOpen(false);
            setCurrentVideo(null);
        },
        onError: (error: any) => {
            toast({ variant: 'destructive', title: t({ en: "Error", ur: "خرابی" }), description: error.message });
        }
    });

     const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const videoRef = doc(db, "videos", id);
            await deleteDoc(videoRef);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['videos'] });
            toast({ title: t({ en: "Video Deleted", ur: "ویڈیو حذف کر دی گئی" }), description: t({ en: "The video has been successfully deleted.", ur: "ویڈیو کامیابی سے حذف کر دی گئی ہے۔" }) });
        },
        onError: (error: any) => {
            toast({ variant: 'destructive', title: t({ en: "Error", ur: "خرابی" }), description: error.message });
        }
    });

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: VideoFormData = {
            title: { en: formData.get('title_en') as string, ur: formData.get('title_ur') as string },
            description: { en: formData.get('description_en') as string, ur: formData.get('description_ur') as string },
            src: formData.get('src') as string,
        };
        mutation.mutate({ id: currentVideo?.id, data });
    };

    const openDialog = (video: Video | null = null) => {
        setCurrentVideo(video);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if(confirm(t({en: 'Are you sure you want to delete this video?', ur:'کیا آپ واقعی اس ویڈیو کو حذف کرنا چاہتے ہیں؟'}))) {
            deleteMutation.mutate(id);
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{t({ en: "Manage Videos", ur: "ویڈیوز کا نظم کریں" })}</CardTitle>
                    <CardDescription>{t({ en: "Add, edit, or delete videos.", ur: "ویڈیوز شامل کریں، ترمیم کریں، یا حذف کریں۔" })}</CardDescription>
                </div>
                <Button onClick={() => openDialog()}>
                    <PlusCircle /> {t({ en: "Add Video", ur: "ویڈیو شامل کریں" })}
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t({en: "Thumbnail", ur: "تھمب نیل"})}</TableHead>
                            <TableHead>{t({en: "Title", ur: "عنوان"})}</TableHead>
                            <TableHead className="text-right">{t({en: "Actions", ur: "کارروائیاں"})}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-16 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                    <TableCell className="text-right space-x-2"><Skeleton className="h-8 w-8 inline-block" /><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                                </TableRow>
                            ))
                        ) : videos.map(video => {
                             const videoId = video.src.includes('embed/') ? video.src.split('embed/')[1] : '';
                             const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : "https://placehold.co/120x90.png";
                            return (
                                <TableRow key={video.id}>
                                    <TableCell>
                                        <Image src={thumbnailUrl} alt={t(video.title)} width={120} height={90} className="rounded-md" />
                                    </TableCell>
                                    <TableCell>{t(video.title)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openDialog(video)}><Edit /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(video.id)}><Trash2 /></Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{currentVideo ? t({ en: "Edit Video", ur: "ویڈیو میں ترمیم کریں" }) : t({ en: "Add New Video", ur: "نئی ویڈیو شامل کریں" })}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="title_en">Title (EN)</Label><Input id="title_en" name="title_en" defaultValue={currentVideo?.title.en || ''} /></div>
                                <div className="space-y-2"><Label htmlFor="title_ur">Title (UR)</Label><Input id="title_ur" name="title_ur" defaultValue={currentVideo?.title.ur || ''} dir="rtl" /></div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="src">YouTube Embed URL</Label><Input id="src" name="src" defaultValue={currentVideo?.src || ''} placeholder="https://www.youtube.com/embed/VIDEO_ID" /></div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="description_en">Description (EN)</Label><Textarea id="description_en" name="description_en" defaultValue={currentVideo?.description.en || ''} /></div>
                                <div className="space-y-2"><Label htmlFor="description_ur">Description (UR)</Label><Textarea id="description_ur" name="description_ur" defaultValue={currentVideo?.description.ur || ''} dir="rtl" /></div>
                            </div>
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
