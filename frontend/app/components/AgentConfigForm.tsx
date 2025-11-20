'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Save, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Document {
    id: string;
    filename: string;
}

interface AgentConfigFormProps {
    initialData?: any;
}

export default function AgentConfigForm({ initialData }: AgentConfigFormProps) {
    const router = useRouter();
    const [name, setName] = useState(initialData?.name || '');
    const [model, setModel] = useState(initialData?.model || 'gpt-3.5-turbo');
    const [systemPrompt, setSystemPrompt] = useState(initialData?.systemPrompt || 'You are a helpful AI assistant.');
    const [selectedDocs, setSelectedDocs] = useState<string[]>(initialData?.documentIds || []);
    const [availableDocs, setAvailableDocs] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const res = await api.get('/documents');
                if (Array.isArray(res.data)) {
                    setAvailableDocs(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch documents', err);
            }
        };
        fetchDocs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                name,
                model,
                system_prompt: systemPrompt,
                document_ids: selectedDocs,
                tools: [] // Add tools selection later
            };

            await api.post('/agents', payload);
            router.push('/dashboard');
        } catch (err) {
            console.error('Failed to create agent', err);
            setError('Failed to create agent. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleDoc = (id: string) => {
        setSelectedDocs(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-6">
                <div className="flex items-center space-x-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                        Agent Details
                    </h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Agent Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., HR Support Bot"
                            className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Model
                        </label>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        >
                            <option value="gpt-4">GPT-4</option>
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                            <option value="local-llama-7b">Local Llama 7B</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            System Prompt
                        </label>
                        <textarea
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y"
                            placeholder="Define the agent's personality and instructions..."
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-6">
                <div className="flex items-center space-x-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                        Knowledge Base
                    </h2>
                </div>

                <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                        Select documents this agent can access.
                    </p>

                    {availableDocs.length === 0 ? (
                        <div className="text-center p-6 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
                            <p className="text-neutral-500">No documents available. Upload some first.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {availableDocs.map((doc) => (
                                <div
                                    key={doc.id}
                                    onClick={() => toggleDoc(doc.id)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between
                    ${selectedDocs.includes(doc.id)
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-neutral-200 dark:border-neutral-700 hover:border-blue-300'
                                        }`}
                                >
                                    <span className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                                        {doc.filename}
                                    </span>
                                    {selectedDocs.includes(doc.id) && (
                                        <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium text-white transition-all
            ${loading
                            ? 'bg-neutral-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                        }`}
                >
                    <Save className="w-5 h-5 mr-2" />
                    {loading ? 'Creating Agent...' : 'Create Agent'}
                </button>
            </div>
        </form>
    );
}
