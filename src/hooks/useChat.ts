
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
  writeBatch,
  getDocs,
  deleteDoc,
  updateDoc,
  setDoc,
  Timestamp,
  getDoc,
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

interface SendMessagePayload {
    sessionId: string;
    text: string;
    senderId: string;
    from: 'user' | 'support';
    userName: string;
    userEmail: string;
}

export function useChat(userId: string | undefined, userRole: Role | undefined) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [loading, setLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Effect for fetching chat data based on role
  useEffect(() => {
    let unsubscribe: () => void = () => {};
    
    if (userRole === 'admin') {
      setLoading(true);
      const q = query(collection(db, 'chats'), orderBy('lastMessageTimestamp', 'desc'));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const sessionsData: ChatSession[] = [];
        querySnapshot.forEach((doc) => {
          sessionsData.push({ id: doc.id, ...doc.data() } as ChatSession);
        });
        setSessions(sessionsData);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching chat sessions for admin:", error);
        setLoading(false);
      });
    } else if (userId) {
      setLoading(true);
      const sessionRef = doc(db, 'chats', userId);
      const messagesQuery = query(collection(sessionRef, 'messages'), orderBy('timestamp', 'asc'));
      
      unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        const sessionMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          sessionMessages.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages({ [userId]: sessionMessages });
        setLoading(false);
      }, (error) => {
        console.error(`Error fetching messages for session ${userId}:`, error);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    
    return () => unsubscribe();
  }, [userId, userRole]);


  // Effect for fetching messages for the *currently selected* session in admin view
  useEffect(() => {
    let unsubscribe: () => void = () => {};
    
    if (userRole === 'admin' && currentSessionId) {
      const messagesQuery = query(
        collection(db, 'chats', currentSessionId, 'messages'),
        orderBy('timestamp', 'asc')
      );

      unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        const sessionMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          sessionMessages.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages(prev => ({ ...prev, [currentSessionId]: sessionMessages }));
      });
    }
    
    return () => unsubscribe();
  }, [userRole, currentSessionId]);

  const sendMessage = useCallback(async (payload: SendMessagePayload) => {
    const { sessionId, text, senderId, from, userName, userEmail } = payload;
    if (!text.trim() || !senderId) return;

    try {
      const sessionRef = doc(db, 'chats', sessionId);
      const messagesColRef = collection(sessionRef, 'messages');
      
      const batch = writeBatch(db);

      const newMessageRef = doc(messagesColRef);
      batch.set(newMessageRef, {
        text,
        timestamp: serverTimestamp(),
        senderId,
        from,
      });

      const sessionUpdateData: any = {
        lastMessage: text,
        lastMessageTimestamp: serverTimestamp(),
        isReadByAdmin: from === 'support' ? true : false,
        userName, // Always include user info
        userEmail, // Always include user info
      };
      
      batch.set(sessionRef, sessionUpdateData, { merge: true });

      await batch.commit();

    } catch (error) {
      console.error("Error sending message:", error);
    }
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
        const newMessages = { ...prev };
        delete newMessages[sessionId];
        return newMessages;
      });
      
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  }, [userRole]);

  const markSessionAsRead = useCallback(async (sessionId: string) => {
    if (userRole !== 'admin') return;
    try {
      const sessionRef = doc(db, 'chats', sessionId);
      await updateDoc(sessionRef, { isReadByAdmin: true });
    } catch (error) {
      console.error("Error marking session as read:", error);
    }
  }, [userRole]);

  return { sessions, loading, messages, sendMessage, deleteChat, setCurrentSessionId, markSessionAsRead };
}
