'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, CheckCircle, Clock, Link as LinkIcon, UploadCloud, ChevronDown, Info, X,
    Loader2, Trash2, BookUser, ShieldCheck, Banknote, FileUp, FileCheck, AlertTriangle, GraduationCap
} from 'lucide-react';

// ============================================================================
// Types & Initial Data Structure
// ============================================================================

interface DocumentFile {
    _id: string;
    fileName: string;
    fileType: 'link' | 'file';
    url: string; // URL to the stored file (e.g., on S3) or the Google Docs link
    status: 'Verified' | 'Pending' | 'Rejected';
    uploadedAt: string;
    rejectionReason?: string;
}

interface DocumentItem {
    id: string; // e.g., 'passport'
    label: string;
    files: DocumentFile[];
}

interface DocumentCategory {
    id: string; // e.g., 'personal_info'
    label: string;
    icon: React.ElementType;
    items: DocumentItem[];
}

// Mock initial data structure. In a real app, this would be fetched from your API.
const initialDocumentStructure: DocumentCategory[] = [
    {
        id: 'application', label: 'Application Documents', icon: BookUser,
        items: [
            { id: 'resume_cv', label: 'Resume / CV', files: [] },
            { id: 'sop', label: 'Statement of Purpose (SOP)', files: [] },
            { id: 'lor', label: 'Letters of Recommendation (LOR)', files: [] },
        ]
    },
    {
        id: 'transcripts', label: 'Degrees & Transcripts', icon: GraduationCap,
        items: [
            { id: 'bachelors_transcript', label: "Bachelor's Degree Transcripts", files: [] },
            { id: 'masters_transcript', label: "Master's Degree Transcripts", files: [] },
            { id: 'bachelors_degree', label: "Bachelor's Degree Certificate", files: [] },
        ]
    },
    {
        id: 'visa', label: 'Visa Documents', icon: ShieldCheck,
        items: [
            { id: 'passport', label: 'Passport', files: [] },
            { id: 'visa_photo', label: 'Visa Photo', files: [] },
            { id: 'proof_of_funds', label: 'Proof of Funds', files: [] },
        ]
    },
    {
        id: 'financial', label: 'Financial Documents', icon: Banknote,
        items: [
            { id: 'bank_statement', label: 'Bank Statement', files: [] },
            { id: 'scholarship_letter', label: 'Scholarship Award Letter', files: [] },
        ]
    },
];


// ============================================================================
// Mock API Functions
// ============================================================================
// MOCK: Simulates fetching the user's documents from your MongoDB.
const fetchUserDocuments = async () => {
    await new Promise(res => setTimeout(res, 800));
    const stored = localStorage.getItem('userDocuments');
    return stored ? JSON.parse(stored) : initialDocumentStructure;
};

// MOCK: Simulates saving a new document's metadata to MongoDB.
const saveDocumentMetadata = async (categoryId: string, itemId: string, fileData: Omit<DocumentFile, '_id' | 'uploadedAt'>) => {
    console.log("Saving to DB:", { categoryId, itemId, fileData });
    await new Promise(res => setTimeout(res, 1000));
    // In a real app, you would make a POST request to your API here.
    // The API would then add this metadata to the correct user document in MongoDB.
    return {
        success: true,
        data: {
            ...fileData,
            _id: Date.now().toString(),
            uploadedAt: new Date().toISOString(),
        }
    };
};

// MOCK: Simulates uploading a file to a service like AWS S3 or Cloudinary.
const uploadFileToServer = async (file: File) => {
    console.log(`Uploading file "${file.name}" to cloud storage...`);
    await new Promise(res => setTimeout(res, 1500));
    // In a real app, this function would handle the multipart/form-data POST request
    // to your file storage service and return the public URL of the stored file.
    return {
        success: true,
        url: `https://mock-storage.com/user-files/${Date.now()}-${file.name}`
    };
};


