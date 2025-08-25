
'use client';
import { useState } from "react";
import { useFaqs, Faq } from "@/hooks/useFaqs";
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

type FaqFormData = Omit<Faq, 'id' | 'createdAt'>;

export default function AdminContentFaqsPage() {
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const { faqs, loading } = useFaqs();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentFaq, setCurrentFaq] = useState<Faq | null>(null);

    const mutation = useMutation({
        mutationFn: async (faqData: { id?: string; data: FaqFormData }) => {
            if (faqData.id) {
                const faqRef = doc(db, "faqs", faqData.id);
                await updateDoc(faqRef, faqData.data);
                return faqData.id;
            } else {
                const docRef = await addDoc(collection(db, "faqs"), { ...faqData.data, createdAt: serverTimestamp() });
                return docRef.id;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['faqs'] });
            toast({ title: t({ en: "Success", ur: "کامیابی" }), description: t({ en: "FAQ saved successfully.", ur: "FAQ کامیابی سے محفوظ ہو گیا۔" }) });
            setIsDialogOpen(false);
            setCurrentFaq(null);
        },
        onError: (error: any) => {
            toast({ variant: 'destructive', title: t({ en: "Error", ur: "خرابی" }), description: error.message });
        }
    });

     const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const faqRef = doc(db, "faqs", id);
            await deleteDoc(faqRef);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['faqs'] });
            toast({ title: t({ en: "FAQ Deleted", ur: "FAQ حذف کر دیا گیا" }), description: t({ en: "The FAQ has been successfully deleted.", ur: "FAQ کامیابی سے حذف کر دیا گیا ہے۔" }) });
        },
        onError: (error: any) => {
            toast({ variant: 'destructive', title: t({ en: "Error", ur: "خرابی" }), description: error.message });
        }
    });

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: FaqFormData = {
            question: { en: formData.get('question_en') as string, ur: formData.get('question_ur') as string },
            answer: { en: formData.get('answer_en') as string, ur: formData.get('answer_ur') as string },
        };
        mutation.mutate({ id: currentFaq?.id, data });
    };

    const openDialog = (faq: Faq | null = null) => {
        setCurrentFaq(faq);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if(confirm(t({en: 'Are you sure you want to delete this FAQ?', ur:'کیا آپ واقعی اس FAQ کو حذف کرنا چاہتے ہیں؟'}))) {
            deleteMutation.mutate(id);
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{t({ en: "Manage FAQs", ur: "اکثر پوچھے گئے سوالات کا نظم کریں" })}</CardTitle>
                    <CardDescription>{t({ en: "Add, edit, or delete FAQs.", ur: "FAQs شامل کریں، ترمیم کریں، یا حذف کریں۔" })}</CardDescription>
                </div>
                <Button onClick={() => openDialog()}>
                    <PlusCircle /> {t({ en: "Add FAQ", ur: "FAQ شامل کریں" })}
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t({en: "Question", ur: "سوال"})}</TableHead>
                            <TableHead className="text-right">{t({en: "Actions", ur: "کارروائیاں"})}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                                    <TableCell className="text-right space-x-2"><Skeleton className="h-8 w-8 inline-block" /><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                                </TableRow>
                            ))
                        ) : faqs.map(faq => (
                            <TableRow key={faq.id}>
                                <TableCell className="font-medium">{t(faq.question)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openDialog(faq)}><Edit /></Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(faq.id)}><Trash2 /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{currentFaq ? t({ en: "Edit FAQ", ur: "FAQ میں ترمیم کریں" }) : t({ en: "Add New FAQ", ur: "نیا FAQ شامل کریں" })}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="question_en">Question (EN)</Label><Input id="question_en" name="question_en" defaultValue={currentFaq?.question.en || ''} /></div>
                                <div className="space-y-2"><Label htmlFor="question_ur">Question (UR)</Label><Input id="question_ur" name="question_ur" defaultValue={currentFaq?.question.ur || ''} dir="rtl" /></div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="answer_en">Answer (EN)</Label><Textarea id="answer_en" name="answer_en" defaultValue={currentFaq?.answer.en || ''} /></div>
                                <div className="space-y-2"><Label htmlFor="answer_ur">Answer (UR)</Label><Textarea id="answer_ur" name="answer_ur" defaultValue={currentFaq?.answer.ur || ''} dir="rtl" /></div>
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
