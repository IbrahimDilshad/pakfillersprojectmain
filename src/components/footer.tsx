import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <p className="text-xs text-muted-foreground">
          © 2025 Befiler (Pvt.) Limited
        </p>
        <nav className="flex items-center gap-4">
          <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
            T&C
          </Link>
          <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
