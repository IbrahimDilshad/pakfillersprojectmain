
'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Language } from '@/context/language-context';

export interface FormPrice {
  id: string; // This will be the form's unique code, e.g., 'personal_tax_filing'
  name: { [key in Language]: string };
  price: number;
}

export function useFormPrices() {
  const [formPrices, setFormPrices] = useState<FormPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pricesCollection = collection(db, 'formPrices');
    const q = query(pricesCollection, orderBy('name.en'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pricesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FormPrice));
      setFormPrices(pricesList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching form prices: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { formPrices, loading, setFormPrices };
}
