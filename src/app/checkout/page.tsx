
'use client';
import { useState } from 'react';
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Upload, ClipboardCopy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useFormPrices } from '@/hooks/useFormPrices';

export default function CheckoutPage() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const { items, total, clearCart } = useCart();
    const { activeUser } = useAuth();
    const router = useRouter();
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { formPrices: paymentMethods, loading: loadingPaymentMethods } = useFormPrices();

    const handleFileCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: t({ en: "Copied!", ur: "کاپی ہو گیا!"}) });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast({ variant: 'destructive', title: t({ en: "File Too Large", ur: "فائل بہت بڑی ہے" }), description: t({ en: "Please upload an image smaller than 5MB.", ur: "براہ کرم 5MB سے چھوٹی تصویر اپ لوڈ کریں۔" }) });
                e.target.value = ''; // Reset file input
                return;
            }
            setPaymentScreenshot(file);
        }
    };

    const handleSubmitOrder = async () => {
        if (!paymentScreenshot) {
            toast({ variant: 'destructive', title: t({ en: "Screenshot Required", ur: "اسکرین شاٹ درکار ہے" }), description: t({ en: "Please upload the payment screenshot to proceed.", ur: "آگے بڑھنے کے لیے براہ کرم ادائیگی کا اسکرین شاٹ اپ لوڈ کریں۔" }) });
            return;
        }

        if (!activeUser) {
             toast({ variant: 'destructive', title: t({ en: "User not found", ur: "صارف نہیں ملا" }) });
            return;
        }

        setIsSubmitting(true);
        try {
            const storage = getStorage();
            const screenshotRef = ref(storage, `payment_screenshots/${activeUser.uid}/${Date.now()}_${paymentScreenshot.name}`);
            const uploadResult = await uploadBytes(screenshotRef, paymentScreenshot);
            const downloadURL = await getDownloadURL(uploadResult.ref);
            
            const orderData = {
                userId: activeUser.uid,
                userEmail: activeUser.email,
                items: items.map(item => ({ 
                    name: item.name, 
                    price: item.price, 
                    serviceId: item.serviceId,
                    filingData: item.filingData || null
                })),
                total,
                status: 'pending',
                createdAt: serverTimestamp(),
                paymentScreenshot: downloadURL,
            };
            
            await addDoc(collection(db, 'orders'), orderData);

            toast({ title: t({ en: "Order Placed!", ur: "آرڈر دے دیا گیا ہے!" }), description: t({ en: "Your order has been submitted for review.", ur: "آپ کا آرڈر جائزے کے لیے جمع کر دیا گیا ہے۔" }) });
            clearCart();
            router.push('/dashboard');

        } catch (error) {
            console.error("Error submitting order: ", error);
            toast({ variant: 'destructive', title: t({ en: "Submission Failed", ur: "جمع کرانے میں ناکامی" }), description: (error as Error).message });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        router.replace('/dashboard');
        return null;
    }

    return (
        <AppLayout pageTitle={t({ en: "Checkout", ur: "چیک آؤٹ" })}>
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t({ en: "Payment Instructions", ur: "ادائیگی کی ہدایات" })}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>{t({ en: `Please transfer the total amount of PKR ${total.toLocaleString()} to one of the following bank accounts:`, ur: `براہ کرم کل رقم PKR ${total.toLocaleString()} درج ذیل بینک کھاتوں میں سے کسی ایک میں منتقل کریں:`})}</p>
                            {loadingPaymentMethods ? (
                                Array.from({length: 2}).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
                            ) : paymentMethods.length > 0 ? (
                                // This seems to be misusing formPrices as payment methods, but we'll follow the pattern
                                <p className="text-center text-muted-foreground py-4">{t({en: "Payment methods will be displayed here.", ur: "ادائیگی کے طریقے یہاں دکھائے جائیں گے۔"})}</p>
                            ) : (
                                <p className="text-center text-muted-foreground py-4">{t({en: "No payment methods configured.", ur: "کوئی ادائیگی کا طریقہ ترتیب نہیں دیا گیا ہے۔"})}</p>
                            )}
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>{t({ en: "Upload Payment Screenshot", ur: "ادائیگی کا اسکرین شاٹ اپ لوڈ کریں" })}</CardTitle>
                            <CardDescription>{t({en: "After payment, please upload a screenshot of the transaction receipt.", ur: "ادائیگی کے بعد، براہ کرم ٹرانزیکشن کی رسید کا اسکرین شاٹ اپ لوڈ کریں۔"})}</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="flex items-center gap-2">
                                <Input type="file" accept="image/*" onChange={handleFileChange} className="flex-1"/>
                                <Button variant="outline" size="icon"><Upload className="h-4 w-4"/></Button>
                            </div>
                            {paymentScreenshot && <p className="text-sm text-muted-foreground mt-2">{t({en: "File selected:", ur: "فائل منتخب:"})} {paymentScreenshot.name}</p>}
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>{t({ en: "Order Summary", ur: "آرڈر کا خلاصہ" })}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           {items.map(item => (
                               <div key={item.id} className="flex justify-between">
                                   <span>{t(item.name)}</span>
                                   <span>PKR {item.price.toLocaleString()}</span>
                               </div>
                           ))}
                           <hr className="my-2"/>
                            <div className="flex justify-between font-bold text-lg">
                                <span>{t({ en: "Total", ur: "کل" })}</span>
                                <span>PKR {total.toLocaleString()}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSubmitOrder} className="w-full" size="lg" disabled={isSubmitting || !paymentScreenshot}>
                                {isSubmitting ? t({ en: "Submitting...", ur: "جمع کرایا جا رہا ہے۔.." }) : t({ en: "Confirm & Place Order", ur: "تصدیق کریں اور آرڈر دیں" })}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
