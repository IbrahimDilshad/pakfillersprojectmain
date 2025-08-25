
'use client';
import { useState } from "react";
import { useServices, Service } from "@/hooks/useServices";
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

type ServiceFormData = Omit<Service, 'id' | 'createdAt'>;

export default function AdminContentServicesPage() {
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const { services, loading } = useServices();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentService, setCurrentService] = useState<Service | null>(null);

    const mutation = useMutation({
        mutationFn: async (serviceData: { id?: string; data: ServiceFormData }) => {
            if (serviceData.id) {
                const serviceRef = doc(db, "services", serviceData.id);
                await updateDoc(serviceRef, serviceData.data);
                return serviceData.id;
            } else {
                const docRef = await addDoc(collection(db, "services"), { ...serviceData.data, createdAt: serverTimestamp() });
                return docRef.id;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            toast({ title: t({ en: "Success", ur: "کامیابی" }), description: t({ en: "Service saved successfully.", ur: "سروس کامیابی سے محفوظ ہو گئی۔" }) });
            setIsDialogOpen(false);
            setCurrentService(null);
        },
        onError: (error: any) => {
            toast({ variant: 'destructive', title: t({ en: "Error", ur: "خرابی" }), description: error.message });
        }
    });

     const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const serviceRef = doc(db, "services", id);
            await deleteDoc(serviceRef);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            toast({ title: t({ en: "Service Deleted", ur: "سروس حذف کر دی گئی" }), description: t({ en: "The service has been successfully deleted.", ur: "سروس کامیابی سے حذف کر دی گئی ہے۔" }) });
        },
        onError: (error: any) => {
            toast({ variant: 'destructive', title: t({ en: "Error", ur: "خرابی" }), description: error.message });
        }
    });

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: ServiceFormData = {
            title: { en: formData.get('title_en') as string, ur: formData.get('title_ur') as string },
            details: { en: formData.get('details_en') as string, ur: formData.get('details_ur') as string },
            completionTime: { en: formData.get('completionTime_en') as string, ur: formData.get('completionTime_ur') as string },
            price: Number(formData.get('price')),
            whatsappNumber: formData.get('whatsappNumber') as string,
            serviceCode: formData.get('serviceCode') as string,
        };
        mutation.mutate({ id: currentService?.id, data });
    };

    const openDialog = (service: Service | null = null) => {
        setCurrentService(service);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if(confirm(t({en: 'Are you sure you want to delete this service?', ur:'کیا آپ واقعی اس سروس کو حذف کرنا چاہتے ہیں؟'}))) {
            deleteMutation.mutate(id);
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{t({ en: "Manage Services", ur: "خدمات کا نظم کریں" })}</CardTitle>
                    <CardDescription>{t({ en: "Add, edit, or delete services.", ur: "خدمات شامل کریں، ترمیم کریں، یا حذف کریں۔" })}</CardDescription>
                </div>
                <Button onClick={() => openDialog()}>
                    <PlusCircle /> {t({ en: "Add Service", ur: "سروس شامل کریں" })}
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t({en: "Title", ur: "عنوان"})}</TableHead>
                            <TableHead>{t({en: "Price (PKR)", ur: "قیمت (PKR)"})}</TableHead>
                            <TableHead>{t({en: "Completion Time", ur: "تکمیل کا وقت"})}</TableHead>
                            <TableHead className="text-right">{t({en: "Actions", ur: "کارروائیاں"})}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell className="text-right space-x-2"><Skeleton className="h-8 w-8 inline-block" /><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                                </TableRow>
                            ))
                        ) : services.map(service => (
                            <TableRow key={service.id}>
                                <TableCell>{t(service.title)}</TableCell>
                                <TableCell>{service.price.toLocaleString()}</TableCell>
                                <TableCell>{t(service.completionTime)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openDialog(service)}><Edit /></Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(service.id)}><Trash2 /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{currentService ? t({ en: "Edit Service", ur: "سروس میں ترمیم کریں" }) : t({ en: "Add New Service", ur: "نئی سروس شامل کریں" })}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="title_en">Title (EN)</Label><Input id="title_en" name="title_en" defaultValue={currentService?.title.en || ''} /></div>
                                <div className="space-y-2"><Label htmlFor="title_ur">Title (UR)</Label><Input id="title_ur" name="title_ur" defaultValue={currentService?.title.ur || ''} dir="rtl" /></div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="details_en">Details (EN)</Label><Textarea id="details_en" name="details_en" defaultValue={currentService?.details.en || ''} /></div>
                                <div className="space-y-2"><Label htmlFor="details_ur">Details (UR)</Label><Textarea id="details_ur" name="details_ur" defaultValue={currentService?.details.ur || ''} dir="rtl" /></div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="completionTime_en">Completion Time (EN)</Label><Input id="completionTime_en" name="completionTime_en" defaultValue={currentService?.completionTime.en || ''} /></div>
                                <div className="space-y-2"><Label htmlFor="completionTime_ur">Completion Time (UR)</Label><Input id="completionTime_ur" name="completionTime_ur" defaultValue={currentService?.completionTime.ur || ''} dir="rtl" /></div>
                            </div>
                             <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2"><Label htmlFor="price">Price</Label><Input id="price" name="price" type="number" defaultValue={currentService?.price || ''} /></div>
                                <div className="space-y-2"><Label htmlFor="whatsappNumber">WhatsApp Number</Label><Input id="whatsappNumber" name="whatsappNumber" defaultValue={currentService?.whatsappNumber || ''} /></div>
                                <div className="space-y-2"><Label htmlFor="serviceCode">Service Code</Label><Input id="serviceCode" name="serviceCode" defaultValue={currentService?.serviceCode || ''} /></div>
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
