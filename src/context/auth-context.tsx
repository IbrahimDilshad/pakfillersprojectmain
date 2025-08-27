
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, onSnapshot, DocumentData } from 'firebase/firestore';

type Role = 'user' | 'admin' | 'accountant';
type AccountType = 'family' | 'business';
type Relation = 'parent' | 'sibling' | 'child' | 'spouse' | 'other';
type LegalStructure = 'company' | 'aop' | 'individual';

export interface Permissions {
    dashboard?: boolean;
    orders?: boolean;
    content?: boolean;
    payments?: boolean;
    chat?: boolean;
    users?: boolean;
    reports?: boolean;
    config?: boolean;
}

export interface AuthUser extends User {
  role: Role;
  mobileNumber?: string;
  cnic?: string;
  accountType?: AccountType;
  relation?: Relation;
  legalStructure?: LegalStructure;
  isSubAccount?: boolean;
  permissions?: Permissions;
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
        
        const docSub = onSnapshot(userDocRef, (userDoc) => {
            let mainUser: AuthUser;
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const isSuperAdmin = firebaseUser.email === 'admin@example.com';
              const isAccountant = firebaseUser.email === 'accountant@gmail.com';
              
              let role: Role = 'user';
              if (isSuperAdmin) {
                role = 'admin';
              } else if (isAccountant) {
                role = 'accountant';
              } else {
                role = userData.role || 'user';
              }
              
              mainUser = {
                ...firebaseUser,
                ...userData,
                role: role,
                displayName: firebaseUser.displayName || userData.displayName,
              } as AuthUser;
            } else {
               const isSuperAdmin = firebaseUser.email === 'admin@example.com';
               const isAccountant = firebaseUser.email === 'accountant@gmail.com';
               let role: Role = 'user';
                if (isSuperAdmin) {
                    role = 'admin';
                } else if (isAccountant) {
                    role = 'accountant';
                }
               mainUser = { 
                   ...firebaseUser, 
                   role: role, 
                   displayName: firebaseUser.displayName 
                } as AuthUser;
            }
            
            setUser(mainUser);
        });

        setLoading(false);
        return () => docSub();

      } else {
        setUser(null);
        setActiveUser(null);
        setSubAccounts([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Effect to update activeUser when main user changes
  useEffect(() => {
    if (user) {
        // If there's no active user or the active user was the old main user, update it.
        if (!activeUser || (activeUser.uid === user.uid && activeUser.isSubAccount !== true)) {
            setActiveUser(user);
        }
    } else {
        setActiveUser(null);
    }
  }, [user]);


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
