
'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, ArrowUp, ArrowDown, MoveRight, Phone, Mail, MapPin, Twitter, Facebook, Linkedin, Instagram, PlayCircle, BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { LandingHeader } from '@/components/landing-header';
import { LandingFooter } from '@/components/landing-footer';
import { IncomeTaxCalculator } from '@/components/income-tax-calculator';
import { useVideos } from '@/hooks/useVideos';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { Skeleton } from '@/components/ui/skeleton';

const products = [
  { title: "NTN Registration", description: "Get your National Tax Number registered hassle-free.", buttonText: "Register Now" },
  { title: "Income Tax Filing", description: "File your annual income tax returns with our expert assistance.", buttonText: "File Now" },
  { title: "GST Registration", description: "Register for Goods and Services Tax (GST) with ease.", buttonText: "Get Started" },
  { title: "Business Incorporation", description: "Start your own company with our seamless incorporation services.", buttonText: "Incorporate" },
  { title: "Trademark Registration", description: "Protect your brand by registering your trademark.", buttonText: "Protect Brand" },
];

const teamMembers = [
    { name: "Ahmed Khan", designation: "Founder & CEO", image: "https://placehold.co/100x100.png" },
    { name: "Fatima Ali", designation: "Lead Tax Consultant", image: "https://placehold.co/100x100.png" },
    { name: "Zubair Ahmed", designation: "Head of Operations", image: "https://placehold.co/100x100.png" },
    { name: "Ayesha Malik", designation: "Client Relations", image: "https://placehold.co/100x100.png" },
];

const testimonials = [
    { text: "PakFiler made my tax filing process incredibly simple and stress-free. Highly recommended!", name: "Ali Raza", company: "Tech Solutions Inc." },
    { text: "The team is professional, responsive, and knowledgeable. They handled my business incorporation perfectly.", name: "Sana Ahmed", company: "Creative Designs" },
    { text: "I was struggling with my GST registration, but PakFiler guided me through every step. Excellent service!", name: "Usman Tariq", company: "Trade Enterprises" },
];

