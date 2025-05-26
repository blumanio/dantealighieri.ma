// client/components/profile/MessagingSection.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';
import { Loader2, Send, PlusCircle, UserPlus, Search, AlertTriangle, Info, UserCircle, MessageSquare } from 'lucide-react';
import { IConversation, IMessage } from '@/lib/models/Message'; // Adjust path if your models are elsewhere

// Define Conversation type locally or import if exported from model
interface ConversationWithDetails extends IConversation {
    _id: string; // Ensure _id is part of the type
    // participantDetails should include info about the *other* user(s)
    otherParticipant?: { 
        userId: string;
        fullName: string;
        avatarUrl?: string;
        role?: string;
    };
    unreadCount?: number; // Optional: for displaying unread messages
}


const MessagingSection: React.FC = () => {
    const { user, isSignedIn } = useUser();
    const { language, t } = useLanguage();
    const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<ConversationWithDetails | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [newMessageContent, setNewMessageContent] = useState('');
    
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    // TODO: Add state and UI for starting a new conversation (e.g., search users)
    const [showNewConversationModal, setShowNewConversationModal] = useState(false);
    const [searchUserTerm, setSearchUserTerm] = useState('');
    const [searchedUsers, setSearchedUsers] = useState<{id: string, fullName: string, avatarUrl?: string}[]>([]); // Placeholder for search results


    const fetchConversations = useCallback(async () => {
        if (!isSignedIn) return;
        setIsLoadingConversations(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/messaging/conversations`);
            if (!response.ok) throw new Error(t('messaging', 'errorFetchConversations', {defaultValue: 'Failed to fetch conversations.'}));
            const data = await response.json();
            if (data.success) {
                // Enrich conversation with details of the "other" participant
                const enrichedConversations = data.data.map((convo: IConversation) => {
                    const otherParticipantDetail = convo.participantDetails?.find(p => p.userId !== user?.id);
                    return {
                        ...convo,
                        otherParticipant: otherParticipantDetail || { userId: 'unknown', fullName: 'Unknown User' },
                        // TODO: Calculate unreadCount if API doesn't provide it
                    };
                });
                setConversations(enrichedConversations);
            } else {
                throw new Error(data.message || 'Failed to fetch conversations.');
            }
        } catch (err: any) { setError(err.message); }
        finally { setIsLoadingConversations(false); }
    }, [isSignedIn, user?.id, API_BASE_URL, t]);

    const fetchMessages = useCallback(async (conversationId: string) => {
        if (!isSignedIn || !conversationId) return;
        setIsLoadingMessages(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/messaging/conversations/${conversationId}/messages`);
            if (!response.ok) throw new Error(t('messaging', 'errorFetchMessages', {defaultValue: 'Failed to fetch messages.'}));
            const data = await response.json();
            if (data.success) {
                setMessages(data.data);
                 // Mark conversation as read or update unread count locally
                setConversations(prev => prev.map(c => c._id === conversationId ? {...c, unreadCount: 0} : c));
            } else {
                throw new Error(data.message || 'Failed to fetch messages.');
            }
        } catch (err: any) { setError(err.message); }
        finally { setIsLoadingMessages(false); }
    }, [isSignedIn, API_BASE_URL, t]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    useEffect(() => {
        if (selectedConversation?._id) {
            fetchMessages(selectedConversation._id);
        } else {
            setMessages([]); // Clear messages if no conversation is selected
        }
    }, [selectedConversation, fetchMessages]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newMessageContent.trim() || !selectedConversation?._id || !isSignedIn) return;
        setIsSendingMessage(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/messaging/conversations/${selectedConversation._id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessageContent }),
            });
            if (!response.ok) throw new Error(t('messaging', 'errorSendMessage', {defaultValue: 'Failed to send message.'}));
            const data = await response.json();
            if (data.success) {
                setMessages(prev => [...prev, data.data]);
                setNewMessageContent('');
                // Update last message in conversations list (optimistic or re-fetch)
                setConversations(prevConvos => prevConvos.map(c => 
                    c._id === selectedConversation._id 
                    ? { ...c, lastMessage: { content: data.data.content, senderId: data.data.senderId, timestamp: new Date(data.data.createdAt) } } 
                    : c
                ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())); // Re-sort
            } else {
                throw new Error(data.message || 'Failed to send message.');
            }
        } catch (err: any) { setError(err.message); }
        finally { setIsSendingMessage(false); }
    };

    const handleStartNewConversation = async (recipientId: string) => {
        if (!isSignedIn || !recipientId) return;
        // TODO: Add loading state for starting conversation
        try {
            const response = await fetch(`${API_BASE_URL}/api/messaging/conversations`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({recipientId})
            });
            if (!response.ok) throw new Error(t('messaging', 'errorStartConversation', {defaultValue:'Failed to start conversation.'}));
            const data = await response.json();
            if (data.success) {
                const newConvo = data.data;
                const otherP = newConvo.participantDetails?.find((p:any) => p.userId !== user?.id);
                const enrichedNewConvo = {...newConvo, otherParticipant: otherP || { userId: 'unknown', fullName: 'Unknown User' }};

                setConversations(prev => [enrichedNewConvo, ...prev.filter(c => c._id !== newConvo._id)]);
                setSelectedConversation(enrichedNewConvo);
                setShowNewConversationModal(false);
                setSearchUserTerm('');
                setSearchedUsers([]);
            } else {
                 throw new Error(data.message || 'Failed to start conversation.');
            }
        } catch (err:any) { setError(err.message); }
    };
    
    // Placeholder for user search function
    const handleUserSearch = async () => {
        if(!searchUserTerm.trim()) {
            setSearchedUsers([]);
            return;
        }
        // MOCK SEARCH - Replace with actual API call to /api/users/search?q=... or similar
        console.log("Searching for users:", searchUserTerm);
        // Simulating an API call
        setTimeout(() => {
            const mockResults = [
                // In a real app, fetch users from your backend.
                // For now, ensure you can select someone to test starting a convo.
                // You might need to manually create a few UserProfileDetail entries in your DB.
                // { id: 'clerk_user_id_of_another_user', fullName: 'Test User Two', avatarUrl: '/path/to/avatar.png' },
            ].filter(u => u.fullName.toLowerCase().includes(searchUserTerm.toLowerCase()));
            setSearchedUsers(mockResults);
            if (mockResults.length === 0) console.log("No mock users found for:", searchUserTerm);
        }, 500);
    };


    if (!isSignedIn) {
        return <div className="p-6 text-center text-neutral-600">{t('profile', 'signInToViewMessages', {defaultValue: 'Please sign in to view your messages.'})}</div>;
    }
    if (isLoadingConversations) {
        return <div className="p-6 flex justify-center items-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    return (
        <div className="h-[calc(100vh-200px)] md:h-[calc(100vh-150px)] flex flex-col md:flex-row border border-neutral-200 rounded-lg overflow-hidden">
            {/* Conversation List Sidebar */}
            <div className={`w-full md:w-1/3 lg:w-1/4 border-b md:border-b-0 ${language === 'ar' ? 'md:border-l' : 'md:border-r'} border-neutral-200 flex flex-col bg-neutral-50`}>
                <div className="p-3 border-b border-neutral-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-textPrimary">{t('messaging', 'conversationsTitle', {defaultValue: 'Conversations'})}</h3>
                    <button onClick={() => setShowNewConversationModal(true)} title={t('messaging','newConversationTooltip', {defaultValue:"Start new conversation"})} className="p-1.5 text-primary hover:bg-primary/10 rounded-full">
                        <UserPlus size={20} />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    {conversations.length === 0 && !isLoadingConversations && (
                        <div className="p-4 text-center text-sm text-neutral-500 h-full flex flex-col justify-center items-center">
                            <Info size={24} className="mb-2 opacity-50"/>
                            {t('messaging', 'noConversations', {defaultValue: 'No conversations yet. Start a new one!'})}
                        </div>
                    )}
                    {conversations.map(convo => (
                        <button
                            key={convo._id}
                            onClick={() => setSelectedConversation(convo)}
                            className={`w-full text-left p-3 flex items-center gap-3 hover:bg-primary/5 transition-colors
                                        ${selectedConversation?._id === convo._id ? 'bg-primary/10 border-primary ' + (language === 'ar' ? 'border-r-2' : 'border-l-2') : 'border-transparent border-l-2 md:border-r-2'}`}
                        >
                            <img src={convo.otherParticipant?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(convo.otherParticipant?.fullName || 'U')}&background=random&color=fff`} 
                                 alt={convo.otherParticipant?.fullName} 
                                 className="w-10 h-10 rounded-full flex-shrink-0" />
                            <div className="flex-grow overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <p className="font-medium text-textPrimary text-sm truncate">{convo.otherParticipant?.fullName}</p>
                                    {convo.lastMessage?.timestamp && <p className="text-xs text-neutral-400 flex-shrink-0 ml-2">{new Date(convo.lastMessage.timestamp).toLocaleTimeString(language, {hour:'2-digit', minute:'2-digit'})}</p>}
                                </div>
                                <p className={`text-xs truncate ${convo.unreadCount && convo.unreadCount > 0 ? 'text-primary font-semibold' : 'text-textSecondary'}`}>
                                    {convo.lastMessage?.senderId === user?.id && "You: "}
                                    {convo.lastMessage?.content || t('messaging','draftMessage', {defaultValue:'Draft...'})}
                                </p>
                            </div>
                             {convo.unreadCount && convo.unreadCount > 0 && (
                                <span className="ml-auto bg-primary text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                                    {convo.unreadCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedConversation ? (
                    <>
                        <div className={`p-3 border-b border-neutral-200 flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <img src={selectedConversation.otherParticipant?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConversation.otherParticipant?.fullName || 'U')}&background=random&color=fff`} 
                                 alt={selectedConversation.otherParticipant?.fullName} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-semibold text-textPrimary">{selectedConversation.otherParticipant?.fullName}</p>
                                {selectedConversation.otherParticipant?.role && <p className="text-xs text-textSecondary">{t('profileFieldLabels', `role_${selectedConversation.otherParticipant.role}`, {defaultValue: selectedConversation.otherParticipant.role})}</p>}
                            </div>
                        </div>
                        <div className="flex-grow p-4 space-y-3 overflow-y-auto custom-scrollbar">
                            {isLoadingMessages ? (
                                <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin h-6 w-6 text-primary" /></div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex flex-col justify-center items-center text-neutral-500">
                                    <MessageSquare size={32} className="mb-2 opacity-50"/>
                                     {t('messaging','noMessagesYet', {name: selectedConversation.otherParticipant?.fullName || "this user"})}
                                </div>
                            ) : (
                                messages.map(msg => (
                                    <div key={msg._id} className={`flex ${msg.senderId === user?.id ? (language === 'ar' ? 'justify-start' : 'justify-end') : (language === 'ar' ? 'justify-end' : 'justify-start')}`}>
                                        <div className={`max-w-[70%] p-2.5 rounded-xl shadow-sm ${
                                            msg.senderId === user?.id 
                                            ? 'bg-primary text-white rounded-br-none' 
                                            : 'bg-neutral-100 text-textPrimary rounded-bl-none'
                                        }`}>
                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                            <p className={`text-[0.65rem] mt-1 ${msg.senderId === user?.id ? 'text-primary-light/80 text-right' : 'text-neutral-400 text-left'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString(language, {hour:'2-digit', minute:'2-digit'})}
                                                {msg.senderId === user?.id && msg.readBy && msg.readBy.length > 1 && <span className="ml-1">✓✓</span>}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-200 bg-neutral-50 flex items-center gap-2">
                            <input
                                type="text"
                                value={newMessageContent}
                                onChange={(e) => setNewMessageContent(e.target.value)}
                                placeholder={t('messaging','typeMessagePlaceholder', {defaultValue: "Type a message..."})}
                                className="flex-grow p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                            />
                            <button type="submit" disabled={isSendingMessage || !newMessageContent.trim()} 
                                    className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-60 transition-colors">
                                {isSendingMessage ? <Loader2 className="h-5 w-5 animate-spin"/> : <Send size={20} />}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="h-full flex flex-col justify-center items-center text-neutral-500 p-4">
                        <MessageSquare size={40} className="mb-3 opacity-50"/>
                        <p className="text-center">{t('messaging','selectConversationPrompt', {defaultValue: "Select a conversation to start messaging, or start a new one!"})}</p>
                    </div>
                )}
            </div>

            {/* New Conversation Modal */}
            {showNewConversationModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">{t('messaging','startNewConversationTitle', {defaultValue:"Start New Conversation"})}</h3>
                        <input 
                            type="text" 
                            placeholder={t('messaging','searchUserPlaceholder', {defaultValue:"Search for a user..."})}
                            value={searchUserTerm}
                            onChange={e => setSearchUserTerm(e.target.value)}
                            onKeyUp={handleUserSearch} // Or add a search button
                            className="w-full p-2 border rounded-md mb-3"
                        />
                        <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                            {searchedUsers.length > 0 ? searchedUsers.map(u => (
                                <button key={u.id} onClick={() => handleStartNewConversation(u.id)}
                                    className="w-full text-left p-2 hover:bg-neutral-100 rounded-md flex items-center gap-2">
                                    <img src={u.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName)}&background=random&color=fff`} alt={u.fullName} className="w-8 h-8 rounded-full"/>
                                    {u.fullName}
                                </button>
                            )) : <p className="text-xs text-neutral-500 text-center">{t('messaging','typeToSearchUsers', {defaultValue:"Type to search for users to message."})}</p>}
                            {/* Add a way to message Admin/Mentors directly if applicable */}
                            {/* <button onClick={() => handleStartNewConversation('ADMIN_USER_ID_PLACEHOLDER')} className="w-full text-left p-2 hover:bg-neutral-100 rounded-md">Contact Support</button> */}
                        </div>
                        <button onClick={() => setShowNewConversationModal(false)} className="mt-4 w-full text-sm py-2 border rounded-md hover:bg-neutral-100">
                            {t('common','cancel')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagingSection;