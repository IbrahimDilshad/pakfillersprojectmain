
'use client';
import { useState, useEffect } from 'react';
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

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const videosCollection = collection(db, 'videos');
        const q = query(videosCollection, orderBy('createdAt', 'desc'));
        const videosSnapshot = await getDocs(q);
        const videosList = videosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Video));
        setVideos(videosList);
      } catch (error) {
        console.error("Error fetching videos: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, loading, setVideos };
}
