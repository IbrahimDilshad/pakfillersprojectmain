
'use client';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Language } from '@/context/language-context';

export interface FormPrice {
  id: string; // This will be the form's unique code, e.g., 'personal_tax_filing'
  name: { [key in Language]: string };
  price: number;
}

async function fetchFormPrices(): Promise<FormPrice[]> {
    const pricesCollection = collection(db, 'formPrices');
    const q = query(pricesCollection);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FormPrice));
}

export function useFormPrices() {
  const { data: formPrices = [], isLoading: loading, refetch } = useQuery<FormPrice[]>({
    queryKey: ['formPrices'],
    queryFn: fetchFormPrices,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  
  return { formPrices, loading, refetchFormPrices: refetch };
}
