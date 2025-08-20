
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, User, ShoppingCart, MessageSquare, Paperclip, Send } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AuthUser } from '@/context/auth-context';

interface Order {
    id: string;
    userId: string;
    userEmail: string;
    items: { name: { en: string, ur: string }; price: number }[];
    total: number;
    status: 'pending' | 'processing' | 'completed';
    createdAt: any;
    paymentScreenshot?: string; // Should be a URL
}

export default function OrderDetailsPage() {
    const { t } = useLanguage();
    const params = useParams();
    const router = useRouter();
    const { orderId } = params;
    const { toast } = useToast();

    const [order, setOrder] = useState<Order | null>(null);
    const [customer, setCustomer] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchOrderAndCustomer = async () => {
            if (!orderId) return;
            setLoading(true);
            try {
                const orderDocRef = doc(db, 'orders', orderId as string);
                const orderDocSnap = await getDoc(orderDocRef);

                if (orderDocSnap.exists()) {
                    const orderData = { id: orderDocSnap.id, ...orderDocSnap.data() } as Order;
                    setOrder(orderData);

                    // Fetch customer details
                    const userDocRef = doc(db, 'users', orderData.userId);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        setCustomer(userDocSnap.data() as AuthUser);
                    }
                } else {
                    toast({ variant: 'destructive', title: 'Order not found' });
                }
            } catch (error) {
                console.error("Error fetching order details:", error);
                toast({ variant: 'destructive', title: 'Failed to fetch details' });
            } finally {
                setLoading(false);
            }
        };

        fetchOrderAndCustomer();
    }, [orderId, toast]);
    
    const handleSendMessage = async () => {
        if (!message.trim() || !order) {
            return;
        }
        try {
            await addDoc(collection(db, 'notifications'), {
                userId: order.userId,
                message,
                orderId: order.id,
                isRead: false,
                createdAt: serverTimestamp(),
            });
            toast({ title: "Message Sent", description: "The client has been notified." });
            setMessage('');
        } catch(error) {
            toast({ variant: 'destructive', title: "Error", description: "Failed to send message."})
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-1/4" />
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                    <div>
                        <Skeleton className="h-72 w-full" />
                    </div>
                </div>
            </div>
        );
    }
    
    if (!order) {
        return <p>{t({en: 'Order not found.', ur: 'آرڈر نہیں ملا۔'})}</p>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{t({en: "Order Details", ur: "آرڈر کی تفصیلات"})}</h1>
                    <p className="text-muted-foreground font-mono text-xs">{order.id}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                             <ShoppingCart className="h-6 w-6"/>
                            <CardTitle>{t({en: "Order Summary", ur: "آرڈر کا خلاصہ"})}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-2">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span>{t(item.name)}</span>
                                        <span className="font-medium">PKR {item.price.toLocaleString()}</span>
                                    </div>
                                ))}
                             </div>
                             <Separator className="my-4" />
                              <div className="flex justify-between items-center font-bold text-lg">
                                <span>{t({en: "Total", ur: "کل"})}</span>
                                <span>PKR {order.total.toLocaleString()}</span>
                            </div>
                        </CardContent>
                         <CardFooter className="flex justify-between items-center">
                             <div className="text-sm text-muted-foreground">
                                {t({en: "Order placed on:", ur: "آرڈر دیا گیا:"})} {format(order.createdAt.toDate(), 'PPP p')}
                            </div>
                            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>{t({en: order.status, ur: order.status === 'pending' ? 'زیر التواء' : order.status === 'processing' ? 'پروسیسنگ' : 'مکمل'})}</Badge>
                         </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                             <MessageSquare className="h-6 w-6"/>
                            <CardTitle>{t({en: "Send Message to Client", ur: "کلائنٹ کو پیغام بھیجیں"})}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <Textarea 
                                placeholder={t({en: "Type your message here...", ur: "اپنا پیغام یہاں ٹائپ کریں..."})}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                           />
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSendMessage} disabled={!message.trim()}>
                                <Send className="mr-2"/>
                                {t({en: "Send Message", ur: "پیغام بھیجیں"})}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
                 <div className="space-y-6">
                    <Card>
                         <CardHeader className="flex flex-row items-center gap-4">
                             <User className="h-6 w-6"/>
                            <CardTitle>{t({en: "Client Information", ur: "کلائنٹ کی معلومات"})}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p><strong>{t({en: "Name:", ur: "نام:"})}</strong> {customer?.displayName}</p>
                            <p><strong>{t({en: "Email:", ur: "ای میل:"})}</strong> {customer?.email}</p>
                            <p><strong>{t({en: "Phone:", ur: "فون:"})}</strong> {customer?.mobileNumber || 'N/A'}</p>
                            <p><strong>{t({en: "CNIC:", ur: "شناختی کارڈ:"})}</strong> {customer?.cnic || 'N/A'}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                             <Paperclip className="h-6 w-6"/>
                            <CardTitle>{t({en: "Attachments", ur: "منسلکات"})}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {order.paymentScreenshot ? (
                                <div>
                                    <p className="text-sm font-medium mb-2">{t({en: "Payment Screenshot", ur: "ادائیگی کا اسکرین شاٹ"})}</p>
                                    <Image src={order.paymentScreenshot} alt="Payment Screenshot" width={300} height={200} className="rounded-md border"/>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">{t({en: "No attachments found.", ur: "کوئی منسلکات نہیں ملے۔"})}</p>
                            )}
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </div>
    );
}

