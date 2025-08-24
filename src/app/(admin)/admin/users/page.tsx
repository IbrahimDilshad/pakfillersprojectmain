
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useAllUsers, UserProfile } from "@/hooks/useAllUsers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import type { Role } from "@/context/auth-context";

export default function AdminUsersPage() {
  const { t } = useLanguage();
  const { users, loading, setUsers } = useAllUsers();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    setIsUpdating(userId);
    try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, { role: newRole });
        
        // Optimistically update UI
        setUsers(prevUsers => 
            prevUsers.map(u => u.uid === userId ? { ...u, role: newRole } : u)
        );

        toast({ title: "Success", description: "User role updated successfully."});
    } catch (error) {
        console.error("Error updating user role:", error);
        toast({ variant: 'destructive', title: "Error", description: "Failed to update user role."});
    } finally {
        setIsUpdating(null);
    }
  };

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
                  <TableHead>{t({en: "Joined On", ur: "شمولیت کی تاریخ"})}</TableHead>
                  <TableHead className="text-right">{t({en: "Role", ur: "کردار"})}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({length: 5}).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : users.map(user => (
                  <TableRow key={user.uid}>
                    <TableCell>{user.displayName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.createdAt ? format(user.createdAt.toDate(), 'PPP') : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                        <Select 
                            value={user.role} 
                            onValueChange={(newRole: Role) => handleRoleChange(user.uid, newRole)}
                            disabled={isUpdating === user.uid}
                        >
                            <SelectTrigger className="w-[120px] ml-auto">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="accountant">Accountant</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
           </Table>
        </CardContent>
      </Card>
  );
}

