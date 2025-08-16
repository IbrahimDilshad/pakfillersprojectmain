'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter
} from "@/components/ui/sidebar";
import {
  FileText,
  LayoutDashboard,
  Users,
  Settings,
  User,
  FileUp,
  CreditCard,
  Briefcase,
  FileSearch,
  BookUser,
  FileCog,
  BarChart,
  HelpCircle,
  LogOut,
  FileSignature,
} from "lucide-react";

const userNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/filing", label: "Tax Filing", icon: FileSignature },
  { href: "/documents", label: "Documents", icon: FileUp },
  { href: "/profile", label: "IRIS Profile", icon: User },
  { href: "/services", label: "Service Charges", icon: CreditCard },
];

const accountantNavItems = [
  { href: "/accountant/review", label: "Review Documents", icon: FileSearch },
  { href: "/accountant/process", label: "Process Filings", icon: Briefcase },
  { href: "/accountant/reports", label: "Generate Reports", icon: BarChart },
];

const adminNavItems = [
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/config", label: "System Configuration", icon: Settings },
  { href: "/admin/reports", label: "Reports Generation", icon: BarChart },
  { href: "/admin/content", label: "Content Management", icon: FileCog },
];

export function SidebarNav() {
  const pathname = usePathname();

  const renderNav = (items: typeof userNavItems) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton asChild isActive={pathname === item.href}>
              <a>
                <item.icon />
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
                <FileText className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold text-primary">PakFiler</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Personal</SidebarGroupLabel>
          {renderNav(userNavItems)}
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Accountant Tools</SidebarGroupLabel>
          {renderNav(accountantNavItems)}
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          {renderNav(adminNavItems)}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
              <Link href="#" passHref>
                <SidebarMenuButton asChild>
                  <a><HelpCircle /><span>Help & Feedback</span></a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/">
                    <SidebarMenuButton asChild>
                        <a><LogOut /><span>Logout</span></a>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
