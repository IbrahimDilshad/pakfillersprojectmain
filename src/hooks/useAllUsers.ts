
'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AuthUser } from '@/context/auth-context';

export interface UserProfile extends AuthUser {
    createdAt?: Timestamp;
}

export function useAllUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, orderBy('displayName'));
      const usersSnapshot = await getDocs(q);
      const usersList = usersSnapshot.docs.map(doc => ({
        uid: doc.id, // Ensure uid is set from doc.id
        ...doc.data()
      } as UserProfile));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users: ", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, setUsers };
}
