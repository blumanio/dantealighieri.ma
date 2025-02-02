'use client';

// app/[lang]/ClientLanguageProvider.tsx
import React from 'react';
import { LanguageProvider } from './LanguageContext';
import { Language } from '@/types';

export default function ClientLanguageProvider({
    children,
    initialLang,
}: {
    children: React.ReactNode;
    initialLang: Language;
}) {
    return (
        <LanguageProvider initialLang={initialLang}>
            {children}
        </LanguageProvider>
    );
}
