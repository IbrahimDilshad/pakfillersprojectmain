
'use client';
import { useState } from 'react';
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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


export default function AdminChatPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { sessions, loading, messages, sendMessage, deleteChat } = useChat(user?.uid, user?.role);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() && selectedSession && user) {
      sendMessage(selectedSession.id, message, user.uid, 'support');
      setMessage('');
    }
  };

  if (user?.role !== 'admin') {
     return (
      <AppLayout pageTitle={t({ en: "Access Denied", ur: "رسائی مسترد" })}>
        <Card className="m-auto mt-12 max-w-lg text-center">
          <CardHeader><CardTitle>{t({ en: "Access Denied", ur: "رسائی مسترد" })}</CardTitle></CardHeader>
          <CardContent><p>{t({ en: "You don't have permission to view this page.", ur: "آپ کو یہ صفحہ دیکھنے کی اجازت نہیں ہے۔" })}</p></CardContent>
        </Card>
      </AppLayout>
    );
  }

  const ChatList = () => (
    <Card>
      <CardHeader>
        <CardTitle>{t({ en: "User Chats", ur: "صارف کی چیٹس" })}</CardTitle>
        <CardDescription>{t({ en: "Select a chat to view and respond.", ur: "دیکھنے اور جواب دینے کے لیے ایک چیٹ منتخب کریں۔" })}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[60vh]">
            {loading && <p className="p-4">{t({ en: "Loading chats...", ur: "چیٹس لوڈ ہو رہی ہیں..." })}</p>}
            {!loading && sessions.length === 0 && <p className="p-4 text-muted-foreground">{t({ en: "No active chats.", ur: "کوئی فعال چیٹس نہیں ہیں۔" })}</p>}
            {sessions.map(session => (
              <div key={session.id} onClick={() => setSelectedSession(session)} className="flex items-center gap-4 p-4 border-b hover:bg-accent cursor-pointer">
                <Avatar>
                  <AvatarFallback>{session.userName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <p className="font-semibold">{session.userName || t({ en: 'Unknown User', ur: 'نامعلوم صارف' })}</p>
                  <p className="text-sm text-muted-foreground truncate">{session.lastMessage}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                    {session.lastMessageTimestamp && formatDistanceToNow(session.lastMessageTimestamp.toDate(), { addSuffix: true })}
                </div>
              </div>
            ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const ChatView = () => {
    if (!selectedSession) return null;
    
    return (
        <Card className="flex flex-col h-[calc(70vh)]">
            <CardHeader className="flex flex-row items-center justify-between border-b">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedSession(null)}>
                        <ArrowLeft />
                    </Button>
                    <Avatar>
                        <AvatarFallback>{selectedSession.userName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-lg">{selectedSession.userName || t({ en: 'Unknown User', ur: 'نامعلوم صارف' })}</CardTitle>
                        <CardDescription>{selectedSession.userEmail}</CardDescription>
                    </div>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon"><Trash2 /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete this chat history. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => {
                                deleteChat(selectedSession.id);
                                setSelectedSession(null);
                            }}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-y-auto">
                 <div className="space-y-4">
                    {messages[selectedSession.id]?.map((msg: Message) => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.from === 'support' ? 'justify-end' : 'justify-start'}`}>
                            {msg.from !== 'support' && (
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback>{selectedSession.userName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`max-w-[75%] p-3 rounded-lg ${msg.from === 'support' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </CardContent>
            <div className="p-4 border-t">
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
            </div>
        </Card>
    );
  }

  return (
    <AppLayout pageTitle={t({ en: "Admin Chat", ur: "ایڈمن چیٹ" })}>
        <div className="grid md:grid-cols-3 gap-4">
            <div className={selectedSession ? "hidden md:block" : ""}>
                <ChatList />
            </div>
            <div className={`md:col-span-2 ${!selectedSession ? 'hidden md:block' : ''}`}>
                 {selectedSession ? (
                    <ChatView />
                 ) : (
                    <Card className="flex items-center justify-center h-[calc(70vh)]">
                        <div className="text-center text-muted-foreground">
                            <p>{t({ en: "Select a chat to start messaging", ur: "پیغام رسانی شروع کرنے کے لیے ایک چیٹ منتخب کریں۔" })}</p>
                        </div>
                    </Card>
                 )}
            </div>
        </div>
    </AppLayout>
  );
}
