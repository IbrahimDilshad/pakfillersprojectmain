
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";
import { useLanguage } from "@/context/language-context";

export function TopNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const userNavItems = [
    { href: "/dashboard", title: { en: "Dashboard", ur: "ڈیش بورڈ" } },
    { href: "/filing", title: { en: "Tax Filing", ur: "ٹیکس فائلنگ" } },
    { href: "/documents", title: { en: "Documents", ur: "دستاویزات" } },
    { href: "/profile", title: { en: "IRIS Profile", ur: "IRIS پروفائل" } },
    { href: "/services", title: { en: "Service Charges", ur: "سروس چارجز" } },
  ];

  const accountantNavItems = [
    { href: "/accountant/review", title: {en: "Review Documents", ur: "دستاویزات کا جائزہ لیں"}, description: {en: "Review and approve user-submitted documents.", ur: "صارف کی جمع کردہ دستاویزات کا جائزہ لیں اور منظور کریں۔"} },
    { href: "/accountant/process", title: {en: "Process Filings", ur: "فائلنگ پر کارروائی کریں"}, description: {en: "Process client tax filings.", ur: "کلائنٹ ٹیکس فائلنگ پر کارروائی کریں۔"} },
    { href: "/accountant/reports", title: {en: "Generate Reports", ur: "رپورٹس بنائیں"}, description: {en: "Provide powerful report generation tools.", ur: "طاقتور رپورٹ جنریشن ٹولز فراہم کریں۔"} },
  ];

  const adminNavItems = [
    { href: "/admin/users", title: {en: "User Management", ur: "صارف کا انتظام"}, description: {en: "Admin dashboard for managing users.", ur: "صارفین کے انتظام کے لیے ایڈمن ڈیش بورڈ۔"} },
    { href: "/admin/chat", title: {en: "Chat", ur: "چیٹ"}, description: {en: "Chat with users in real-time.", ur: "صارفین کے ساتھ حقیقی وقت میں چیٹ کریں۔"} },
    { href: "/admin/config", title: {en: "System Configuration", ur: "سسٹم کنفیگریشن"}, description: {en: "Tools for system-wide configuration.", ur: "سسٹم وسیع کنفیگریشن کے لیے ٹولز۔"} },
    { href: "/admin/reports", title: {en: "Reports Generation", ur: "رپورٹس جنریشن"}, description: {en: "Generate system-level reports.", ur: "سسٹم سطح کی رپورٹس بنائیں۔"} },
    { href: "/admin/content", title: {en: "Content Management", ur: "مواد کا انتظام"}, description: {en: "Manage site content like FAQs.", ur: "سائٹ کے مواد جیسے اکثر پوچھے گئے سوالات کا نظم کریں۔"} },
  ];


  return (
    <NavigationMenu>
      <NavigationMenuList>
        {userNavItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <Link href={item.href} legacyBehavior passHref>
              <NavigationMenuLink active={pathname.startsWith(item.href)} className={navigationMenuTriggerStyle()}>
                {t(item.title)}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          <NavigationMenuTrigger>{t({en: "Accountant", ur: "اکاؤنٹنٹ"})}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {accountantNavItems.map((component) => (
                <ListItem
                  key={t(component.title)}
                  title={t(component.title)}
                  href={component.href}
                >
                  {t(component.description)}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{t({en: "Admin", ur: "ایڈمن"})}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {adminNavItems.map((component) => (
                <ListItem
                  key={t(component.title)}
                  title={t(component.title)}
                  href={component.href}
                >
                  {t(component.description)}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
