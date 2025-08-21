
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { useOrders } from "@/hooks/useOrders";
import { useAllUsers } from "@/hooks/useAllUsers";
import { Skeleton } from "@/components/ui/skeleton";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/context/auth-context";
import { useMemo } from "react";
import { format, subDays } from "date-fns";

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { orders, loading: ordersLoading } = useOrders(); // Fetch all orders for admin
  const { users, loading: usersLoading } = useAllUsers();
  const { sessions, loading: chatLoading } = useChat(user?.uid, user?.role);

  const loading = ordersLoading || usersLoading || chatLoading;

  const totalRevenue = useMemo(() => orders.reduce((acc, order) => acc + order.total, 0), [orders]);
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const activeChats = sessions.filter(s => !s.isReadByAdmin).length;

  const chartData = useMemo(() => {
    const data = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), i);
        return {
            date: format(date, 'MMM dd'),
            revenue: 0,
        };
    }).reverse();

    orders.forEach(order => {
        const orderDateStr = format(order.createdAt.toDate(), 'MMM dd');
        const dataEntry = data.find(d => d.date === orderDateStr);
        if (dataEntry) {
            dataEntry.revenue += order.total;
        }
    });

    return data;
  }, [orders]);
  
  const orderStatusData = useMemo(() => {
    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return [
        { name: t({en: 'Pending', ur: 'زیر التواء'}), count: statusCounts.pending || 0 },
        { name: t({en: 'Processing', ur: 'پروسیسنگ'}), count: statusCounts.processing || 0 },
        { name: t({en: 'Completed', ur: 'مکمل'}), count: statusCounts.completed || 0 },
    ];
  }, [orders, t]);


  return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">{t({ en: "Admin Dashboard", ur: "ایڈمن ڈیش بورڈ" })}</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t({en: "Total Revenue", ur: "کل آمدنی"})}</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-3/4" /> : (
                         <div className="text-2xl font-bold">PKR {totalRevenue.toLocaleString()}</div>
                    )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t({en: "Total Orders", ur: "کل آرڈرز"})}</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     {loading ? <Skeleton className="h-8 w-3/4" /> : (
                        <div className="text-2xl font-bold">{totalOrders}</div>
                     )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t({en: "Total Users", ur: "کل صارفین"})}</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-8 w-3/4" /> : (
                        <div className="text-2xl font-bold">{totalUsers}</div>
                    )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t({en: "Active Chats", ur: "فعال چیٹس"})}</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     {loading ? <Skeleton className="h-8 w-3/4" /> : (
                        <div className="text-2xl font-bold">{activeChats}</div>
                     )}
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                 <CardHeader>
                    <CardTitle>{t({en: "Revenue - Last 7 Days", ur: "آمدنی - پچھلے 7 دن"})}</CardTitle>
                 </CardHeader>
                 <CardContent>
                    {loading ? <Skeleton className="h-[300px] w-full" /> : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `PKR ${Number(value) / 1000}k`} />
                                <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                                <Legend iconType="circle" />
                                <Bar dataKey="revenue" fill="hsl(var(--primary))" name={t({en: 'Revenue', ur: 'آمدنی'})} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                 </CardContent>
            </Card>
             <Card className="lg:col-span-3">
                 <CardHeader>
                    <CardTitle>{t({en: "Orders by Status", ur: "آرڈرز بلحاظ حیثیت"})}</CardTitle>
                    <CardDescription>{t({en: "A summary of all order statuses.", ur: "تمام آرڈر کی حیثیت کا خلاصہ۔"})}</CardDescription>
                 </CardHeader>
                 <CardContent>
                     {loading ? <Skeleton className="h-[300px] w-full" /> : (
                        <ResponsiveContainer width="100%" height={300}>
                             <BarChart data={orderStatusData} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                                <Legend iconType="circle" />
                                <Bar dataKey="count" fill="hsl(var(--primary))" name={t({en: 'Count', ur: 'تعداد'})} radius={[0, 4, 4, 0]} background={{ fill: 'hsl(var(--secondary))', radius: 4 }} />
                            </BarChart>
                        </ResponsiveContainer>
                     )}
                 </CardContent>
            </Card>
        </div>
      </div>
  );
}

