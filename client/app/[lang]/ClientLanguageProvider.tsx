'use client';

// app/[lang]/ClientLanguageProvider.tsx
import React from 'react';
import { LanguageProvider } from './LanguageContext';

type Lang = 'en' | 'it' | 'ar';

export default function ClientLanguageProvider({
    children,
    initialLang,
}: {
    children: React.ReactNode;
    initialLang: Lang;
}) {
    return (
        <LanguageProvider initialLang={initialLang}>
            {children}
        </LanguageProvider>
    );
}
