
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/language-context";
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, Pencil, PlusCircle, ClipboardCopy } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface PaymentMethod {
    id: string;
    bankName: string;
    accountTitle: string;
    accountNumber: string;
}

export default function AdminPaymentsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentMethod, setCurrentMethod] = useState<Partial<PaymentMethod> | null>(null);

  const fetchMethods = async () => {
    setLoading(true);
    try {
        const q = query(collection(db, "paymentMethods"), orderBy("bankName"));
        const querySnapshot = await getDocs(q);
        const methodsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentMethod));
        setMethods(methodsList);
    } catch (error) {
        console.error("Error fetching payment methods: ", error);
        toast({ variant: 'destructive', title: 'Failed to fetch payment methods.' });
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleAddNew = () => {
    setCurrentMethod(null);
    setDialogOpen(true);
  };

  const handleEdit = (method: PaymentMethod) => {
    setCurrentMethod(method);
    setDialogOpen(true);
  };

  const handleDelete = async (methodId: string) => {
    try {
      await deleteDoc(doc(db, 'paymentMethods', methodId));
      setMethods(methods.filter(m => m.id !== methodId));
      toast({ title: 'Success', description: 'Payment method deleted successfully.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete payment method.' });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t({ en: "Manage Payment Methods", ur: "ادائیگی کے طریقوں کا نظم کریں" })}</CardTitle>
              <CardDescription>{t({ en: "Add, edit, or delete bank accounts for checkout.", ur: "چیک آؤٹ کے لیے بینک اکاؤنٹس شامل کریں، ترمیم کریں یا حذف کریں۔" })}</CardDescription>
            </div>
            <Button onClick={handleAddNew}><PlusCircle className="mr-2" />{t({ en: "Add New Method", ur: "نیا طریقہ شامل کریں" })}</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : methods.length === 0 ? (
            <p className="p-4 text-center text-muted-foreground">{t({ en: "No payment methods added yet.", ur: "ابھی تک کوئی ادائیگی کا طریقہ شامل نہیں کیا گیا ہے۔" })}</p>
          ) : (
            methods.map(method => (
              <Card key={method.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{method.bankName}</h3>
                    <p className="text-sm text-muted-foreground">{method.accountTitle}</p>
                    <p className="text-sm font-mono text-primary">{method.accountNumber}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(method)}><Pencil className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this payment method.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(method.id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
      <PaymentMethodDialog 
        isOpen={isDialogOpen} 
        setIsOpen={setDialogOpen} 
        method={currentMethod}
        onSave={() => {
            setDialogOpen(false);
            fetchMethods(); // Re-fetch to get the latest data
        }}
      />
    </>
  );
}

interface PaymentMethodDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    method: Partial<PaymentMethod> | null;
    onSave: () => void;
}

function PaymentMethodDialog({ isOpen, setIsOpen, method, onSave }: PaymentMethodDialogProps) {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [bankName, setBankName] = useState('');
    const [accountTitle, setAccountTitle] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    
    useEffect(() => {
        if (method) {
            setBankName(method.bankName || '');
            setAccountTitle(method.accountTitle || '');
            setAccountNumber(method.accountNumber || '');
        } else {
            setBankName('');
            setAccountTitle('');
            setAccountNumber('');
        }
    }, [method, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bankName || !accountTitle || !accountNumber) {
            toast({ variant: 'destructive', title: 'All fields are required.' });
            return;
        }
        try {
            const methodData = {
                bankName,
                accountTitle,
                accountNumber
            };

            if (method?.id) { // Editing existing method
                const methodRef = doc(db, 'paymentMethods', method.id);
                await updateDoc(methodRef, methodData);
                toast({ title: "Success", description: "Payment method updated." });
            } else { // Adding new method
                await addDoc(collection(db, 'paymentMethods'), methodData);
                toast({ title: "Success", description: "Payment method added." });
            }
            onSave();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{method?.id ? t({en: "Edit Payment Method", ur: "ادائیگی کا طریقہ تبدیل کریں"}) : t({en: "Add New Payment Method", ur: "نیا ادائیگی کا طریقہ شامل کریں"})}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="bank-name">{t({ en: "Bank Name", ur: "بینک کا نام" })}</Label>
                        <Input id="bank-name" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g., Meezan Bank" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="account-title">{t({ en: "Account Title", ur: "اکاؤنٹ کا عنوان" })}</Label>
                        <Input id="account-title" value={accountTitle} onChange={(e) => setAccountTitle(e.target.value)} placeholder="e.g., PakFiler Pvt. Ltd." required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="account-number">{t({ en: "Account Number", ur: "اکاؤنٹ نمبر" })}</Label>
                        <Input id="account-number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="e.g., 01234567890123" required />
                    </div>
                    <DialogFooter>
                       <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                       </DialogClose>
                        <Button type="submit">{method?.id ? t({en: "Save Changes", ur: "تبدیلیاں محفوظ کریں"}) : t({en: "Add Method", ur: "طریقہ شامل کریں"})}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
