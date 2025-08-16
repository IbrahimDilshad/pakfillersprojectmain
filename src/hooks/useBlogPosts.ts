
'use client';
import { useState, useEffect } from 'react';
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

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, 'blogPosts');
        const q = query(postsCollection, orderBy('createdAt', 'desc'));
        const postsSnapshot = await getDocs(q);
        const postsList = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as BlogPost));
        setPosts(postsList);
      } catch (error) {
        console.error("Error fetching blog posts: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading };
}
