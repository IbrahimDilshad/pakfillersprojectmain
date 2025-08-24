
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Language } from './language-context';
import { useAuth } from './auth-context';

export interface CartItem {
    id: string; // Unique ID for the cart item instance
    serviceId: string; // ID of the service/form from the DB
    name: { [key in Language]: string };
    price: number;
    filingData?: any; // To hold data from multi-step forms
}

interface AddToCartPayload {
    serviceId: string;
    name: { [key in Language]: string };
    price: number;
    filingData?: any;
}


interface CartContextType {
    items: CartItem[];
    addItem: (service: AddToCartPayload) => void;
    removeItem: (itemId: string) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const { activeUser } = useAuth();
    
    // Effect to load cart from localStorage when the activeUser changes
    useEffect(() => {
        if (activeUser?.uid) {
            const cartId = `pakfiler-cart-${activeUser.uid}`;
            const savedCart = localStorage.getItem(cartId);
            if (savedCart) {
                setItems(JSON.parse(savedCart));
            } else {
                setItems([]); // Clear cart for new user
            }
        } else {
            setItems([]); // Clear cart if no user is logged in
        }
    }, [activeUser]);

    // Effect to save cart to localStorage whenever items change
    useEffect(() => {
        if (activeUser?.uid) {
            const cartId = `pakfiler-cart-${activeUser.uid}`;
            localStorage.setItem(cartId, JSON.stringify(items));
        }
    }, [items, activeUser]);

    const addItem = (service: AddToCartPayload) => {
        if (!activeUser) return;
        const newItem: CartItem = {
            ...service,
            id: `${service.serviceId}-${Date.now()}`,
        };
        setItems(prevItems => [...prevItems, newItem]);
    };

    const removeItem = (itemId: string) => {
         if (!activeUser) return;
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const clearCart = () => {
         if (!activeUser) return;
        setItems([]);
         const cartId = `pakfiler-cart-${activeUser.uid}`;
        localStorage.removeItem(cartId);
    };
    
    const total = items.reduce((sum, item) => sum + item.price, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
