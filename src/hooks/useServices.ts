
'use client';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Language } from '@/context/language-context';

export interface Service {
  id: string;
  title: { [key in Language]: string };
  serviceCode: string;
  price: number;
  completionTime: { [key in Language]: string };
  details: { [key in Language]: string };
  whatsappNumber: string;
  createdAt: any;
}

async function fetchServices(): Promise<Service[]> {
    const servicesCollection = collection(db, 'services');
    const q = query(servicesCollection, orderBy('createdAt', 'desc'));
    const servicesSnapshot = await getDocs(q);
    return servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Service));
}

export function useServices() {
  const { data: services = [], isLoading: loading, refetch } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: fetchServices,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return { services, loading, refetchServices: refetch };
}
