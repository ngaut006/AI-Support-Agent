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

    useEffect(() => {
        const fetchAgent = async () => {
            try {
                const res = await api.get(`/agents/${agentId}`);
                setAgent(res.data);
            } catch (error) {
                console.error('Failed to fetch agent', error);
            }
        };
        if (agentId) {
            fetchAgent();
        }
    }, [agentId]);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                <Link href="/dashboard" className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                </Link>

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

                <ChatWindow agentId={agentId} />
            </div>
        </div>
    );
}
