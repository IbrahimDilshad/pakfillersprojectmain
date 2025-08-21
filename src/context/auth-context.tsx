
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';

type Role = 'user' | 'admin' | 'accountant';
type AccountType = 'family' | 'business';
type Relation = 'parent' | 'sibling' | 'child' | 'spouse' | 'other';
type LegalStructure = 'company' | 'aop' | 'individual';


export interface AuthUser extends User {
  role: Role;
  mobileNumber?: string;
  cnic?: string;
  accountType?: AccountType;
  relation?: Relation;
  legalStructure?: LegalStructure;
  isSubAccount?: boolean;
}

interface AuthContextType {
  user: AuthUser | null; // The logged-in user
  activeUser: AuthUser | null; // The currently selected profile
  subAccounts: AuthUser[];
  loading: boolean;
  logout: () => Promise<void>;
  setUser: Dispatch<SetStateAction<AuthUser | null>>;
  setActiveUser: Dispatch<SetStateAction<AuthUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeUser, setActiveUser] = useState<AuthUser | null>(null);
  const [subAccounts, setSubAccounts] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        let mainUser: AuthUser;

        if (userDoc.exists()) {
          const userData = userDoc.data();
          mainUser = {
            ...firebaseUser,
            ...userData,
            role: userData.role || 'user',
            displayName: firebaseUser.displayName || userData.displayName,
          } as AuthUser;
        } else {
           const role: Role = firebaseUser.email === 'admin@example.com' ? 'admin' : 'user';
           mainUser = { ...firebaseUser, role, displayName: firebaseUser.displayName } as AuthUser;
        }
        setUser(mainUser);
        // Set active user only if it's not already set or if the main user changes
        if (!activeUser || activeUser.uid !== mainUser.uid) {
            setActiveUser(mainUser);
        }

      } else {
        setUser(null);
        setActiveUser(null);
        setSubAccounts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Effect to listen for sub-account changes
  useEffect(() => {
    if (user?.uid) {
      const subAccountsCollectionRef = collection(db, `users/${user.uid}/subAccounts`);
      const unsubscribe = onSnapshot(subAccountsCollectionRef, (snapshot) => {
        const accounts = snapshot.docs.map(doc => ({
          ...doc.data(),
          uid: doc.id, // The doc id is the uid for the sub-account
          isSubAccount: true,
        } as AuthUser));
        setSubAccounts(accounts);
      });

      return () => unsubscribe();
    } else {
      setSubAccounts([]);
    }
  }, [user?.uid]);

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setActiveUser(null);
    setSubAccounts([]);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, activeUser, subAccounts, loading, logout, setUser, setActiveUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
