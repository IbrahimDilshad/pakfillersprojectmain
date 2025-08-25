
'use client';
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/context/language-context";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

interface PaymentMethod {
    id: string;
    bankName: string;
    accountTitle: string;
    accountNumber: string;
}

type PaymentMethodFormData = Omit<PaymentMethod, 'id'>;

async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
    const q = collection(db, "paymentMethods");
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentMethod));
}


export default function AdminPaymentsPage() {
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentMethod, setCurrentMethod] = useState<PaymentMethod | null>(null);

    const { data: paymentMethods = [], isLoading: loading } = useQuery<PaymentMethod[]>({
      queryKey: ['paymentMethods'],
      queryFn: fetchPaymentMethods
    });

    const mutation = useMutation({
        mutationFn: async (methodData: { id?: string; data: PaymentMethodFormData }) => {
            if (methodData.id) {
                const methodRef = doc(db, "paymentMethods", methodData.id);
                await updateDoc(methodRef, methodData.data);
                return methodData.id;
            } else {
                const docRef = await addDoc(collection(db, "paymentMethods"), methodData.data);
                return docRef.id;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
            toast({ title: t({ en: "Success", ur: "کامیابی" }), description: t({ en: "Payment method saved successfully.", ur: "ادائیگی کا طریقہ کامیابی سے محفوظ ہو گیا۔" }) });
            setIsDialogOpen(false);
            setCurrentMethod(null);
        },
        onError: (error: any) => {
            toast({ variant: 'destructive', title: t({ en: "Error", ur: "خرابی" }), description: error.message });
        }
    });

     const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const methodRef = doc(db, "paymentMethods", id);
            await deleteDoc(methodRef);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
            toast({ title: t({ en: "Method Deleted", ur: "طریقہ حذف کر دیا گیا" }), description: t({ en: "The payment method has been successfully deleted.", ur: "ادائیگی کا طریقہ کامیابی سے حذف کر دیا گیا ہے۔" }) });
        },
        onError: (error: any) => {
            toast({ variant: 'destructive', title: t({ en: "Error", ur: "خرابی" }), description: error.message });
        }
    });

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: PaymentMethodFormData = {
            bankName: formData.get('bankName') as string,
            accountTitle: formData.get('accountTitle') as string,
            accountNumber: formData.get('accountNumber') as string,
        };
        mutation.mutate({ id: currentMethod?.id, data });
    };

    const openDialog = (method: PaymentMethod | null = null) => {
        setCurrentMethod(method);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if(confirm(t({en: 'Are you sure you want to delete this payment method?', ur:'کیا آپ واقعی اس ادائیگی کے طریقے کو حذف کرنا چاہتے ہیں؟'}))) {
            deleteMutation.mutate(id);
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{t({ en: "Payment Methods", ur: "ادائیگی کے طریقے" })}</CardTitle>
                    <CardDescription>{t({ en: "Manage bank accounts for payments.", ur: "ادائیگیوں کے لیے بینک اکاؤنٹس کا نظم کریں۔" })}</CardDescription>
                </div>
                <Button onClick={() => openDialog()}>
                    <PlusCircle /> {t({ en: "Add Method", ur: "طریقہ شامل کریں" })}
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t({en: "Bank Name", ur: "بینک کا نام"})}</TableHead>
                            <TableHead>{t({en: "Account Title", ur: "اکاؤنٹ کا عنوان"})}</TableHead>
                            <TableHead>{t({en: "Account Number", ur: "اکاؤنٹ نمبر"})}</TableHead>
                            <TableHead className="text-right">{t({en: "Actions", ur: "کارروائیاں"})}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 2 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell className="text-right space-x-2"><Skeleton className="h-8 w-8 inline-block" /><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                                </TableRow>
                            ))
                        ) : paymentMethods.map(method => (
                            <TableRow key={method.id}>
                                <TableCell>{method.bankName}</TableCell>
                                <TableCell>{method.accountTitle}</TableCell>
                                <TableCell className="font-mono">{method.accountNumber}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openDialog(method)}><Edit /></Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(method.id)}><Trash2 /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{currentMethod ? t({ en: "Edit Method", ur: "طریقہ میں ترمیم کریں" }) : t({ en: "Add New Method", ur: "نیا طریقہ شامل کریں" })}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
                            <div className="space-y-2"><Label htmlFor="bankName">Bank Name</Label><Input id="bankName" name="bankName" defaultValue={currentMethod?.bankName || ''} /></div>
                            <div className="space-y-2"><Label htmlFor="accountTitle">Account Title</Label><Input id="accountTitle" name="accountTitle" defaultValue={currentMethod?.accountTitle || ''} /></div>
                            <div className="space-y-2"><Label htmlFor="accountNumber">Account Number</Label><Input id="accountNumber" name="accountNumber" defaultValue={currentMethod?.accountNumber || ''} /></div>
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
