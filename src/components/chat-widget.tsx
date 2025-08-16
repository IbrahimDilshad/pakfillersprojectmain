
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Send } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'support', text: { en: 'Hello! How can I help you today?', ur: 'ہیلو! میں آج آپ کی کیسے مدد کر سکتا ہوں؟' } },
  ]);
  const [inputValue, setInputValue] = useState('');
  const { t } = useLanguage();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { from: 'user', text: { en: inputValue, ur: inputValue } }]);
      setInputValue('');
      // Simulate support reply
      setTimeout(() => {
        setMessages(prev => [...prev, { from: 'support', text: { en: 'Our support agent will be with you shortly.', ur: 'ہمارا سپورٹ ایجنٹ جلد ہی آپ کے ساتھ ہو گا۔' } }]);
      }, 1500);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button onClick={toggleChat} className="rounded-full w-16 h-16 shadow-lg">
          <MessageSquare className="h-8 w-8" />
        </Button>
      ) : (
        <Card className="w-80 h-[450px] flex flex-col shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <CardTitle className="text-lg">{t({ en: 'Support Chat', ur: 'سپورٹ چیٹ' })}</CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleChat}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.from === 'support' && (
                     <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">P</div>
                  )}
                  <div className={`max-w-[75%] p-3 rounded-lg ${msg.from === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-sm">{t(msg.text)}</p>
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
