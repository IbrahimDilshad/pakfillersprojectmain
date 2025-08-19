
'use client';
import Link from 'next/link';
import { Logo } from './logo';
import { Phone, Mail, MapPin, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';

export function LandingFooter() {
    return (
        <footer className="bg-secondary text-secondary-foreground">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Stay Connected */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Stay Connected</h3>
                        <p className="text-sm opacity-80">Follow us on social media for the latest updates and tax news.</p>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-primary"><Twitter /></Link>
                            <Link href="#" className="hover:text-primary"><Facebook /></Link>
                            <Link href="#" className="hover:text-primary"><Linkedin /></Link>
                            <Link href="#" className="hover:text-primary"><Instagram /></Link>
                        </div>
                    </div>

                    {/* Need Support? */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Need Support?</h3>
                        <ul className="space-y-2 text-sm opacity-80">
                            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@pakfiler.com</li>
                            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +92 300 1234567</li>
                        </ul>
                    </div>

                    {/* Locate Us */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Locate Us</h3>
                         <p className="flex gap-2 text-sm opacity-80">
                            <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                            <span>123 Business Avenue, Karachi, Pakistan</span>
                         </p>
                    </div>

                    {/* About */}
                     <div className="space-y-4">
                        <h3 className="font-semibold text-lg">About PakFiler</h3>
                         <p className="text-sm opacity-80">
                            PakFiler is a leading digital platform dedicated to simplifying tax and corporate compliance for individuals and businesses across Pakistan.
                         </p>
                    </div>
                </div>
                 <div className="border-t border-secondary-foreground/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p className="opacity-80">&copy; {new Date().getFullYear()} PakFiler (Pvt.) Limited. All Rights Reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <Link href="#" className="opacity-80 hover:opacity-100">Privacy Policy</Link>
                        <Link href="#" className="opacity-80 hover:opacity-100">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
