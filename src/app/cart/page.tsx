
'use client';

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/context/language-context";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Dummy data for cart items
const initialCartItems = [
  { id: '1', name: { en: 'Sole Proprietor Registration', ur: 'سول پروپرائٹر رجسٹریشن' }, price: 5000 },
  { id: '2', name: { en: 'NTN Registration', ur: 'این ٹی این رجسٹریشن' }, price: 2500 },
];

export default function CartPage() {
    const { t } = useLanguage();
    const { toast } = useToast();
    // In a real app, this state would be managed by a global context or state manager
    const [cartItems, setCartItems] = React.useState(initialCartItems);

    const total = cartItems.reduce((acc, item) => acc + item.price, 0);
    
    const handleRemoveItem = (id: string) => {
        setCartItems(cartItems.filter(item => item.id !== id));
        toast({
            title: "Item Removed",
            description: "The item has been removed from your cart.",
        });
    };

    const handleCheckout = () => {
        toast({
            title: "Proceeding to Checkout",
            description: "This feature is under construction.",
        });
    };

    return (
        <AppLayout pageTitle={t({ en: "Shopping Cart", ur: "شاپنگ کارٹ" })}>
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>{t({ en: "Your Cart", ur: "آپ کی کارٹ" })}</CardTitle>
                        <CardDescription>{t({ en: `You have ${cartItems.length} items in your cart.`, ur: `آپ کی کارٹ میں ${cartItems.length} آئٹمز ہیں۔` })}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t({ en: "Service", ur: "سروس" })}</TableHead>
                                    <TableHead className="text-right">{t({ en: "Price", ur: "قیمت" })}</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cartItems.length === 0 ? (
                                     <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                            {t({ en: "Your cart is empty.", ur: "آپ کی کارٹ خالی ہے۔" })}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    cartItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{t(item.name)}</TableCell>
                                            <TableCell className="text-right">PKR {item.price.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    {cartItems.length > 0 && (
                        <CardFooter className="flex justify-between items-center bg-muted/50 p-6 rounded-b-lg">
                            <div className="text-lg font-semibold">
                                {t({ en: "Total:", ur: "کل:" })}
                                <span className="ml-2">PKR {total.toLocaleString()}</span>
                            </div>
                            <Button onClick={handleCheckout} size="lg">{t({ en: "Proceed to Checkout", ur: "چیک آؤٹ پر جائیں" })}</Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
