'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import MessageBubble from './MessageBubble';
import api from '@/lib/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    citations?: string[];
}

interface ChatWindowProps {
    agentId: string;
}

export default function ChatWindow({ agentId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Convert history to format expected by backend
            const history = messages.map(m => ({ role: m.role, content: m.content }));

            const res = await api.post('/chat', {
                agent_id: agentId,
                message: userMessage.content,
                history: history
            });

            const assistantMessage: Message = {
                role: 'assistant',
                content: res.data.response,
                citations: res.data.citations // Assuming backend returns list of filenames or snippets
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat failed', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error processing your request.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">

            <div className="flex-1 overflow-y-auto p-6">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                        <p>Start a conversation with your agent.</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, idx) => (
                            <MessageBubble
                                key={idx}
                                role={msg.role}
                                content={msg.content}
                                citations={msg.citations}
                            />
                        ))}
                        {loading && (
                            <div className="flex justify-start mb-6">
                                <div className="flex items-center space-x-2 bg-white dark:bg-neutral-800 px-4 py-3 rounded-2xl rounded-tl-none border border-neutral-200 dark:border-neutral-700">
                                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                                    <span className="text-sm text-neutral-500">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <div className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
                <form onSubmit={handleSend} className="flex space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className={`p-2 rounded-lg transition-all
              ${loading || !input.trim()
                                ? 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                            }`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
