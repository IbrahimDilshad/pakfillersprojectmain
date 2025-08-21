
'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Language } from '@/context/language-context';

export interface Order {
    id: string;
    userId: string;
    userEmail: string;
    items: { name: { [key in Language]: string }; price: number }[];
    total: number;
    status: 'pending' | 'processing' | 'completed';
    createdAt: Timestamp;
}

export function useOrders(userId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const ordersCollection = collection(db, 'orders');
        const q = query(
          ordersCollection, 
          where('userId', '==', userId), 
          orderBy('createdAt', 'desc')
        );
        const ordersSnapshot = await getDocs(q);
        const ordersList = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Order));
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders: ", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  return { orders, loading };
}
