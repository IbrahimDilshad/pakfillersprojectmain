
'use client';

import { useAllUsers } from "@/hooks/useAllUsers";
import { useOrders } from "@/hooks/useOrders";
import { useServices } from "@/hooks/useServices";
import { useLanguage } from "@/context/language-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, ShoppingCart, DollarSign, BarChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', total: 1200 },
  { name: 'Feb', total: 2100 },
  { name: 'Mar', total: 800 },
  { name: 'Apr', total: 1600 },
  { name: 'May', total: 900 },
  { name: 'Jun', total: 1700 },
];

export default function AdminDashboardPage() {
    const { t } = useLanguage();
    const { users, loading: usersLoading } = useAllUsers();
    const { orders, loading: ordersLoading } = useOrders();
    const { services, loading: servicesLoading } = useServices();

    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">{t({ en: "Admin Dashboard", ur: "ایڈمن ڈیش بورڈ" })}</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t({ en: "Total Revenue", ur: "کل آمدنی" })}</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">PKR {totalRevenue.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t({ en: "Total Orders", ur: "کل آرڈرز" })}</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orders.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t({ en: "Registered Users", ur: "رجسٹرڈ صارفین" })}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t({ en: "Active Services", ur: "فعال خدمات" })}</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{services.length}</div>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{t({ en: "Revenue Overview", ur: "آمدنی کا جائزہ" })}</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                     <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
