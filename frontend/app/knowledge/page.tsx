'use client';

import React, { useEffect, useState } from 'react';
import FileUpload from '@/app/components/FileUpload';
import api from '@/lib/api';
import { FileText, Trash2, Database } from 'lucide-react';

interface Document {
    id: string;
    filename: string;
    status: string;
    chunks: number;
}

export default function KnowledgeBasePage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDocuments = async () => {
        try {
            // Mocking the list for now as backend list endpoint is mock
            // In real implementation: const res = await api.get('/documents');
            // setDocuments(res.data);

            // For MVP demo, we might rely on local state or just show what we have
            // Let's try to hit the endpoint, even if it returns a mock message
            const res = await api.get('/documents');

            // If the backend returns the mock message, we'll just show an empty list or some dummy data for UI demo
            if (Array.isArray(res.data) && res.data[0]?.message) {
                // If backend is just returning a message, let's not crash
                setDocuments([]);
            } else {
                setDocuments(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch documents', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/documents/${id}`);
            setDocuments(documents.filter(doc => doc.id !== id));
        } catch (error) {
            console.error('Failed to delete document', error);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                            Knowledge Base
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                            Upload documents to train your AI agents.
                        </p>
                    </div>
                    <div className="p-3 bg-white dark:bg-neutral-900 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-800">
                        <Database className="w-6 h-6 text-blue-600" />
                    </div>
                </div>

                <FileUpload onUploadComplete={fetchDocuments} />

                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            Uploaded Documents
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-neutral-500">Loading...</div>
                    ) : documents.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-neutral-400" />
                            </div>
                            <h3 className="text-neutral-900 dark:text-white font-medium">No documents yet</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                                Upload your first document to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                            {documents.map((doc) => (
                                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-neutral-900 dark:text-white">{doc.filename}</p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">
                                                    {doc.status}
                                                </span>
                                                <span className="text-xs text-neutral-500">
                                                    {doc.chunks} chunks
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
