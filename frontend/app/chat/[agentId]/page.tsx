'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ChatWindow from '@/app/components/ChatWindow';
import api from '@/lib/api';
import { Bot, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Agent {
    id: string;
    name: string;
    model: string;
}

export default function ChatPage() {
    const params = useParams();
    const agentId = params.agentId as string;
    const [agent, setAgent] = useState<Agent | null>(null);
    const [sessions, setSessions] = useState<any[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [agentRes, sessionsRes] = await Promise.all([
                    api.get(`/agents/${agentId}`),
                    api.get(`/chat/sessions/${agentId}`)
                ]);
                setAgent(agentRes.data);
                setSessions(sessionsRes.data);

                // Auto-load most recent session
                if (sessionsRes.data.length > 0) {
                    setCurrentSessionId(sessionsRes.data[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch data', error);
            }
        };
        if (agentId) {
            fetchData();
        }
    }, [agentId]);

    const startNewChat = () => {
        setCurrentSessionId(undefined);
        // Force re-render of ChatWindow to clear state
        // A simple way is to use a key, but ChatWindow handles undefined sessionId as new chat
        // We might need to clear messages in ChatWindow. 
        // Actually, changing the key of ChatWindow is the cleanest way to reset it.
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                <div className="flex items-center justify-between">
                    <Link href="/dashboard" className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </Link>
                    <button
                        onClick={startNewChat}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Start New Chat
                    </button>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white dark:bg-neutral-900 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-800">
                        <Bot className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                            {agent ? agent.name : 'Loading Agent...'}
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                            {agent ? `Powered by ${agent.model}` : '...'}
                        </p>
                    </div>
                </div>

                {/* Key ensures component resets when session changes or new chat starts */}
                <ChatWindow
                    key={currentSessionId || 'new'}
                    agentId={agentId}
                    initialSessionId={currentSessionId}
                />

                {/* Simple Session List for switching */}
                {sessions.length > 0 && (
                    <div className="mt-8 border-t pt-6">
                        <h3 className="text-sm font-medium text-neutral-500 mb-3">Recent Sessions</h3>
                        <div className="flex flex-wrap gap-2">
                            {sessions.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setCurrentSessionId(s.id)}
                                    className={`px-3 py-1 text-xs rounded-full border transition-colors
                                        ${currentSessionId === s.id
                                            ? 'bg-blue-100 border-blue-300 text-blue-800'
                                            : 'bg-white border-neutral-200 text-neutral-600 hover:border-blue-300'
                                        }`}
                                >
                                    {new Date(s.created_at).toLocaleString()}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
