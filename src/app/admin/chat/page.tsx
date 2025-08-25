
'use client';

import { useState } from 'react';
import { useChat, ChatSession, Message } from '@/hooks/useChat';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

function SessionList({ sessions, activeSessionId, onSelectSession, loading }: { sessions: ChatSession[], activeSessionId: string | null, onSelectSession: (id: string) => void, loading: boolean }) {
    const { t } = useLanguage();
    return (
        <Card className="w-full md:w-1/3">
            <CardHeader>
                <CardTitle>{t({ en: "Chat Sessions", ur: "چیٹ سیشنز" })}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[60vh]">
                    {loading ? (
                        <div className="p-4 space-y-4">
                            {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                        </div>
                    ) : (
                        sessions.map(session => (
                            <div
                                key={session.id}
                                onClick={() => onSelectSession(session.id)}
                                className={cn(
                                    "flex items-center gap-4 p-4 border-b cursor-pointer hover:bg-muted",
                                    activeSessionId === session.id && "bg-primary/10"
                                )}
                            >
                                <Avatar>
                                    <AvatarFallback>{session.userName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold truncate">{session.userName}</p>
                                        {!session.isReadByAdmin && <div className="h-2.5 w-2.5 rounded-full bg-primary flex-shrink-0" />}
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{session.lastMessage}</p>
                                     <p className="text-xs text-muted-foreground">{formatDistanceToNow(session.lastMessageTimestamp.toDate(), { addSuffix: true })}</p>
                                </div>
                            </div>
                        ))
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

function ChatWindow({ sessionId, user, messages, onSendMessage, onDeleteChat }: { sessionId: string | null, user: any, messages: Message[], onSendMessage: (text: string) => void, onDeleteChat: () => void }) {
    const { t } = useLanguage();
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (!inputValue.trim()) return;
        onSendMessage(inputValue);
        setInputValue('');
    };

    if (!sessionId) {
        return (
            <Card className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">{t({ en: "Select a session to start chatting", ur: "چیٹنگ شروع کرنے کے لیے ایک سیشن منتخب کریں" })}</p>
            </Card>
        );
    }
    
    return (
        <Card className="flex-1 flex flex-col">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>{t({ en: "Conversation", ur: "گفتگو" })}</CardTitle>
                <Button variant="destructive" size="icon" onClick={onDeleteChat}><Trash2 className="h-4 w-4"/></Button>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-y-auto">
                <ScrollArea className="h-[55vh]">
                    <div className="p-4 space-y-4">
                        {messages.map(msg => {
                            const isSentByMe = msg.from === 'support';
                             return (
                                <div key={msg.id} className={cn('flex items-end gap-2', isSentByMe ? 'justify-end' : 'justify-start')}>
                                    {!isSentByMe && <Avatar className="w-8 h-8"><AvatarFallback>U</AvatarFallback></Avatar>}
                                    <div className={cn('max-w-[75%] p-3 rounded-lg', isSentByMe ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                    {isSentByMe && <Avatar className="w-8 h-8"><AvatarFallback>A</AvatarFallback></Avatar>}
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
                <div className="flex w-full items-center gap-2">
                    <Input
                        placeholder={t({ en: 'Type a message...', ur: 'ایک پیغام ٹائپ کریں...' })}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button onClick={handleSend} size="icon" disabled={!inputValue.trim()}>
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

export default function AdminChatPage() {
    const { user } = useAuth();
    const { sessions, loading, messages, sendMessage, deleteChat, setSessionIdForMessages, currentSessionId } = useChat(user?.uid, user?.role);

    const handleSendMessage = (text: string) => {
        if (!currentSessionId || !user) return;
        const activeSession = sessions.find(s => s.id === currentSessionId);
        if (!activeSession) return;
        
        sendMessage({
            sessionId: currentSessionId,
            text,
            senderId: user.uid,
            from: 'support',
            userName: activeSession.userName,
            userEmail: activeSession.userEmail
        });
    };
    
    const handleDeleteChat = () => {
        if (!currentSessionId) return;
        if (confirm('Are you sure you want to delete this chat session permanently?')) {
            deleteChat(currentSessionId);
        }
    };
    
    const activeMessages = currentSessionId ? messages[currentSessionId] || [] : [];

    return (
        <div className="flex flex-col md:flex-row gap-4 h-full">
            <SessionList sessions={sessions} activeSessionId={currentSessionId} onSelectSession={setSessionIdForMessages} loading={loading} />
            <ChatWindow sessionId={currentSessionId} user={user} messages={activeMessages} onSendMessage={handleSendMessage} onDeleteChat={handleDeleteChat} />
        </div>
    );
}
