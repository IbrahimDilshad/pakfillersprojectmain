
'use client';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { useOrders, Order } from '@/hooks/useOrders';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Skeleton } from './ui/skeleton';
import { format } from 'date-fns';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Link from 'next/link';
import { Eye } from 'lucide-react';

export function PaymentHistoryTab() {
  const { t } = useLanguage();
  const { activeUser } = useAuth();
  const { orders, loading } = useOrders(activeUser?.uid);

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium mb-4">{t({ en: "Your Payment History", ur: "آپ کی ادائیگی کی تاریخ" })}</h3>
      <CardDescription className="mb-6">{t({en: 'Here is a list of all transactions and orders you have made.', ur: 'یہاں آپ کی تمام ٹرانزیکشنز اور آرڈرز کی فہرست ہے۔'})}</CardDescription>
      <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t({ en: "Order ID", ur: "آرڈر آئی ڈی" })}</TableHead>
              <TableHead>{t({ en: "Date", ur: "تاریخ" })}</TableHead>
              <TableHead>{t({ en: "Total", ur: "کل رقم" })}</TableHead>
              <TableHead>{t({ en: "Status", ur: "حیثیت" })}</TableHead>
              <TableHead className="text-right">{t({ en: "Actions", ur: "کاروائیاں" })}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-10" /></TableCell>
                </TableRow>
              ))
            ) : orders.length > 0 ? (
              orders.map((order: Order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id}</TableCell>
                  <TableCell>{format(order.createdAt.toDate(), 'PPP')}</TableCell>
                  <TableCell>PKR {order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                        {t({en: order.status, ur: order.status === 'pending' ? 'زیر التواء' : order.status === 'processing' ? 'پروسیسنگ' : 'مکمل'})}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     {/* This link will eventually lead to a user-facing order details page */}
                     <Button variant="outline" size="icon" asChild>
                        <Link href="#">
                            <Eye className="h-4 w-4" />
                        </Link>
                     </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  {t({ en: "No payment history found.", ur: "کوئی ادائیگی کی تاریخ نہیں ملی۔" })}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
    </div>
  );
}
