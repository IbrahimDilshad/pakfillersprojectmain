
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
    userName?: string;
    userEmail?: string;
}

export function useChat(userId: string | undefined, userRole: Role | undefined) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [loading, setLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Effect for admins to listen to the list of all chat sessions
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

  // Effect to listen for messages for the relevant session
  useEffect(() => {
    let listenerId: string | null = null;
    
    // For an admin, the listenerId is the session they've clicked on.
    if (userRole === 'admin') {
      listenerId = currentSessionId;
    } 
    // For a regular user, the listenerId is always their own UID.
    else if (userId) {
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

    // Cleanup the listener when the component unmounts or the dependencies change
    return () => {
      unsubscribe();
    };
  }, [userId, userRole, currentSessionId]);

  const sendMessage = useCallback(async (payload: SendMessagePayload) => {
    const { sessionId, text, senderId, from, userName, userEmail } = payload;
    if (!text.trim() || !senderId) return;

    try {
      const sessionRef = doc(db, 'chats', sessionId);
      const messagesColRef = collection(sessionRef, 'messages');
      
      const batch = writeBatch(db);

      // 1. Add the new message to the 'messages' subcollection
      const newMessageRef = doc(messagesColRef);
      batch.set(newMessageRef, {
        text,
        timestamp: serverTimestamp(),
        senderId,
        from,
      });

      // 2. Create or update the parent chat document with the latest message info
      const sessionUpdateData: any = {
        lastMessage: text,
        lastMessageTimestamp: serverTimestamp(),
      };
      
      // If a user is sending the message, update their info and mark as unread for admin
      if (from === 'user') {
        sessionUpdateData.isReadByAdmin = false;
        if (userName) sessionUpdateData.userName = userName;
        if (userEmail) sessionUpdateData.userEmail = userEmail;
      } else { // If support is sending, mark as read
        sessionUpdateData.isReadByAdmin = true;
      }
      
      // Use set with merge:true to create the document if it doesn't exist or update it if it does.
      batch.set(sessionRef, sessionUpdateData, { merge: true });

      await batch.commit();

    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, []);

  const deleteChat = useCallback(async (sessionId: string) => {
    if (userRole !== 'admin') return;
    try {
      // Delete all messages in the subcollection first
      const messagesCollection = collection(db, 'chats', sessionId, 'messages');
      const messagesSnapshot = await getDocs(messagesCollection);
      const batch = writeBatch(db);
      messagesSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      // Delete the main chat document
      await deleteDoc(doc(db, 'chats', sessionId));

      // Clean up local state
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
