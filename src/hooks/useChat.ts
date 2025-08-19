
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
  updateDoc,
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
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // For admins, listen to all chat sessions to populate the list
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
        console.error("Error fetching chat sessions:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [userRole]);

  // Listen for messages for the relevant session(s)
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let listenerId: string | null = null;

    if (userRole === 'user' && userId) {
        listenerId = userId;
    } else if (userRole === 'admin' && currentSessionId) {
        listenerId = currentSessionId;
    }

    if (listenerId) {
        const messagesQuery = query(
            collection(db, 'chats', listenerId, 'messages'),
            orderBy('timestamp', 'asc')
        );

        unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
            const sessionMessages: Message[] = [];
            querySnapshot.forEach((doc) => {
                sessionMessages.push({ id: doc.id, ...doc.data() } as Message);
            });
            setMessages(prev => ({ ...prev, [listenerId!]: sessionMessages }));
        }, (error) => {
            console.error(`Error fetching messages for session ${listenerId}:`, error);
        });
    }

    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    };
  }, [userId, userRole, currentSessionId]);
  
  const sendMessage = useCallback(async (
    sessionId: string, 
    text: string, 
    senderId: string, 
    from: 'user' | 'support',
    userName?: string,
    userEmail?: string
  ) => {
    if (!text.trim()) return;

    try {
        const messageData = {
          text,
          timestamp: serverTimestamp(),
          senderId,
          from,
        };
        
        await addDoc(collection(db, 'chats', sessionId, 'messages'), messageData);

        const sessionRef = doc(db, 'chats', sessionId);
        const sessionUpdateData: any = {
            lastMessage: text,
            lastMessageTimestamp: serverTimestamp(),
            isReadByAdmin: from === 'support', // If admin sends, it's read. If user sends, it's unread.
        };

        if (from === 'user') {
            // Only add user info if it's not already there
            sessionUpdateData.userName = userName;
            sessionUpdateData.userEmail = userEmail;
        }

        // Use set with merge to create the doc if it doesn't exist or update it if it does
        await setDoc(sessionRef, sessionUpdateData, { merge: true });

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
            const newMessages = {...prev};
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
