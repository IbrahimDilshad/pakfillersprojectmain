
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/context/language-context";
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { format }s from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Order {
    id: string;
    userId: string;
    userEmail: string;
    items: { name: string; price: number }[];
    total: number;
    status: 'pending' | 'processing' | 'completed';
    createdAt: Timestamp;
}

export default function AdminOrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersCollection = collection(db, 'orders');
        const q = query(ordersCollection, orderBy('createdAt', 'desc'));
        const ordersSnapshot = await getDocs(q);
        const ordersList = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Order));
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t({ en: "Manage Orders", ur: "آرڈرز کا نظم کریں" })}</CardTitle>
        <CardDescription>{t({ en: "View and manage all customer orders.", ur: "تمام کسٹمر آرڈرز دیکھیں اور ان کا نظم کریں۔" })}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t({ en: "Order ID", ur: "آرڈر آئی ڈی" })}</TableHead>
              <TableHead>{t({ en: "Customer", ur: "کسٹمر" })}</TableHead>
              <TableHead>{t({ en: "Date", ur: "تاریخ" })}</TableHead>
              <TableHead>{t({ en: "Total", ur: "کل رقم" })}</TableHead>
              <TableHead>{t({ en: "Status", ur: "حیثیت" })}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : orders.length > 0 ? (
              orders.map(order => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-mono text-xs">{order.id}</TableCell>
                  <TableCell>{order.userEmail}</TableCell>
                  <TableCell>{format(order.createdAt.toDate(), 'PPP')}</TableCell>
                  <TableCell>PKR {order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                        {t({en: order.status, ur: order.status})}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  {t({ en: "No orders found.", ur: "کوئی آرڈر نہیں ملا۔" })}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
