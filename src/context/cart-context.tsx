
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Language } from './language-context';

export interface CartItem {
    id: string; // Unique ID for the cart item instance
    serviceId: string; // ID of the service from the DB
    name: { [key in Language]: string };
    price: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (service: { id: string, name: { [key in Language]: string }, price: number, serviceId: string }) => void;
    removeItem: (itemId: string) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        const savedCart = localStorage.getItem('pakfiler-cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('pakfiler-cart', JSON.stringify(items));
    }, [items]);

    const addItem = (service: { id: string, name: { [key in Language]: string }, price: number, serviceId: string }) => {
        const newItem: CartItem = {
            id: `${service.id}-${Date.now()}`, // Create a unique ID for this cart instance
            serviceId: service.id,
            name: service.name,
            price: service.price,
        };
        setItems(prevItems => [...prevItems, newItem]);
    };

    const removeItem = (itemId: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const clearCart = () => {
        setItems([]);
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
