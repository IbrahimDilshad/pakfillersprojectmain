
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

  // Effect for fetching admin chat sessions
  useEffect(() => {
    if (userRole !== 'admin') {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'chats'), orderBy('lastMessageTimestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const sessionsData: ChatSession[] = [];
      querySnapshot.forEach((doc) => {
        sessionsData.push({ id: doc.id, ...doc.data() } as ChatSession);
      });
      setSessions(sessionsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching chat sessions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userRole]);

  // Effect for fetching messages for a given session
  useEffect(() => {
    let listenerId: string | null = null;
    
    if (userRole === 'admin') {
      listenerId = currentSessionId;
    } else if (userId) { // For non-admins (users), the session ID is their UID
      listenerId = userId;
    }
    
    if (!listenerId) {
      return;
    }

    const messagesQuery = query(
      collection(db, 'chats', listenerId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const sessionMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        sessionMessages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(prev => ({ ...prev, [listenerId!]: sessionMessages }));
    }, (error) => {
      console.error(`Error fetching messages for session ${listenerId}:`, error);
    });

    return () => unsubscribe();
  }, [userId, userRole, currentSessionId]);

  const sendMessage = useCallback(async (payload: SendMessagePayload) => {
    const { sessionId, text, senderId, from, userName, userEmail } = payload;
    if (!text.trim() || !senderId) return;

    try {
      const sessionRef = doc(db, 'chats', sessionId);
      const messagesColRef = collection(sessionRef, 'messages');
      
      const docSnap = await getDoc(sessionRef);

      // Create a batch to perform multiple writes atomically
      const batch = writeBatch(db);

      // 1. Add the new message
      const newMessageRef = doc(messagesColRef);
      batch.set(newMessageRef, {
        text,
        timestamp: serverTimestamp(),
        senderId,
        from,
      });

      // 2. Update the session document
      const sessionUpdateData: any = {
        lastMessage: text,
        lastMessageTimestamp: serverTimestamp(),
        isReadByAdmin: from === 'support', // Mark as read if admin sends
      };
      
      // If the session doesn't exist, it's the first message from a user.
      // We must create the session with the user's details.
      if (!docSnap.exists()) {
        sessionUpdateData.userName = userName;
        sessionUpdateData.userEmail = userEmail;
      }
      
      // Use set with merge:true to create or update the session doc
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
