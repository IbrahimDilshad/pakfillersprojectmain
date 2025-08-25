
'use client';
import { useOrders, Order } from "@/hooks/useOrders";
import { useLanguage } from "@/context/language-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Eye } from "lucide-react";

export default function AdminOrdersPage() {
    const { t } = useLanguage();
    const { orders, loading } = useOrders(); // Fetches all orders

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t({ en: "Order Management", ur: "آرڈر مینجمنٹ" })}</CardTitle>
                <CardDescription>{t({ en: "View and manage all customer orders.", ur: "تمام کسٹمر آرڈرز دیکھیں اور ان کا نظم کریں۔" })}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t({ en: "Order ID", ur: "آرڈر آئی ڈی" })}</TableHead>
                            <TableHead>{t({ en: "User", ur: "صارف" })}</TableHead>
                            <TableHead>{t({ en: "Date", ur: "تاریخ" })}</TableHead>
                             <TableHead>{t({ en: "Items", ur: "آئٹمز" })}</TableHead>
                            <TableHead>{t({ en: "Total", ur: "کل" })}</TableHead>
                            <TableHead>{t({ en: "Status", ur: "حیثیت" })}</TableHead>
                            <TableHead className="text-right">{t({ en: "Actions", ur: "کارروائیاں" })}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                                </TableRow>
                            ))
                        ) : orders.length > 0 ? (
                            orders.map((order: Order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                    <TableCell>{order.userEmail}</TableCell>
                                    <TableCell>{format(order.createdAt.toDate(), 'PPP')}</TableCell>
                                     <TableCell>{order.items.length}</TableCell>
                                    <TableCell>PKR {order.total.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                            {t({ en: order.status, ur: order.status === 'pending' ? 'زیر التواء' : order.status === 'processing' ? 'پروسیسنگ' : 'مکمل' })}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {order.paymentScreenshot && (
                                            <Button asChild variant="ghost" size="icon">
                                                <Link href={order.paymentScreenshot} target="_blank">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24">
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
