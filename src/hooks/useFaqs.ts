
'use client';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Language } from '@/context/language-context';

export interface Faq {
  id: string;
  question: { [key in Language]: string };
  answer: { [key in Language]: string };
  createdAt: any;
}

async function fetchFaqs(): Promise<Faq[]> {
    const faqsCollection = collection(db, 'faqs');
    const q = query(faqsCollection, orderBy('createdAt', 'desc'));
    const faqsSnapshot = await getDocs(q);
    return faqsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Faq));
}

export function useFaqs() {
  const { data: faqs = [], isLoading: loading, refetch } = useQuery<Faq[]>({
    queryKey: ['faqs'],
    queryFn: fetchFaqs,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return { faqs, loading, refetchFaqs: refetch };
}
