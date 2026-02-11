"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Clock, ArrowRight, Calendar, ChevronRight } from 'lucide-react';
import deadlinesData from '@/constants/deadlines.json'; // Assume this is a static JSON file with upcoming deadlines

export default function UrgencyBar() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    // 1. Filtrer et trier les deadlines valides (futures)
    const upcomingDeadlines = useMemo(() => {
        const today = new Date();
        return deadlinesData
            .filter(d => new Date(d.date) > today)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5); // On prend les 5 plus proches pour la rotation
    }, []);

    // 2. Logique de rotation automatique (8 secondes)
    useEffect(() => {
        if (upcomingDeadlines.length <= 1) return;

        const interval = setInterval(() => {
            setIsExiting(true); // Déclenche l'animation de sortie

            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % upcomingDeadlines.length);
                setIsExiting(false); // Déclenche l'animation d'entrée
            }, 500); // Temps de la transition sortante

        }, 8000);

        return () => clearInterval(interval);
    }, [upcomingDeadlines]);

    if (upcomingDeadlines.length === 0) return null;

    const current = upcomingDeadlines[currentIndex];
    const daysLeft = Math.ceil(
        (new Date(current.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div className="sticky top-0 z-[100] w-full bg-slate-900 border-b border-white/10 shadow-lg overflow-hidden">
            {/* Barre de progression subtile en haut */}
            <div className="absolute top-0 left-0 h-[2px] bg-orange-500 transition-all duration-[8000ms] ease-linear"
                key={`progress-${currentIndex}`}
                style={{ width: '100%' }}
            />

            <div className="max-w-7xl mx-auto px-4 py-2.5">
                <div className={`flex flex-col md:flex-row items-center justify-between gap-3 transition-all duration-500 transform ${isExiting ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>

                    {/* Section Info & Countdown */}
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-500/20 p-1.5 rounded-lg">
                            <Clock className="h-4 w-4 text-orange-500 animate-pulse" />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                            <span className="text-white text-sm font-semibold tracking-tight">
                                {current.type === 'scholarship' ? '🏆 Bourse' : '🎓 Université'} : {current.title}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="hidden md:inline text-white/30">|</span>
                                <span className="bg-red-500/10 text-red-400 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border border-red-500/20">
                                    Deadline : {current.date}
                                </span>
                                <span className="bg-red-500/10 text-red-400 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border border-red-500/20">
                                    {/* J-{daysLeft} jours */}
                                    {daysLeft} Days left

                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Professional Trigger (CTA) */}
                    <div className="flex items-center gap-4">
                        <a
                            href="/university"
                            className="group relative inline-flex items-center gap-2 px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-md shadow-orange-900/20"
                        >
                            <span>Full list</span>
                            <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </a>
{/* 
                        <a
                            href="/deadlines"
                            className="text-xs text-slate-400 hover:text-white underline underline-offset-4 transition-colors"
                        >
                            Calendrier complet
                        </a> */}
                    </div>
                </div>
            </div>
        </div>
    );
}