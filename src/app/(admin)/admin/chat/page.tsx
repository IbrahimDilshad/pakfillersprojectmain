
'use client';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from "@/context/language-context";
import { useAuth } from '@/context/auth-context';
import { useChat, ChatSession, Message } from '@/hooks/useChat';
import { Send, Trash2, ArrowLeft } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';


interface ChatViewProps {
  session: ChatSession;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onDelete: () => void;
  onBack: () => void;
}

function ChatView({ session, messages, onSendMessage, onDelete, onBack }: ChatViewProps) {
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <Card className="flex flex-col h-[calc(80vh)]">
        <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
                    <ArrowLeft />
                </Button>
                <Avatar>
                    <AvatarFallback>{session.userName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-lg">{session.userName || t({ en: 'Unknown User', ur: 'نامعلوم صارف' })}</CardTitle>
                    <CardDescription>{session.userEmail}</CardDescription>
                </div>
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon"><Trash2 /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t({en: "Are you absolutely sure?", ur: "کیا آپ بالکل یقینی ہیں؟"})}</AlertDialogTitle>
                        <AlertDialogDescription>
                           {t({en: "This will permanently delete this chat history. This action cannot be undone.", ur: "یہ اس چیٹ کی سرگزشت کو مستقل طور پر حذف کر دے گا۔ یہ عمل واپس نہیں کیا جا سکتا۔"})}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t({en: "Cancel", ur: "منسوخ"})}</AlertDialogCancel>
                        <AlertDialogAction onClick={onDelete}>{t({en: "Continue", ur: "جاری"})}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardHeader>
        <CardContent ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto">
             <div className="space-y-4">
                {messages?.map((msg: Message) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.from === 'support' ? 'justify-end' : 'justify-start'}`}>
                        {msg.from !== 'support' && (
                            <Avatar className="w-8 h-8">
                                <AvatarFallback>{session.userName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`max-w-[75%] p-3 rounded-lg ${msg.from === 'support' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                         {msg.from === 'support' && (
                           <Avatar className="w-8 h-8">
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
             </div>
        </CardContent>
        <CardFooter className="p-4 border-t">
            <div className="flex w-full items-center gap-2">
            <Input
                placeholder={t({ en: 'Type a message...', ur: 'ایک پیغام ٹائپ کریں...' })}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} size="icon" disabled={!message.trim()}>
                <Send className="h-5 w-5" />
            </Button>
            </div>
        </CardFooter>
    </Card>
  );
}


export default function AdminChatPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { sessions, loading, messages, sendMessage, deleteChat, setCurrentSessionId, markSessionAsRead } = useChat(user?.uid, user?.role);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);

  // Effect to set the current session for fetching messages
  useEffect(() => {
    if (selectedSession) {
        setCurrentSessionId(selectedSession.id);
    } else {
        setCurrentSessionId(null);
    }
  }, [selectedSession, setCurrentSessionId]);

  // Effect to mark a session as read when it's opened
  useEffect(() => {
    if (selectedSession && !selectedSession.isReadByAdmin) {
        markSessionAsRead(selectedSession.id);
    }
  }, [selectedSession, markSessionAsRead]);
  
  const handleSendMessage = (text: string) => {
    if (selectedSession && user) {
        sendMessage({
            sessionId: selectedSession.id, 
            text, 
            senderId: user.uid, 
            from: 'support'
        });
    }
  };

  const handleDeleteChat = () => {
    if (selectedSession) {
        deleteChat(selectedSession.id);
        setSelectedSession(null);
    }
  };

  const ChatList = () => (
    <Card>
      <CardHeader>
        <CardTitle>{t({ en: "User Chats", ur: "صارف کی چیٹس" })}</CardTitle>
        <CardDescription>{t({ en: "Select a chat to view and respond.", ur: "دیکھنے اور جواب دینے کے لیے ایک چیٹ منتخب کریں۔" })}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[70vh]">
            {loading && (
                 <div className="p-4 space-y-4">
                    {Array.from({length: 5}).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                 </div>
            )}
            {!loading && sessions.length === 0 && <p className="p-4 text-muted-foreground">{t({ en: "No active chats.", ur: "کوئی فعال چیٹس نہیں ہیں۔" })}</p>}
            {sessions.map(session => (
              <div 
                key={session.id} 
                onClick={() => setSelectedSession(session)} 
                className={cn(
                    "flex items-center gap-4 p-4 border-b hover:bg-accent cursor-pointer",
                    selectedSession?.id === session.id && "bg-accent/80"
                )}
              >
                 {!session.isReadByAdmin && (
                    <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                )}
                <Avatar className={cn("flex-shrink-0", session.isReadByAdmin ? "" : "ml-0")}>
                  <AvatarFallback>{session.userName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <p className={cn("font-semibold", !session.isReadByAdmin && "font-bold")}>{session.userName || t({ en: 'Unknown User', ur: 'نامعلوم صارف' })}</p>
                  <p className="text-sm text-muted-foreground truncate">{session.lastMessage}</p>
                </div>
                <div className="text-xs text-muted-foreground flex-shrink-0">
                    {session.lastMessageTimestamp && formatDistanceToNow(session.lastMessageTimestamp.toDate(), { addSuffix: true })}
                </div>
              </div>
            ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className={cn("md:block", selectedSession && "hidden")}>
                <ChatList />
            </div>
            <div className={`md:col-span-2 ${!selectedSession ? 'hidden md:block' : ''}`}>
                 {selectedSession ? (
                    <ChatView 
                        session={selectedSession}
                        messages={messages[selectedSession.id] || []}
                        onSendMessage={handleSendMessage}
                        onDelete={handleDeleteChat}
                        onBack={() => setSelectedSession(null)}
                    />
                 ) : (
                    <Card className="flex items-center justify-center h-[calc(80vh)]">
                        <div className="text-center text-muted-foreground">
                            <p>{t({ en: "Select a chat to start messaging", ur: "پیغام رسانی شروع کرنے کے لیے ایک چیٹ منتخب کریں۔" })}</p>
                        </div>
                    </Card>
                 )}
            </div>
        </div>
  );
}
