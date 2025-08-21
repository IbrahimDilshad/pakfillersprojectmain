
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
  setDoc,
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
  const [currentSessionId, setSessionIdForMessages] = useState<string | null>(null);

  // Effect for fetching chat data. It behaves differently for admins vs. users.
  useEffect(() => {
    setLoading(true);
    if (userRole === 'admin') {
      // Admin: Fetch all chat sessions. Messages are fetched later when a session is selected.
      const q = query(collection(db, 'chats'), orderBy('lastMessageTimestamp', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
      return () => unsubscribe();
    } else if (userId) {
      // User: Fetch their own chat messages directly.
      const sessionRef = doc(db, 'chats', userId);
      const messagesQuery = query(collection(sessionRef, 'messages'), orderBy('timestamp', 'asc'));
      
      const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        const sessionMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          sessionMessages.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages(prev => ({ ...prev, [userId]: sessionMessages }));
        setLoading(false);
      }, (error) => {
        console.error(`Error fetching messages for session ${userId}:`, error);
        setLoading(false);
      });
       return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [userId, userRole]);


  // Effect for fetching messages for the *currently selected* session in the admin view
  useEffect(() => {
    if (userRole === 'admin' && currentSessionId) {
      const messagesQuery = query(
        collection(db, 'chats', currentSessionId, 'messages'),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        const sessionMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          sessionMessages.push({ id: doc.id, ...doc.data() } as Message);
        });
        // Important: Use a functional update to avoid stale state
        setMessages(prev => ({ ...prev, [currentSessionId]: sessionMessages }));
        
        // Mark session as read
        const sessionRef = doc(db, 'chats', currentSessionId);
        updateDoc(sessionRef, { isReadByAdmin: true });

      }, (error) => {
         console.error(`Error fetching messages for selected session ${currentSessionId}:`, error);
      });
      
      return () => unsubscribe();
    }
  }, [userRole, currentSessionId]);

  const sendMessage = useCallback(async (payload: SendMessagePayload) => {
    const { sessionId, text, senderId, from, userName, userEmail } = payload;
    if (!text.trim() || !senderId) return;

    try {
      const sessionRef = doc(db, 'chats', sessionId);
      const messagesColRef = collection(sessionRef, 'messages');
      const batch = writeBatch(db);

      // 1. Add new message to the messages sub-collection
      const newMessageRef = doc(messagesColRef);
      batch.set(newMessageRef, {
        text,
        timestamp: serverTimestamp(),
        senderId,
        from,
      });

      // 2. Update the parent chat session document
      const sessionDataToSet = {
        lastMessage: text,
        lastMessageTimestamp: serverTimestamp(),
        isReadByAdmin: from === 'support', // true if admin sends, false if user sends
        userName: userName,
        userEmail: userEmail,
      };
      
      batch.set(sessionRef, sessionDataToSet, { merge: true });
      
      await batch.commit();

    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, []);

  const deleteChat = useCallback(async (sessionId: string) => {
    if (userRole !== 'admin') return;
    try {
      // Delete all messages in the subcollection first
      const messagesCollectionRef = collection(db, 'chats', sessionId, 'messages');
      const messagesSnapshot = await getDocs(messagesCollectionRef);
      const batch = writeBatch(db);
      messagesSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      // Then delete the main chat document
      await deleteDoc(doc(db, 'chats', sessionId));

      // Update local state to remove the deleted chat
      setMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[sessionId];
        return newMessages;
      });
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  }, [userRole]);

  return { sessions, loading, messages, sendMessage, deleteChat, setSessionIdForMessages, currentSessionId };
}
