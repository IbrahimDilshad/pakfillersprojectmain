
'use client';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AuthUser } from '@/context/auth-context';

export interface UserProfile extends AuthUser {
    createdAt?: Timestamp;
}

async function fetchUsers(): Promise<UserProfile[]> {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, orderBy('displayName'));
    const usersSnapshot = await getDocs(q);
    return usersSnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    } as UserProfile));
}

export function useAllUsers() {
  const { data: users = [], isLoading: loading, refetch, isError } = useQuery<UserProfile[]>({
    queryKey: ['allUsers'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  return { users, loading, refetchUsers: refetch, isError };
}
