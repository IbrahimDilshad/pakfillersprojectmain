
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/context/language-context";
import { db } from '@/lib/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from "@/hooks/useOrders";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AdminOrdersPage() {
  const { t } = useLanguage();
  const { orders, loading } = useOrders();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (orderId: string) => deleteDoc(doc(db, 'orders', orderId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({ title: 'Order Deleted', description: 'The order has been successfully deleted.' });
    },
    onError: (error) => {
      console.error("Error deleting order: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete the order.' });
    }
  });

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
              <TableHead className="text-right">{t({ en: "Actions", ur: "کاروائیاں" })}</TableHead>
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
                  <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            ) : orders.length > 0 ? (
              orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id}</TableCell>
                  <TableCell>{order.userEmail}</TableCell>
                  <TableCell>{format(order.createdAt.toDate(), 'PPP')}</TableCell>
                  <TableCell>PKR {order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                        {t({en: order.status, ur: order.status === 'pending' ? 'زیر التواء' : order.status === 'processing' ? 'پروسیسنگ' : 'مکمل'})}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                     <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                        </Button>
                     </Link>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" disabled={deleteMutation.isPending}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>{t({en: "Are you sure?", ur: "کیا آپ کو یقین ہے؟"})}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t({en: "This action cannot be undone. This will permanently delete the order.", ur: "یہ عمل واپس نہیں کیا جا سکتا۔ یہ آرڈر مستقل طور پر حذف ہو جائے گا۔"})}
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>{t({en: "Cancel", ur: "منسوخ کریں"})}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate(order.id)}>{t({en: "Delete", ur: "حذف کریں"})}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
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