// ============================================================================
// UI Components
// ============================================================================

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
    <div className="group relative flex items-center">
        <Info size={16} className="text-slate-400 cursor-pointer" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {text}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
        </div>
    </div>
);

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (fileData: Omit<DocumentFile, '_id' | 'uploadedAt'>) => Promise<void>;
    documentLabel: string;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload, documentLabel }) => {
    const [uploadType, setUploadType] = useState<'link' | 'file' | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [link, setLink] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
                setError('File size must not exceed 10MB.');
                return;
            }
            setError('');
            setFile(selectedFile);
        }
    };

    const handleSubmit = async () => {
        setIsUploading(true);
        setError('');
        if (uploadType === 'link') {
            if (!link.startsWith('http')) {
                setError('Please enter a valid URL.');
                setIsUploading(false);
                return;
            }
            await onUpload({ fileName: link, fileType: 'link', url: link, status: 'Pending' });
        } else if (uploadType === 'file' && file) {
            const uploadResult = await uploadFileToServer(file);
            if (uploadResult.success) {
                await onUpload({ fileName: file.name, fileType: 'file', url: uploadResult.url, status: 'Pending' });
            } else {
                setError('File upload failed. Please try again.');
            }
        }
        setIsUploading(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-500 hover:bg-slate-100 rounded-full"><X size={20} /></button>

                    <div className="p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-1">Upload: {documentLabel}</h2>
                        <div className="my-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex gap-3">
                            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div><strong className="font-semibold">Important Note:</strong> For security, we recommend sharing documents with comment-only access. Full editing is not required.</div>
                        </div>

                        {/* Option Selectors */}
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <button onClick={() => setUploadType('link')} className={`p-4 border-2 rounded-lg text-center transition-all ${uploadType === 'link' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                <LinkIcon className="w-8 h-8 mx-auto text-slate-500 mb-2" />
                                <span className="font-semibold text-slate-700">Share a Google Doc</span>
                            </button>
                            <button onClick={() => setUploadType('file')} className={`p-4 border-2 rounded-lg text-center transition-all ${uploadType === 'file' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                <UploadCloud className="w-8 h-8 mx-auto text-slate-500 mb-2" />
                                <span className="font-semibold text-slate-700">Upload from Device</span>
                            </button>
                        </div>

                        {/* Dynamic Form Content */}
                        <div className="mt-6 min-h-[120px]">
                            <AnimatePresence mode="wait">
                                {uploadType === 'link' && (
                                    <motion.div key="link" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <label htmlFor="link-input" className="block text-sm font-medium text-slate-600 mb-1">Paste Google Doc link here</label>
                                        <input id="link-input" type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://docs.google.com/document/d/..." className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </motion.div>
                                )}
                                {uploadType === 'file' && (
                                    <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <label htmlFor="file-input" className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                                            <FileUp size={32} className="text-slate-400 mb-2" />
                                            <span className="font-semibold text-blue-600">{file ? 'Change file' : 'Click to upload'}</span>
                                            <span className="text-xs text-slate-500 mt-1">DOCX, PDF, JPG, PNG (Max 10MB)</span>
                                            <input id="file-input" type="file" onChange={handleFileChange} className="hidden" accept=".docx,.pdf,.jpg,.jpeg,.png,.txt" />
                                        </label>
                                        {file && <p className="text-sm text-slate-600 mt-2 text-center font-medium">Selected: {file.name}</p>}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {error && <p className="text-sm text-red-600 text-center mt-2">{error}</p>}
                    </div>

                    <div className="bg-slate-50 p-4 flex justify-end">
                        <button onClick={handleSubmit} disabled={isUploading || !uploadType || (uploadType === 'file' && !file)}
                            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center gap-2">
                            {isUploading ? <Loader2 className="animate-spin" /> : <UploadCloud size={18} />}
                            {isUploading ? 'Uploading...' : 'Upload Document'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};


// ============================================================================
// Main Documents Hub Component
// ============================================================================
const DocumentsHub = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [documents, setDocuments] = useState<DocumentCategory[]>([]);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeDocumentTarget, setActiveDocumentTarget] = useState<{ categoryId: string, itemId: string, label: string } | null>(null);

    useEffect(() => {
        fetchUserDocuments().then(data => {
            setDocuments(data);
            setIsLoading(false);
        });
    }, []);

    const handleUploadClick = (categoryId: string, itemId: string, label: string) => {
        setActiveDocumentTarget({ categoryId, itemId, label });
        setIsModalOpen(true);
    };

    const handleUploadSubmit = async (fileData: Omit<DocumentFile, '_id' | 'uploadedAt'>) => {
        if (!activeDocumentTarget) return;

        const result = await saveDocumentMetadata(activeDocumentTarget.categoryId, activeDocumentTarget.itemId, fileData);
        if (result.success) {
            const newFile = result.data;
            // Update the state with the new file
            const newDocs = documents.map(cat => {
                if (cat.id === activeDocumentTarget.categoryId) {
                    return {
                        ...cat,
                        items: cat.items.map(item => {
                            if (item.id === activeDocumentTarget.itemId) {
                                return { ...item, files: [...item.files, newFile] };
                            }
                            return item;
                        })
                    };
                }
                return cat;
            });
            setDocuments(newDocs);
            localStorage.setItem('userDocuments', JSON.stringify(newDocs)); // Persist mock data
        }
    };

    const handleRemoveFile = (categoryId: string, itemId: string, fileId: string) => {
        const newDocs = documents.map(cat => {
            if (cat.id === categoryId) {
                return {
                    ...cat,
                    items: cat.items.map(item => {
                        if (item.id === itemId) {
                            return { ...item, files: item.files.filter(f => f._id !== fileId) };
                        }
                        return item;
                    })
                };
            }
            return cat;
        });
        setDocuments(newDocs);
        localStorage.setItem('userDocuments', JSON.stringify(newDocs)); // Persist mock data
    };

    if (isLoading) return <div className="w-full flex justify-center items-center p-20"><Loader2 size={32} className="text-blue-500 animate-spin" /></div>;

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Documents Hub</h2>
                <InfoTooltip text="For your security, files are stored in a secure cloud bucket. We only store the access links and metadata in our database. Max file size: 10MB." />
            </div>

            <div className="space-y-3">
                {documents.map((category) => (
                    <div key={category.id} className="border border-slate-200 rounded-xl overflow-hidden">
                        {/* Accordion Header */}
                        <button onClick={() => setOpenAccordion(openAccordion === category.id ? null : category.id)}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <category.icon className="w-6 h-6 text-slate-500" />
                                <span className="font-semibold text-slate-700">{category.label}</span>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openAccordion === category.id ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Accordion Content */}
                        <AnimatePresence>
                            {openAccordion === category.id && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden">
                                    <div className="p-4 space-y-3">
                                        {category.items.map((item) => (
                                            <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-3">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-medium text-slate-600 text-sm">{item.label}</p>
                                                    <button onClick={() => handleUploadClick(category.id, item.id, item.label)}
                                                        className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-200 transition-colors flex items-center gap-1.5">
                                                        <UploadCloud size={14} /> Upload
                                                    </button>
                                                </div>
                                                {item.files.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                                                        {item.files.map(file => (
                                                            <div key={file._id} className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded-md">
                                                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline truncate">
                                                                    {file.fileType === 'link' ? <LinkIcon size={14} /> : <FileCheck size={14} />}
                                                                    <span className="truncate">{file.fileName}</span>
                                                                </a>
                                                                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${file.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                        {file.status}
                                                                    </span>
                                                                    <button onClick={() => handleRemoveFile(category.id, item.id, file._id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            <UploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpload={handleUploadSubmit}
                documentLabel={activeDocumentTarget?.label || ''}
            />
        </div>
    );
};

export default DocumentsHub;