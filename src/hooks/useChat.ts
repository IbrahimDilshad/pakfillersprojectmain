
'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  writeBatch,
  getDocs,
  deleteDoc,
  serverTimestamp,
  updateDoc,
  setDoc,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import type { Role } from '@/context/auth-context';

export interface Message {
  id: string;
  text: string;
  timestamp: Timestamp;
  senderId: string;
  from: 'user' | 'support';
}

export interface ChatSession {
  id: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageTimestamp: Timestamp;
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
  const [currentSessionId, _setCurrentSessionId] = useState<string | null>(null);

  // Effect for fetching ALL chat sessions for an admin
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
    }, (error) => {
      console.error("Error fetching chat sessions for admin:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userRole]);

  // Effect for fetching messages for a SPECIFIC session
  useEffect(() => {
    let sessionIdToFetch: string | null = null;
    
    if (userRole === 'admin') {
        sessionIdToFetch = currentSessionId;
    } else if (userId) {
        sessionIdToFetch = userId;
    }

    if (!sessionIdToFetch) {
        if (userRole !== 'admin') {
            setMessages({});
        }
        return;
    }

    const messagesQuery = query(
      collection(db, 'chats', sessionIdToFetch, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const sessionMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        sessionMessages.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(prev => ({ ...prev, [sessionIdToFetch!]: sessionMessages }));
    }, (error) => {
       console.error(`Error fetching messages for session ${sessionIdToFetch}:`, error);
    });
    
    return () => unsubscribe();
  }, [userId, userRole, currentSessionId]);

  const setSessionIdForMessages = useCallback(async (sessionId: string) => {
    _setCurrentSessionId(sessionId);
    // Mark as read when admin selects a chat
    if (userRole === 'admin' && sessionId) {
        try {
            const sessionRef = doc(db, 'chats', sessionId);
            await updateDoc(sessionRef, { isReadByAdmin: true });
        } catch(e) {
            console.error("Error marking chat as read:", e);
        }
    }
  }, [userRole]);


  const sendMessage = useCallback(async (payload: SendMessagePayload) => {
    const { sessionId, text, senderId, from, userName, userEmail } = payload;
    if (!text.trim() || !senderId) return;

    try {
        const sessionRef = doc(db, 'chats', sessionId);
        const messagesColRef = collection(sessionRef, 'messages');
        const batch = writeBatch(db);

        const newMessageRef = doc(messagesColRef); // Auto-generate ID for new message
        batch.set(newMessageRef, {
            text,
            timestamp: serverTimestamp(),
            senderId,
            from,
        });

        const sessionDoc = await getDoc(sessionRef);

        const sessionUpdateData = {
            lastMessage: text,
            lastMessageTimestamp: serverTimestamp(),
            isReadByAdmin: from === 'support',
            userName,
            userEmail,
        };

        if (sessionDoc.exists()) {
            batch.update(sessionRef, sessionUpdateData);
        } else {
            batch.set(sessionRef, {
                ...sessionUpdateData,
                id: sessionId,
            });
        }
        
        await batch.commit();

    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, []);

  const deleteChat = useCallback(async (sessionId: string) => {
    if (userRole !== 'admin') return;
    try {
      const messagesCollectionRef = collection(db, 'chats', sessionId, 'messages');
      const messagesSnapshot = await getDocs(messagesCollectionRef);
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
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  }, [userRole]);

  return { sessions, loading, messages, sendMessage, deleteChat, setSessionIdForMessages, currentSessionId };
}
