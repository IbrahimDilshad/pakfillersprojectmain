
'use client';
import { useQuery } from '@tanstack/react-query';
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
    paymentScreenshot?: string;
}

async function fetchOrders(userId?: string): Promise<Order[]> {
    let q;
    const ordersCollection = collection(db, 'orders');
    if (userId) {
        q = query(
          ordersCollection, 
          where('userId', '==', userId), 
          orderBy('createdAt', 'desc')
        );
    } else {
        q = query(ordersCollection, orderBy('createdAt', 'desc'));
    }
    
    const ordersSnapshot = await getDocs(q);
    return ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
}

export function useOrders(userId?: string) {
  const queryKey = userId ? ['orders', userId] : ['orders'];

  const { data: orders = [], isLoading: loading, refetch } = useQuery<Order[]>({
    queryKey: queryKey,
    queryFn: () => fetchOrders(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  return { orders, loading, refetchOrders: refetch };
}
