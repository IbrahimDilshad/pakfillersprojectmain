
'use client';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, Timestamp, Query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface TaxFiling {
    id: string;
    userId: string;
    userName: string;
    userCnic: string;
    taxYear: string;
    type: 'personal' | 'business';
    status: 'pending' | 'approved' | 'rejected';
    assignedTo?: string;
    createdAt: Timestamp;
    filingData: any;
}

interface Filters {
    search?: string;
    taxYear?: string;
    filingType?: string;
    status?: string;
}

async function fetchTaxFilings(filters: Filters): Promise<TaxFiling[]> {
    const filingsCollection = collection(db, 'taxFilings');
    let q: Query = query(filingsCollection, orderBy('createdAt', 'desc'));

    if (filters.taxYear && filters.taxYear !== 'all') {
        q = query(q, where('taxYear', '==', filters.taxYear));
    }
    if (filters.filingType && filters.filingType !== 'all') {
        q = query(q, where('type', '==', filters.filingType));
    }
    if (filters.status && filters.status !== 'all') {
        q = query(q, where('status', '==', filters.status));
    }

    const filingsSnapshot = await getDocs(q);
    let allFilings = filingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as TaxFiling));

    if (filters.search) {
        const lowerCaseSearch = filters.search.toLowerCase();
        allFilings = allFilings.filter(filing => 
            filing.userName.toLowerCase().includes(lowerCaseSearch) ||
            filing.userCnic.includes(lowerCaseSearch)
        );
    }

    return allFilings;
}

export function useTaxFilings(filters: Filters = {}) {
  const { data: filings = [], isLoading: loading, refetch } = useQuery<TaxFiling[]>({
    queryKey: ['taxFilings', filters],
    queryFn: () => fetchTaxFilings(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return { filings, loading, refetchFilings: refetch };
}
