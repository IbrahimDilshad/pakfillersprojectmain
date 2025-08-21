
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useAllUsers } from "@/hooks/useAllUsers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
  const { t } = useLanguage();
  const { users, loading } = useAllUsers();

  return (
      <Card>
        <CardHeader>
          <CardTitle>{t({ en: "User Management", ur: "صارف کا انتظام" })}</CardTitle>
          <CardDescription>{t({ en: "View and manage all registered users.", ur: "تمام رجسٹرڈ صارفین کو دیکھیں اور ان کا نظم کریں۔" })}</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t({en: "Name", ur: "نام"})}</TableHead>
                  <TableHead>{t({en: "Email", ur: "ای میل"})}</TableHead>
                  <TableHead>{t({en: "Role", ur: "کردار"})}</TableHead>
                  <TableHead>{t({en: "Joined On", ur: "شمولیت کی تاریخ"})}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({length: 5}).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    </TableRow>
                  ))
                ) : users.map(user => (
                  <TableRow key={user.uid}>
                    <TableCell>{user.displayName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge></TableCell>
                    <TableCell>{user.createdAt ? format(user.createdAt.toDate(), 'PPP') : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
           </Table>
        </CardContent>
      </Card>
  );
}
