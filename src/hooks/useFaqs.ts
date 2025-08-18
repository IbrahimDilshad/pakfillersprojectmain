
'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Language } from '@/context/language-context';

export interface Faq {
  id: string;
  question: { [key in Language]: string };
  answer: { [key in Language]: string };
  createdAt: any;
}

export function useFaqs() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      try {
        const faqsCollection = collection(db, 'faqs');
        const q = query(faqsCollection, orderBy('createdAt', 'desc'));
        const faqsSnapshot = await getDocs(q);
        const faqsList = faqsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Faq));
        setFaqs(faqsList);
      } catch (error) {
        console.error("Error fetching FAQs: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return { faqs, loading, setFaqs };
}