export default function LandingPage() {
    const { t } = useLanguage();
    const { videos, loading: videosLoading } = useVideos();
    const { posts, loading: postsLoading } = useBlogPosts();
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div className="bg-background text-foreground">
            {/* Announcement Banner */}
            <div className="bg-primary text-primary-foreground text-center text-sm py-1">
                <p>Limited Time Offer: Get 20% off on all tax filing services! <Link href="/services" className="underline">Learn More</Link></p>
            </div>

            <LandingHeader />

            <main>
                {/* Hero Section */}
                <section className="container mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                            Simplify Your Taxes, Amplify Your Savings
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            PakFiler is your trusted partner for all tax and corporate compliance needs in Pakistan. From NTN registration to income tax filing, we make it easy, fast, and secure.
                        </p>
                        <Button size="lg" asChild>
                           <Link href="/signup">Get Started <ArrowRight className="ml-2" /></Link>
                        </Button>
                    </div>
                    <div>
                        <Image src="https://placehold.co/600x400.png" alt="Tax filing illustration" width={600} height={400} className="rounded-lg shadow-xl" data-ai-hint="tax filing" />
                    </div>
                </section>

                {/* Income Tax Calculator */}
                <section className="bg-muted py-16 md:py-24">
                    <div className="container mx-auto px-6">
                         <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                            Quick Income Tax Calculator
                        </h2>
                        <IncomeTaxCalculator />
                    </div>
                </section>
                
                {/* Partners and Collaborators */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-6">
                        <h3 className="text-center text-2xl font-semibold text-muted-foreground mb-12">
                            Trusted by Leading Organizations
                        </h3>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-8 items-center">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Image key={i} src={`https://placehold.co/150x75.png`} alt={`Partner logo ${i+1}`} width={150} height={75} className="grayscale hover:grayscale-0 transition-all" data-ai-hint="company logo" />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mobile App CTA */}
                <section className="bg-primary text-primary-foreground">
                     <div className="container mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
                         <div>
                            <Image src="https://placehold.co/600x600.png" alt="PakFiler Mobile App" width={600} height={600} className="rounded-lg shadow-xl" data-ai-hint="mobile app screenshot" />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                                Manage Your Taxes On The Go
                            </h2>
                            <p className="text-lg opacity-90">
                                Download the PakFiler app for a seamless mobile experience. File taxes, upload documents, and get support, all from the palm of your hand.
                            </p>
                            <div className="flex gap-4">
                               <Button variant="secondary" size="lg" className="flex items-center gap-2">
                                    <Image src="https://placehold.co/32x32.png" alt="App Store" width={32} height={32} data-ai-hint="app store logo" />
                                    <span>App Store</span>
                               </Button>
                               <Button variant="secondary" size="lg" className="flex items-center gap-2">
                                     <Image src="https://placehold.co/32x32.png" alt="Play Store" width={32} height={32} data-ai-hint="google play logo" />
                                     <span>Play Store</span>
                               </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Popular Products */}
                 <section className="py-16 md:py-24">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                            Our Popular Services
                        </h2>
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full max-w-4xl mx-auto"
                        >
                            <CarouselContent>
                                {products.map((product, index) => (
                                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1">
                                    <Card className="flex flex-col h-full">
                                        <CardHeader>
                                            <CardTitle>{product.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <p className="text-muted-foreground">{product.description}</p>
                                        </CardContent>
                                        <div className="p-6 pt-0">
                                            <Button className="w-full" asChild>
                                                <Link href="/services">{product.buttonText}</Link>
                                            </Button>
                                        </div>
                                    </Card>
                                    </div>
                                </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
                            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
                        </Carousel>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="bg-muted py-16 md:py-24">
                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <Image src="https://placehold.co/500x500.png" alt="Happy customer" width={500} height={500} className="rounded-lg shadow-xl" data-ai-hint="happy customer" />
                        </div>
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-4xl font-bold">
                                What Our Clients Say
                            </h2>
                            <div className="relative">
                                <Card className="p-6 bg-background min-h-[180px]">
                                    <p className="text-muted-foreground mb-4">"{testimonials[currentTestimonial].text}"</p>
                                    <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                                    <div className="text-sm text-primary">{testimonials[currentTestimonial].company}</div>
                                </Card>
                                 <div className="absolute top-0 right-0 -mt-8 flex gap-2">
                                    <Button variant="outline" size="icon" onClick={prevTestimonial}><ArrowUp /></Button>
                                    <Button variant="outline" size="icon" onClick={nextTestimonial}><ArrowDown /></Button>
                                 </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Team */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                            Meet Our Experts
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {teamMembers.map(member => (
                                <div key={member.name} className="text-center space-y-2">
                                    <Avatar className="h-24 w-24 mx-auto border-4 border-primary/20">
                                        <AvatarImage src={member.image} alt={member.name} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <h4 className="font-semibold text-lg">{member.name}</h4>
                                    <p className="text-primary">{member.designation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Featured Videos & Blogs */}
                 <section className="bg-muted py-16 md:py-24">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                    <PlayCircle className="h-7 w-7 text-primary" />
                                    {t({ en: "Featured Videos", ur: "نمایاں ویڈیوز" })}
                                    </h2>
                                    <Link href="/videos">
                                        <Button variant="outline">
                                        {t({ en: "View More", ur: "مزید دیکھیں" })}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {videosLoading ? (
                                        Array.from({ length: 4 }).map((_, index) => (
                                            <Card key={index}>
                                            <Skeleton className="w-full aspect-video rounded-t-md" />
                                            <CardHeader className="p-4">
                                                <Skeleton className="h-5 w-3/4" />
                                            </CardHeader>
                                            </Card>
                                        ))
                                    ) : (
                                    videos.slice(0, 4).map((video) => {
                                        const videoId = video.src.split('embed/')[1];
                                        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
                                        return (
                                            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow text-sm">
                                                <div className="aspect-video">
                                                   <Image src={thumbnailUrl} alt={t(video.title)} width={300} height={225} className="w-full h-full object-cover" />
                                                </div>
                                                <CardHeader className="p-4">
                                                    <CardTitle className="text-base line-clamp-2">{t(video.title)}</CardTitle>
                                                </CardHeader>
                                            </Card>
                                        );
                                    })
                                    )}
                                </div>
                            </div>
                             <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                    <BookOpen className="h-7 w-7 text-primary" />
                                    {t({ en: "Latest From Our Blog", ur: "ہمارے بلاگ سے تازہ ترین" })}
                                    </h2>
                                    <Link href="/blog">
                                        <Button variant="outline">
                                        {t({ en: "View More", ur: "مزید دیکھیں" })}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {postsLoading ? (
                                    Array.from({ length: 4 }).map((_, index) => (
                                        <Card key={index}>
                                            <Skeleton className="w-full h-32" />
                                            <CardHeader className="p-4">
                                                <Skeleton className="h-5 w-3/4" />
                                            </CardHeader>
                                             <CardContent className="p-4 pt-0">
                                                 <Skeleton className="h-4 w-24" />
                                            </CardContent>
                                        </Card>
                                    ))
                                    ) : (
                                    posts.slice(0, 4).map((post) => (
                                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow text-sm">
                                        <Link href={post.href || '#'}>
                                            <Image src={post.image} alt={t(post.title)} width={300} height={200} className="w-full h-32 object-cover" data-ai-hint={post.hint} />
                                            <CardHeader className="p-4">
                                                <CardTitle className="text-base line-clamp-2">{t(post.title)}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0">
                                                 <Button variant="link" className="p-0 text-xs">
                                                    {t({ en: "Read More", ur: "مزید پڑھیں" })}
                                                    <ArrowRight className="ml-2 h-3 w-3" />
                                                </Button>
                                            </CardContent>
                                        </Link>
                                    </Card>
                                    ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <LandingFooter />

            {/* Cookies Popout */}
             <Card className="fixed bottom-4 right-4 w-full max-w-md p-4 shadow-2xl z-50">
                <CardContent className="p-0 flex items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
                    <Button>Accept</Button>
                </CardContent>
             </Card>

        </div>
    );
}
