'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Bot, BarChart3, MessageSquare, Activity, Database } from 'lucide-react';
import api from '@/lib/api';

interface Agent {
    id: string;
    name: string;
    model: string;
}

export default function DashboardPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const res = await api.get('/agents');
                if (Array.isArray(res.data)) {
                    setAgents(res.data);
                }
            } catch (error) {
                console.error('Failed to fetch agents', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                            Dashboard
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                            Manage your AI agents and view performance metrics.
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href="/knowledge"
                            className="flex items-center px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-white border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shadow-sm"
                        >
                            <Database className="w-5 h-5 mr-2" />
                            Knowledge Base
                        </Link>
                        <Link
                            href="/ml"
                            className="flex items-center px-4 py-2 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-white border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shadow-sm"
                        >
                            <Activity className="w-5 h-5 mr-2" />
                            Fine-tuning
                        </Link>
                        <Link
                            href="/agents/new"
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Agent
                        </Link>
                    </div>
                </div>

                {/* Metrics Cards (Mock Data) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Conversations</h3>
                            <MessageSquare className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold text-neutral-900 dark:text-white">1,234</p>
                        <p className="text-xs text-green-500 mt-1 flex items-center">
                            <Activity className="w-3 h-3 mr-1" /> +12% from last week
                        </p>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Avg. Response Time</h3>
                            <Activity className="w-5 h-5 text-purple-500" />
                        </div>
                        <p className="text-3xl font-bold text-neutral-900 dark:text-white">1.2s</p>
                        <p className="text-xs text-green-500 mt-1 flex items-center">
                            <Activity className="w-3 h-3 mr-1" /> -0.3s improvement
                        </p>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Retrieval Accuracy</h3>
                            <BarChart3 className="w-5 h-5 text-orange-500" />
                        </div>
                        <p className="text-3xl font-bold text-neutral-900 dark:text-white">94%</p>
                        <p className="text-xs text-neutral-500 mt-1">Based on user feedback</p>
                    </div>
                </div>

                {/* Agents List */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            Your Agents
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-neutral-500">Loading agents...</div>
                    ) : agents.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bot className="w-8 h-8 text-neutral-400" />
                            </div>
                            <h3 className="text-neutral-900 dark:text-white font-medium">No agents created yet</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                                Create your first AI agent to get started.
                            </p>
                            <Link
                                href="/agents/new"
                                className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                Create Agent
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                            {agents.map((agent) => (
                                <Link key={agent.id} href={`/chat/${agent.id}`}>
                                    <div className="group p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer bg-neutral-50 dark:bg-neutral-800/50 hover:bg-white dark:hover:bg-neutral-800 hover:shadow-md">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-white dark:bg-neutral-900 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                                <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                Active
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                                            {agent.name}
                                        </h3>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                            Model: {agent.model}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
