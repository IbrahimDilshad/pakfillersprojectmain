
'use client';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Language } from '@/context/language-context';

export interface BlogPost {
  id: string;
  title: { [key in Language]: string };
  description: { [key in Language]: string };
  image: string;
  hint: string;
  href?: string;
  createdAt: any;
}

async function fetchBlogPosts(): Promise<BlogPost[]> {
    const postsCollection = collection(db, 'blogPosts');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    const postsSnapshot = await getDocs(q);
    return postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as BlogPost));
}

export function useBlogPosts() {
  const { data: posts = [], isLoading: loading, refetch } = useQuery<BlogPost[]>({
    queryKey: ['blogPosts'],
    queryFn: fetchBlogPosts,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return { posts, loading, refetchPosts: refetch };
}
