
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, ShieldCheck } from "lucide-react";
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
import { useState, useEffect } from "react";
import type { Role, AuthUser } from "@/context/auth-context";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { adminNavItems } from "../../layout";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function ManagePermissionsDialog({ user, onPermissionsUpdate }: { user: UserProfile; onPermissionsUpdate: (userId: string, permissions: any) => void; }) {
    const { t } = useLanguage();
    const [permissions, setPermissions] = useState(user.permissions || {});
    const [isOpen, setIsOpen] = useState(false);

    const handlePermissionChange = (key: string, value: boolean) => {
        setPermissions(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        onPermissionsUpdate(user.uid, permissions);
        setIsOpen(false);
    };

    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm"><ShieldCheck className="mr-2 h-4 w-4" />{t({en: "Permissions", ur: "اجازتیں"})}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t({en: "Manage Permissions for", ur: "کے لیے اجازتوں کا نظم کریں"})} {user.displayName}</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    {adminNavItems.map(item => (
                        <div key={item.permissionKey} className="flex items-center space-x-2">
                           <Checkbox 
                                id={`${user.uid}-${item.permissionKey}`}
                                checked={permissions[item.permissionKey as keyof typeof permissions] || false}
                                onCheckedChange={(checked) => handlePermissionChange(item.permissionKey, !!checked)}
                           />
                           <Label htmlFor={`${user.uid}-${item.permissionKey}`}>{t(item.label)}</Label>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">{t({en: "Cancel", ur: "منسوخ"})}</Button>
                    </DialogClose>
                    <Button onClick={handleSave}>{t({en: "Save", ur: "محفوظ کریں"})}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function AdminUsersPage() {
  const { t } = useLanguage();
  const { users, loading, setUsers } = useAllUsers();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  const router = useRouter();

  const isSuperAdmin = currentUser?.email === 'admin@example.com';

  useEffect(() => {
    if (!isSuperAdmin) {
        router.push('/admin');
    }
  }, [isSuperAdmin, router]);


  const handleRoleChange = async (userId: string, newRole: Role) => {
    setIsUpdating(userId);
    try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, { role: newRole });
        
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

  const handlePermissionsUpdate = async (userId: string, permissions: any) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, { permissions });
        
        setUsers(prevUsers => 
            prevUsers.map(u => u.uid === userId ? { ...u, permissions } : u)
        );
        toast({ title: "Success", description: "Permissions updated successfully."});
    } catch (error) {
         console.error("Error updating permissions:", error);
        toast({ variant: 'destructive', title: "Error", description: "Failed to update permissions."});
    }
  }

  if (!isSuperAdmin) {
    return <p>Access Denied.</p>;
  }

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
                  <TableHead>{t({en: "Role", ur: "کردار"})}</TableHead>
                  <TableHead className="text-right">{t({en: "Actions", ur: "کاروائیاں"})}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({length: 5}).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                       <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : users.map(user => (
                  <TableRow key={user.uid}>
                    <TableCell>{user.displayName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.createdAt ? format(user.createdAt.toDate(), 'PPP') : 'N/A'}</TableCell>
                    <TableCell>
                        <Select 
                            value={user.role} 
                            onValueChange={(newRole: Role) => handleRoleChange(user.uid, newRole)}
                            disabled={isUpdating === user.uid || user.email === 'admin@example.com'}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="accountant">Accountant</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </TableCell>
                     <TableCell className="text-right">
                        {user.role === 'admin' && user.email !== 'admin@example.com' && (
                           <ManagePermissionsDialog user={user} onPermissionsUpdate={handlePermissionsUpdate} />
                        )}
                     </TableCell>
                  </TableRow>
                ))}
              </TableBody>
           </Table>
        </CardContent>
      </Card>
  );
}
