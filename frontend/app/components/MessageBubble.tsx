'use client';

import React from 'react';
import { User, Bot, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    citations?: string[];
}

export default function MessageBubble({ role, content, citations }: MessageBubbleProps) {
    const isUser = role === 'user';

    return (
        <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
            <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>

                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'}`}>
                    {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed
            ${isUser
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-tl-none'
                        }`}>
                        <ReactMarkdown
                            components={{
                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                code: ({ node, ...props }) => <code className="bg-black/10 dark:bg-white/10 rounded px-1 py-0.5" {...props} />,
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>

                    {citations && citations.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {citations.map((citation, idx) => (
                                <div key={idx} className="flex items-center px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                                    <FileText className="w-3 h-3 mr-1" />
                                    <span className="truncate max-w-[150px]">{citation}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
