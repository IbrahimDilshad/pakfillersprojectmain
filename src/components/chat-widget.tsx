
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Send } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useAuth } from '@/context/auth-context';
import { useChat } from '@/hooks/useChat';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { t } = useLanguage();
  const { user } = useAuth();
  const { messages, sendMessage } = useChat(user?.uid, user?.role);
  const chatMessages = user ? messages[user.uid] || [] : [];
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatMessages, isOpen]);

  // Expose a global function to open the chat
  useEffect(() => {
    (window as any).openChatWidget = () => setIsOpen(true);
    return () => {
      delete (window as any).openChatWidget;
    };
  }, []);


  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && user) {
      sendMessage(user.uid, inputValue, user.uid, 'user', user.displayName || 'Anonymous', user.email || 'no-email');
      setInputValue('');
    }
  };

  if (!user) return null;

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
          <CardContent ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground p-4">
                  {t({ en: 'Hello! How can I help you today?', ur: 'ہیلو! میں آج آپ کی کیسے مدد کر سکتا ہوں؟' })}
                </div>
              )}
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.from === 'support' && (
                     <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">P</div>
                  )}
                  <div className={`max-w-[75%] p-3 rounded-lg ${msg.from === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
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
