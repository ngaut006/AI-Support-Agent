import React from 'react';
import AgentConfigForm from '@/app/components/AgentConfigForm';

export default function NewAgentPage() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 tracking-tight">
                    Create New Agent
                </h1>
                <AgentConfigForm />
            </div>
        </div>
    );
}
