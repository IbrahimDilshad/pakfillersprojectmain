
'use client';
import { useState, useEffect } from 'react';
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

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const servicesCollection = collection(db, 'services');
        const q = query(servicesCollection, orderBy('createdAt', 'desc'));
        const servicesSnapshot = await getDocs(q);
        const servicesList = servicesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Service));
        setServices(servicesList);
      } catch (error) {
        console.error("Error fetching services: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading, setServices };
}
