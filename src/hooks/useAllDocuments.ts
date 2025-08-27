
'use client';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, Timestamp, Query, WhereFilterOp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Language } from '@/context/language-context';

export interface Document {
    id: string;
    userId: string;
    category: { [key in Language]: string };
    title: { [key in Language]: string };
    fileUrl: string;
    status: 'pending' | 'approved' | 'rejected' | 'under review';
    createdAt: Timestamp;
}

interface Filters {
    search?: string;
    docType?: string;
    status?: string;
}

async function fetchAllDocuments(filters: Filters): Promise<Document[]> {
    const documentsCollection = collection(db, 'documents');
    let q: Query = query(documentsCollection, orderBy('createdAt', 'desc'));

    if (filters.search) {
        // Firestore doesn't support partial string search natively.
        // For a real app, use a third-party search service like Algolia or Typesense.
        // Here we'll filter client-side after fetching, which is not ideal for large datasets.
    }
    if (filters.docType && filters.docType !== 'all') {
        q = query(q, where('category.en', '==', filters.docType));
    }
    if (filters.status && filters.status !== 'all') {
        q = query(q, where('status', '==', filters.status));
    }

    const docsSnapshot = await getDocs(q);
    let allDocs = docsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Document));

    if (filters.search) {
        allDocs = allDocs.filter(doc => doc.userId.includes(filters.search!));
    }

    return allDocs;
}

export function useAllDocuments(filters: Filters = {}) {
  const { data: documents = [], isLoading: loading, refetch } = useQuery<Document[]>({
    queryKey: ['allDocuments', filters],
    queryFn: () => fetchAllDocuments(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { documents, loading, refetchDocuments: refetch };
}
