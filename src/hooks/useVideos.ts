
'use client';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Language } from '@/context/language-context';

export interface Video {
  id: string;
  title: { [key in Language]: string };
  description: { [key in Language]: string };
  src: string;
  createdAt: any;
}

async function fetchVideos(): Promise<Video[]> {
    const videosCollection = collection(db, 'videos');
    const q = query(videosCollection, orderBy('createdAt', 'desc'));
    const videosSnapshot = await getDocs(q);
    return videosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Video));
}

export function useVideos() {
  const { data: videos = [], isLoading: loading, refetch } = useQuery<Video[]>({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return { videos, loading, refetchVideos: refetch };
}
