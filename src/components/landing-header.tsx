
'use client';
import Link from 'next/link';
import { Button } from './ui/button';
import { Logo } from './logo';
import { useLanguage } from '@/context/language-context';
import { LanguageSwitcher } from './language-switcher';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { UserNav } from './user-nav';

const navItems = [
    { title: { en: "Services", ur: "خدمات" }, href: "/services", loginRequired: true },
    { title: { en: "Calculator", ur: "کیلکولیٹر" }, href: "/salary-tax-calculator", loginRequired: false },
    { title: { en: "Blog", ur: "بلاگ" }, href: "/blog", loginRequired: false },
    { title: { en: "Videos", ur: "ویڈیوز" }, href: "/videos", loginRequired: false },
    { title: { en: "FAQs", ur: "اکثر سوالات" }, href: "/faqs", loginRequired: false },
];

export function LandingHeader() {
    const { t } = useLanguage();
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleNavClick = (href: string, loginRequired: boolean) => (e: React.MouseEvent) => {
        if (loginRequired && !user) {
            e.preventDefault();
            toast({
                title: "Login Required",
                description: "You need to log in to access this page.",
                variant: "destructive",
            });
            router.push('/login');
        }
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center px-6">
                <Link href="/" className="flex items-center gap-2 mr-auto">
                    <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <Logo className="h-6 w-6" />
                    </div>
                    <span className="text-lg font-semibold text-primary">PakFiler</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map(item => (
                        <Link 
                            key={t(item.title)} 
                            href={item.href}
                            onClick={handleNavClick(item.href, item.loginRequired)}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            {t(item.title)}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-2 ml-auto">
                    <LanguageSwitcher />
                    {!loading && (
                        <>
                            {user ? (
                                <UserNav />
                            ) : (
                                <>
                                    <Button variant="ghost" asChild className="hidden md:inline-flex">
                                        <Link href="/login">Log In</Link>
                                    </Button>
                                    <Button asChild className="hidden md:inline-flex">
                                        <Link href="/signup">Sign Up</Link>
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                     <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {navItems.map(item => (
                                    <DropdownMenuItem key={t(item.title)} asChild>
                                         <Link 
                                            href={item.href}
                                            onClick={handleNavClick(item.href, item.loginRequired)}
                                        >
                                            {t(item.title)}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem asChild>
                                    <Link href="/login">Log In</Link>
                                </DropdownMenuItem>
                                 <DropdownMenuItem asChild>
                                    <Link href="/signup">Sign Up</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}

    