'use client';

import React, { useState, useCallback } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface FileUploadProps {
    onUploadComplete?: () => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{ [key: string]: 'pending' | 'success' | 'error' }>({});

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles((prev) => [...prev, ...droppedFiles]);
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...selectedFiles]);
        }
    }, []);

    const removeFile = (name: string) => {
        setFiles((prev) => prev.filter((f) => f.name !== name));
        setUploadStatus((prev) => {
            const newStatus = { ...prev };
            delete newStatus[name];
            return newStatus;
        });
    };

    const uploadFiles = async () => {
        setUploading(true);
        for (const file of files) {
            if (uploadStatus[file.name] === 'success') continue;

            try {
                const formData = new FormData();
                formData.append('file', file);

                await api.post('/documents/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                setUploadStatus((prev) => ({ ...prev, [file.name]: 'success' }));
            } catch (error) {
                console.error('Upload failed', error);
                setUploadStatus((prev) => ({ ...prev, [file.name]: 'error' }));
            }
        }
        setUploading(false);
        if (onUploadComplete) onUploadComplete();
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-10 transition-all duration-200 ease-in-out flex flex-col items-center justify-center text-center cursor-pointer
          ${isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                    }`}
            >
                <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Drop files here or click to upload
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                    Support for PDF, DOCX, TXT
                </p>
            </div>

            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-6 space-y-3"
                    >
                        {files.map((file) => (
                            <div
                                key={file.name}
                                className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white dark:bg-neutral-900 rounded-md border border-neutral-200 dark:border-neutral-700">
                                        <File className="w-5 h-5 text-neutral-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate max-w-[200px]">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    {uploadStatus[file.name] === 'success' && (
                                        <span className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium">
                                            <CheckCircle className="w-4 h-4 mr-1" /> Uploaded
                                        </span>
                                    )}
                                    {uploadStatus[file.name] === 'error' && (
                                        <span className="flex items-center text-xs text-red-600 dark:text-red-400 font-medium">
                                            <AlertCircle className="w-4 h-4 mr-1" /> Failed
                                        </span>
                                    )}
                                    <button
                                        onClick={() => removeFile(file.name)}
                                        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4 text-neutral-500" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={uploadFiles}
                                disabled={uploading || files.length === 0}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all
                  ${uploading || files.length === 0
                                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed dark:bg-neutral-800 dark:text-neutral-600'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                    }`}
                            >
                                {uploading ? 'Uploading...' : 'Upload All Files'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
