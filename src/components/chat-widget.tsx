
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Send } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';
import { useChat, Message } from '@/hooks/useChat';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // Use the user's UID as the session ID for both users and admins in this context.
  const sessionId = user?.uid;
  const { messages, sendMessage, setCurrentSessionId } = useChat(user?.uid, user?.role);
  
  // The widget should listen to its own session, which is the user's UID.
  const chatMessages: Message[] = sessionId ? messages[sessionId] || [] : [];
  
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If the user is not an admin, we set their session ID so the hook starts listening
    if (user?.role !== 'admin' && user?.uid) {
        setCurrentSessionId(user.uid);
    }
  }, [user, setCurrentSessionId]);
  
  useEffect(() => {
    if (isOpen && scrollAreaViewportRef.current) {
        setTimeout(() => {
            if (scrollAreaViewportRef.current) {
                scrollAreaViewportRef.current.scrollTop = scrollAreaViewportRef.current.scrollHeight;
            }
        }, 100);
    }
  }, [chatMessages, isOpen]);


  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && user && sessionId) {
      sendMessage({
        sessionId: sessionId,
        text: inputValue, 
        senderId: user.uid, 
        // A user's message is always from 'user', admin message always from 'support'
        from: user.role === 'admin' ? 'support' : 'user', 
        userName: user.displayName || 'Anonymous User', 
        userEmail: user.email || 'no-email@example.com'
      });
      setInputValue('');
    }
  };
  
  // Only render the widget if a user is logged in.
  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button onClick={toggleChat} className="rounded-full w-16 h-16 shadow-lg" data-chat-widget-button>
          <MessageSquare className="h-8 w-8" />
        </Button>
      ) : (
        <Card className="w-80 h-[450px] flex flex-col shadow-lg" data-chat-widget-window>
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <CardTitle className="text-lg">{t({ en: 'Support Chat', ur: 'سپورٹ چیٹ' })}</CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleChat}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-y-auto">
            <ScrollArea className="h-full" viewportRef={scrollAreaViewportRef}>
                <div className="p-4 space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground p-4">
                      {t({ en: 'Hello! How can we help you today?', ur: 'ہیلو! ہم آج آپ کی کیسے مدد کر سکتے ہیں؟' })}
                    </div>
                  )}
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={cn('flex items-end gap-2', msg.from === 'user' ? 'justify-end' : 'justify-start')}>
                      {msg.from === 'support' && (
                         <Avatar className="w-8 h-8">
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={cn('max-w-[75%] p-3 rounded-lg', msg.from === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      {msg.from === 'user' && user?.role === 'admin' && (
                         <Avatar className="w-8 h-8">
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <div className="flex w-full items-center gap-2">
              <Input
                placeholder={t({ en: 'Type a message...', ur: 'ایک پیغام ٹائپ کریں...' })}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="icon" disabled={!inputValue.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
