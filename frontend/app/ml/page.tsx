'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Activity, Play, CheckCircle, AlertCircle, Terminal, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MLPage() {
    const [status, setStatus] = useState<any>({ status: 'idle' });
    const [loading, setLoading] = useState(false);
    const [epochs, setEpochs] = useState(3);
    const [mock, setMock] = useState(true);

    const fetchStatus = async () => {
        try {
            const res = await api.get('/ml/status');
            setStatus(res.data);
        } catch (error) {
            console.error('Failed to fetch status', error);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 2000);
        return () => clearInterval(interval);
    }, []);

    const startTraining = async () => {
        setLoading(true);
        try {
            await api.post('/ml/train', {
                epochs,
                model_name: "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
                mock
            });
        } catch (error) {
            console.error('Failed to start training', error);
        } finally {
            setLoading(false);
        }
    };

    const getProgress = () => {
        if (status.status !== 'training' && status.status !== 'completed') return 0;
        if (!status.total_steps) return 0;
        return (status.step / status.total_steps) * 100;
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                <Link href="/dashboard" className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                </Link>

                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white dark:bg-neutral-900 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-800">
                        <Activity className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                            Fine-tuning Studio
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                            Train your agent on collected chat logs using LoRA.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Configuration Card */}
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-6">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-4">
                            Configuration
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Base Model
                            </label>
                            <select disabled className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed">
                                <option>TinyLlama-1.1B-Chat</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Epochs
                            </label>
                            <input
                                type="number"
                                value={epochs}
                                onChange={(e) => setEpochs(parseInt(e.target.value))}
                                min={1}
                                max={10}
                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={mock}
                                onChange={(e) => setMock(e.target.checked)}
                                id="mock"
                                className="rounded border-neutral-300 text-purple-600 focus:ring-purple-500"
                            />
                            <label htmlFor="mock" className="text-sm text-neutral-700 dark:text-neutral-300">
                                Mock Training (Demo Mode)
                            </label>
                        </div>

                        <button
                            onClick={startTraining}
                            disabled={loading || status.status === 'training'}
                            className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium text-white transition-all
                ${loading || status.status === 'training'
                                    ? 'bg-neutral-400 cursor-not-allowed'
                                    : 'bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg'
                                }`}
                        >
                            {status.status === 'training' ? (
                                <>
                                    <Activity className="w-4 h-4 mr-2 animate-spin" /> Training...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 mr-2" /> Start Fine-tuning
                                </>
                            )}
                        </button>
                    </div>

                    {/* Status Card */}
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-6">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-4">
                            Training Status
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-500">Status:</span>
                                <span className={`font-medium px-2 py-0.5 rounded-full
                  ${status.status === 'training' ? 'bg-blue-100 text-blue-700' :
                                        status.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            'bg-neutral-100 text-neutral-700'}`}>
                                    {status.status.toUpperCase()}
                                </span>
                            </div>

                            {status.status !== 'idle' && (
                                <>
                                    <div>
                                        <div className="flex justify-between text-xs text-neutral-500 mb-1">
                                            <span>Progress</span>
                                            <span>{Math.round(getProgress())}%</span>
                                        </div>
                                        <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-purple-600 h-full transition-all duration-500"
                                                style={{ width: `${getProgress()}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-black/90 rounded-lg p-4 font-mono text-xs text-green-400 h-40 overflow-y-auto">
                                        <div className="flex items-center space-x-2 mb-2 border-b border-white/10 pb-2">
                                            <Terminal className="w-3 h-3" />
                                            <span>Training Logs</span>
                                        </div>
                                        {status.loss && (
                                            <p>Step {status.step}/{status.total_steps}: Loss = {status.loss.toFixed(4)}</p>
                                        )}
                                        {status.status === 'completed' && (
                                            <p className="text-blue-400">Training finished successfully.</p>
                                        )}
                                    </div>
                                </>
                            )}

                            {status.status === 'idle' && (
                                <div className="h-40 flex flex-col items-center justify-center text-neutral-400 text-sm">
                                    <Activity className="w-8 h-8 mb-2 opacity-20" />
                                    <p>Ready to start training</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
