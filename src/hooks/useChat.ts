
'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
  getDocs,
  limit,
} from 'firebase/firestore';
import type { Role } from '@/context/auth-context';

export interface Message {
  id: string;
  text: string;
  timestamp: any;
  senderId: string;
  from: 'user' | 'support';
}

export interface ChatSession {
  id: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageTimestamp: any;
  isReadByAdmin: boolean;
}

export function useChat(userId: string | undefined, userRole: Role | undefined) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [loading, setLoading] = useState(true);

  // For admins, listen to all chat sessions
  useEffect(() => {
    if (userRole !== 'admin') {
        setLoading(false);
        return;
    };

    setLoading(true);
    const q = query(collection(db, 'chats'), orderBy('lastMessageTimestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const sessionsData: ChatSession[] = [];
      querySnapshot.forEach((doc) => {
        sessionsData.push({ id: doc.id, ...doc.data() } as ChatSession);
      });
      setSessions(sessionsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userRole]);

  // For users, listen to their own chat messages
  // For admins, listen to messages of all sessions
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    const setupListener = (sessionId: string) => {
        const messagesQuery = query(
            collection(db, 'chats', sessionId, 'messages'),
            orderBy('timestamp', 'asc')
        );

        return onSnapshot(messagesQuery, (querySnapshot) => {
            const sessionMessages: Message[] = [];
            querySnapshot.forEach((doc) => {
            sessionMessages.push({ id: doc.id, ...doc.data() } as Message);
            });
            setMessages(prev => ({ ...prev, [sessionId]: sessionMessages }));
        });
    };

    if (userRole === 'user' && userId) {
      unsubscribes.push(setupListener(userId));
    } else if (userRole === 'admin' && sessions.length > 0) {
      sessions.forEach(session => {
        unsubscribes.push(setupListener(session.id));
      });
    }
    
    return () => unsubscribes.forEach(unsub => unsub());

  }, [userId, userRole, sessions]);
  
  const sendMessage = useCallback(async (
    sessionId: string, 
    text: string, 
    senderId: string, 
    from: 'user' | 'support',
    userName?: string,
    userEmail?: string
  ) => {
    if (!text.trim()) return;

    const messageData = {
      text,
      timestamp: serverTimestamp(),
      senderId,
      from,
    };
    
    await addDoc(collection(db, 'chats', sessionId, 'messages'), messageData);

    const sessionRef = doc(db, 'chats', sessionId);
    const sessionUpdateData: Partial<ChatSession> = {
        lastMessage: text,
        lastMessageTimestamp: serverTimestamp(),
        isReadByAdmin: from === 'user' ? false : true,
    };

    if (from === 'user' && userName && userEmail) {
        sessionUpdateData.userName = userName;
        sessionUpdateData.userEmail = userEmail;
    }

    await setDoc(sessionRef, sessionUpdateData, { merge: true });

  }, []);

  const deleteChat = useCallback(async (sessionId: string) => {
     if (userRole !== 'admin') return;
     try {
        const messagesCollection = collection(db, 'chats', sessionId, 'messages');
        const messagesSnapshot = await getDocs(messagesCollection);
        const batch = writeBatch(db);
        messagesSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        await deleteDoc(doc(db, 'chats', sessionId));

        setMessages(prev => {
            const newMessages = {...prev};
            delete newMessages[sessionId];
            return newMessages;
        })
     } catch (error) {
        console.error("Error deleting chat:", error);
     }
  }, [userRole]);

  return { sessions, loading, messages, sendMessage, deleteChat };
}
