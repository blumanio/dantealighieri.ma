// StudentItaly.it — Conversion-Optimized Landing Page
// Replace your current app/[lang]/page.tsx with this

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, BookOpen, GraduationCap, MapPin, Heart,
  Calendar, Euro, ChevronRight, Check, X, Loader2,
  Mail, ChevronDown, Star, Shield, Clock, Award,
  Download, Users, FileText, MessageCircle, Sparkles,
  CheckCircle, Play, Globe, Zap, Target
} from 'lucide-react';

// ============================================================
// TYPES
// ============================================================
interface LandingPageProps {
  params: { lang: string };
}

// ============================================================
// CONFIGURATION — Edit these values to match your real data
// ============================================================
const CONFIG = {
  // Your real stats — be honest, trust > inflation
  stats: {
    guideSales: 50,        // Update as you sell more
    emailSubscribers: 1000,
    scholarshipsWon: 25000,
    countriesHelped: 8,
  },
  // Your actual products
  products: {
    freeChecklist: {
      name: 'Checklist Gratuite',
      nameEn: 'Free Checklist',
      description: '10 choses à faire avant de postuler en Italie',
      descriptionEn: '10 things to do before applying to Italy',
    },
    guide: {
      name: 'Le Guide Complet',
      nameEn: 'The Complete Guide',
      price: 9,
      pages: 40,
      chapters: 11,
    },
    consultation: {
      name: 'Consultation Personnalisée',
      nameEn: 'Personal Consultation',
      price: 15,
      duration: '60 min',
    },
    documentReview: {
      name: 'Vérification de Dossier',
      nameEn: 'Document Review',
      price: 25,
    },
  },
  // Deadline urgency — update these each cycle
  deadlines: {
    maeci: { date: 'Mai 2026', dateEn: 'May 2026', label: 'Bourse MAECI', labelEn: 'MAECI Scholarship' },
    applications: { date: 'Jan-Mars 2026', dateEn: 'Jan-Mar 2026', label: 'Candidatures universités', labelEn: 'University applications' },
    visa: { date: 'Juin-Août 2026', dateEn: 'Jun-Aug 2026', label: 'Dossier visa', labelEn: 'Visa applications' },
  },
  // Links — update with your actual URLs
  links: {
    guide: '/fr/guide',
    consultation: '/fr/consultation',
    blog: '/fr/blog',
    checkout: 'https://studentitaly.gumroad.com/l/guide-italie',
    calendly: 'https://calendly.com/studentitaly',
  },
};

// ============================================================
// COPY — French-first (your primary audience), with English
// ============================================================
const COPY = {
  fr: {
    hero: {
      badge: "Guide par un ancien étudiant marocain en Italie",
      headline: "J'ai quitté le Maroc avec 500€.",
      headlineLine2: "J'ai obtenu 25 000€ de bourses.",
      headlineLine3: "Voici exactement comment faire.",
      subheadline: "Le guide étape par étape pour étudier en Italie — par quelqu'un qui l'a vécu. Pas un consultant qui a lu des articles. Un Marocain qui a fait le chemin.",
      cta: "Télécharger la checklist gratuite",
      ctaSecondary: "Voir le guide complet — 9€",
      trustLine: "Rejoint par plus de 1 000 étudiants",
    },
    story: {
      badge: "Mon parcours",
      title: "De Casablanca à Milan avec 500€ en poche",
      paragraphs: [
        "En 2019, je suis arrivé en Italie sans parler un mot d'italien, avec 500€ et beaucoup d'incertitude.",
        "Aujourd'hui : Master 110/110 en Sciences Géologiques. Plus de 25 000€ de bourses cumulées (ERSU + MAECI + bourse régionale). Géologue environnemental à Milan.",
        "Ce n'est pas de la chance. C'est un système que j'ai appris par essai et erreur — et que je vous transmets dans ce guide.",
      ],
      timeline: [
        { year: '2019', event: 'Arrivée en Sardaigne — bourse SARDEGNA FORMED obtenue' },
        { year: '2020', event: 'Bourse ERSU : 6 500€/an' },
        { year: '2021', event: 'Bourse MAECI pour la thèse de Master' },
        { year: '2022', event: 'Diplômé 110/110 — total bourses : 25 000€+' },
        { year: '2025', event: 'Géologue environnemental à Milan' },
      ],
    },
    problem: {
      badge: "Le problème",
      title: "Pourquoi 80% des étudiants marocains échouent",
      problems: [
        { title: "Ils choisissent la mauvaise ville", desc: "Tout le monde veut Milan. Résultat : loyer à 700€/mois, pas de bourse, abandon." },
        { title: "Ils ratent les bourses", desc: "Le système DSU peut couvrir 100% de vos frais + logement + repas. Mais personne ne leur explique comment." },
        { title: "Le dossier de visa est rejeté", desc: "Un dépôt bancaire de dernière minute = refus automatique. Le consulat vérifie l'historique." },
        { title: "Ils font confiance à des \"agents\"", desc: "Des intermédiaires qui facturent 500€+ pour des infos que vous pouvez trouver gratuitement — si on vous montre où chercher." },
      ],
    },
    product: {
      badge: "La solution",
      title: "Tout ce que j'aurais voulu savoir en 2019",
      subtitle: "Le Guide Complet : Étudier en Italie depuis le Maroc — Édition 2026",
      chapters: [
        "Mon histoire complète et mes erreurs à éviter",
        "Pourquoi l'Italie bat la France (le comparatif chiffré)",
        "Stratégie de choix d'université (pas juste Milan)",
        "Documents et deadlines — le calendrier exact",
        "Comment j'ai obtenu 25 000€ de bourses (stratégie de stacking)",
        "Montants DSU par région — données MUR 2025",
        "DOV vs CIMEA — lequel choisir et pourquoi",
        "Dossier visa consulat Rabat : la checklist complète",
        "Budget réaliste en MAD et EUR (pas des chiffres inventés)",
        "Les 30 premiers jours en Italie — guide de survie",
        "Checklist complète mois par mois",
      ],
      price: "9€",
      priceAnchor: "Moins qu'un repas à Milan.",
      priceContext: "Ce guide contient l'équivalent de 3 consultations à 47€ — pour le prix d'un café.",
      cta: "Obtenir le guide — 9€",
      guarantee: "Si le guide ne vous aide pas, je vous rembourse. Sans question.",
    },
    whyItaly: {
      badge: "Italie vs France",
      title: "Pourquoi l'Italie est le secret le mieux gardé",
      comparisons: [
        { category: "Frais de scolarité", france: "2 770€/an minimum", italy: "0-500€/an (avec ISEE)" },
        { category: "Bourses", france: "CROUS — très compétitif", italy: "DSU — basé sur le revenu" },
        { category: "Sélection", france: "Campus France, entretien, dossier", italy: "Admission directe (la plupart)" },
        { category: "Programmes en anglais", france: "Rares et payants", italy: "500+ programmes gratuits" },
        { category: "Vol vers le Maroc", france: "50-150€", italy: "20-80€ (low-cost)" },
      ],
    },
    urgency: {
      badge: "Deadlines qui approchent",
      title: "Le calendrier n'attend pas",
      subtitle: "Les universités italiennes ont des fenêtres de candidature strictes. Voici les prochaines :",
    },
    ladder: {
      badge: "Comment je peux vous aider",
      title: "Choisissez votre niveau d'accompagnement",
      tiers: [
        {
          name: "Checklist Gratuite",
          price: "0€",
          description: "Pour commencer à vous organiser",
          features: [
            "10 étapes essentielles avant de postuler",
            "Liste des documents requis",
            "Calendrier des deadlines 2026",
            "Accès à la newsletter hebdomadaire",
          ],
          cta: "Télécharger gratuitement",
          highlight: false,
        },
        {
          name: "Le Guide Complet",
          price: "9€",
          description: "Tout ce qu'il faut savoir de A à Z",
          features: [
            "40 pages — 11 chapitres détaillés",
            "Montants DSU par région (données MUR)",
            "Stratégie de stacking des bourses",
            "Dossier visa : checklist consulat Rabat",
            "Budget réaliste en MAD et EUR",
            "Checklist imprimable mois par mois",
            "Mises à jour gratuites 2026/2027",
          ],
          cta: "Obtenir le guide — 9€",
          highlight: true,
          popular: true,
        },
        {
          name: "Consultation 1:1",
          price: "15€",
          description: "Analyse personnalisée de votre situation",
          features: [
            "60 minutes en vidéo",
            "Choix d'universités adapté à votre profil",
            "Stratégie de bourses personnalisée",
            "Revue de vos documents",
            "En français, arabe ou darija",
            "Suivi par email après la session",
          ],
          cta: "Réserver une consultation",
          highlight: false,
        },
      ],
    },
    emailCapture: {
      title: "Recevez la checklist gratuite",
      subtitle: "10 choses à faire avant de postuler en Italie — envoyées directement dans votre boîte mail.",
      placeholder: "Votre adresse email",
      cta: "Envoyer la checklist",
      privacy: "Pas de spam. Désinscription en un clic.",
      bonus: "Bonus : recevez chaque semaine les nouvelles deadlines et bourses ouvertes.",
    },
    faq: {
      title: "Questions fréquentes",
      items: [
        {
          q: "Est-ce que ce guide est uniquement pour les Marocains ?",
          a: "Le guide est écrit depuis une perspective marocaine (consulat de Rabat, documents spécifiques), mais 90% du contenu s'applique à tous les étudiants d'Afrique du Nord et d'Afrique de l'Ouest."
        },
        {
          q: "Les informations sont-elles à jour ?",
          a: "Oui. Édition 2026/2027, mise à jour en février 2026. Les montants DSU proviennent des données ouvertes MUR 2025."
        },
        {
          q: "Je ne parle pas italien, c'est un problème ?",
          a: "Non. Plus de 500 programmes de Master en Italie sont entièrement en anglais. Le guide vous explique lesquels et comment postuler."
        },
        {
          q: "Et si le guide ne m'aide pas ?",
          a: "Je vous rembourse intégralement. Pas de questions posées. Mon objectif est de vous aider, pas de prendre votre argent."
        },
        {
          q: "Pourquoi 9€ et pas gratuit ?",
          a: "Parce que les choses gratuites ne sont pas prises au sérieux. Ce guide contient 40 pages de contenu spécifique que j'ai mis des mois à compiler. 9€, c'est moins qu'un repas au restaurant."
        },
        {
          q: "La consultation de 15€, c'est en quelle langue ?",
          a: "Français, arabe (darija) ou anglais — comme vous préférez."
        },
      ],
    },
    footer: {
      tagline: "Le guide que j'aurais voulu avoir avant de quitter le Maroc.",
      copyright: "StudentItaly.it",
    },
  },
};

// ============================================================
// COMPONENTS
// ============================================================

function CountUpNumber({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const steps = 40;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function LandingPage({ params }: LandingPageProps) {
  const lang = params?.lang || 'fr';
  const copy = COPY.fr; // French-first for North African audience
  const textDir = lang === 'ar' ? 'rtl' : 'ltr';

  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [deadlineCountdown, setDeadlineCountdown] = useState({ days: 0, hours: 0 });

  // Calculate days until next major deadline (MAECI May 2026)
  useEffect(() => {
    const deadline = new Date('2026-05-15');
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    setDeadlineCountdown({ days, hours });
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || emailLoading) return;
    setEmailLoading(true);
    // TODO: Connect to your email provider (Brevo/MailerLite)
    // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
    await new Promise(resolve => setTimeout(resolve, 1000));
    setEmailSubmitted(true);
    setEmailLoading(false);
  };

  return (
    <div className="min-h-screen bg-white" dir={textDir}>

      {/* ============================================================
          URGENCY BAR — Sticky top bar with deadline countdown
          ============================================================ */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2.5 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 text-sm font-medium">
          <Clock className="h-4 w-4 flex-shrink-0 animate-pulse" />
          <span>
            Deadline MAECI : <strong>Mai 2026</strong> — Plus que <strong>{deadlineCountdown.days} jours</strong> pour postuler
          </span>
          <a
            href="#guide-section"
            className="ml-2 inline-flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-bold transition-colors"
          >
            Préparez-vous maintenant <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* ============================================================
          HERO — Personal story + clear value prop + email capture
          ============================================================ */}
      <section className="relative overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-20">
          {/* Trust badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-800 font-semibold text-sm">{copy.hero.badge}</span>
            </div>
          </div>

          {/* Headline — This is the most important element on the page */}
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              <span className="text-slate-900">{copy.hero.headline}</span>
              <br />
              <span className="text-emerald-700">{copy.hero.headlineLine2}</span>
              <br />
              <span className="text-slate-700">{copy.hero.headlineLine3}</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {copy.hero.subheadline}
            </p>
          </div>

          {/* Dual CTA — Free lead magnet + Paid product */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#email-capture"
              className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-700/25 hover:shadow-xl hover:shadow-emerald-700/30"
            >
              <Download className="h-5 w-5" />
              {copy.hero.cta}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#guide-section"
              className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl transition-all duration-200 shadow-md border border-slate-200 hover:border-slate-300"
            >
              <BookOpen className="h-5 w-5 text-emerald-700" />
              {copy.hero.ctaSecondary}
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Social proof — honest numbers */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-600" />
              <span><strong className="text-slate-700">1 000+</strong> étudiants inscrits</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-600" />
              <span><strong className="text-slate-700">25 000€</strong> de bourses obtenues</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              <span>Satisfait ou remboursé</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          MY STORY — The trust builder
          ============================================================ */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800 font-semibold text-sm">{copy.story.badge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">{copy.story.title}</h2>
          </div>

          {/* Story text */}
          <div className="max-w-2xl mx-auto mb-12">
            {copy.story.paragraphs.map((p, i) => (
              <p key={i} className="text-lg text-slate-600 leading-relaxed mb-4">{p}</p>
            ))}
          </div>

          {/* Timeline */}
          <div className="max-w-xl mx-auto">
            {copy.story.timeline.map((item, i) => (
              <div key={i} className="flex items-start gap-4 mb-6 last:mb-0">
                <div className="flex-shrink-0 w-16 h-8 flex items-center justify-center bg-emerald-700 text-white text-xs font-bold rounded-md">
                  {item.year}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-slate-700 font-medium">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          PROBLEM — Agitate the pain points
          ============================================================ */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full mb-6">
              <X className="h-4 w-4 text-red-500" />
              <span className="text-red-700 font-semibold text-sm">{copy.problem.badge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">{copy.problem.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {copy.problem.problems.map((problem, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <X className="h-4 w-4 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 pt-1">{problem.title}</h3>
                </div>
                <p className="text-slate-600 leading-relaxed ml-11">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          ITALY vs FRANCE — Comparison that sells the destination
          ============================================================ */}
      <section className="py-20 px-4 bg-emerald-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border border-emerald-200 rounded-full mb-6">
              <Globe className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-800 font-semibold text-sm">{copy.whyItaly.badge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">{copy.whyItaly.title}</h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
              <div className="p-4 font-bold text-slate-500 text-sm" />
              <div className="p-4 text-center font-bold text-slate-500 text-sm flex items-center justify-center gap-1.5">
                🇫🇷 France
              </div>
              <div className="p-4 text-center font-bold text-emerald-700 text-sm flex items-center justify-center gap-1.5">
                🇮🇹 Italie
              </div>
            </div>
            {/* Table rows */}
            {copy.whyItaly.comparisons.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 ${i < copy.whyItaly.comparisons.length - 1 ? 'border-b border-slate-100' : ''}`}>
                <div className="p-4 font-semibold text-slate-700 text-sm">{row.category}</div>
                <div className="p-4 text-center text-slate-500 text-sm">{row.france}</div>
                <div className="p-4 text-center text-emerald-700 font-semibold text-sm bg-emerald-50/50">{row.italy}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          PRODUCT SHOWCASE — The €9 guide
          ============================================================ */}
      <section className="py-20 px-4" id="guide-section">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-6">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-800 font-semibold text-sm">{copy.product.badge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">{copy.product.title}</h2>
            <p className="text-lg text-slate-600">{copy.product.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Chapter list — 3 columns */}
            <div className="lg:col-span-3 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Ce que contient le guide :</h3>
              <div className="space-y-3">
                {copy.product.chapters.map((chapter, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 bg-emerald-100 rounded-md flex items-center justify-center">
                      <span className="text-emerald-700 text-xs font-bold">{i + 1}</span>
                    </div>
                    <span className="text-slate-700 pt-0.5">{chapter}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> 40 pages</span>
                <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> 11 chapitres</span>
                <span className="flex items-center gap-1.5"><Download className="h-4 w-4" /> PDF + DOCX</span>
              </div>
            </div>

            {/* Price card — 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white p-8 rounded-2xl shadow-xl sticky top-20">
                <div className="text-center mb-6">
                  <div className="text-5xl font-black mb-1">{copy.product.price}</div>
                  <p className="text-emerald-200 font-medium">{copy.product.priceAnchor}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {['Guide complet 40 pages', 'Données MUR 2025 officielles', 'Checklist imprimable', 'Mises à jour gratuites', 'Garantie satisfait ou remboursé'].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-emerald-300 flex-shrink-0" />
                      <span className="text-emerald-50 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={CONFIG.links.checkout}
                  className="block w-full text-center py-4 px-6 bg-white hover:bg-emerald-50 text-emerald-800 font-bold rounded-xl transition-colors shadow-lg"
                >
                  {copy.product.cta}
                </a>

                <p className="text-center text-emerald-300 text-xs mt-4">{copy.product.guarantee}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          DEADLINES — Create real urgency
          ============================================================ */}
      <section className="py-16 px-4 bg-amber-50 border-y border-amber-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 border border-amber-300 rounded-full mb-6">
              <Calendar className="h-4 w-4 text-amber-700" />
              <span className="text-amber-800 font-semibold text-sm">{copy.urgency.badge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">{copy.urgency.title}</h2>
            <p className="text-lg text-slate-600">{copy.urgency.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(CONFIG.deadlines).map((deadline, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm text-center">
                <div className="text-amber-700 font-bold text-lg mb-1">{deadline.date}</div>
                <div className="text-slate-600 text-sm">{deadline.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="#guide-section"
              className="inline-flex items-center gap-2 text-amber-800 font-bold hover:text-amber-900 transition-colors"
            >
              Ne ratez pas la fenêtre → Préparez-vous maintenant
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          PRODUCT LADDER — Free → €9 → €15 → €25
          ============================================================ */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800 font-semibold text-sm">{copy.ladder.badge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">{copy.ladder.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {copy.ladder.tiers.map((tier, i) => (
              <div
                key={i}
                className={`relative flex flex-col p-7 rounded-2xl border-2 transition-shadow ${
                  tier.highlight
                    ? 'border-emerald-600 bg-white shadow-xl'
                    : 'border-slate-200 bg-white shadow-sm hover:shadow-md'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white text-xs font-bold rounded-full">
                      <Star className="h-3 w-3 fill-current" /> Recommandé
                    </div>
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{tier.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{tier.description}</p>
                  <div className="text-4xl font-black text-slate-900 mb-6">{tier.price}</div>
                  <ul className="space-y-2.5 mb-8">
                    {tier.features.map((feature, fi) => (
                      <li key={fi} className="flex items-start gap-2.5">
                        <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${tier.highlight ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className="text-slate-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className={`w-full py-3.5 px-6 font-bold rounded-xl transition-colors ${
                    tier.highlight
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          EMAIL CAPTURE — The #1 missed opportunity
          ============================================================ */}
      <section className="py-20 px-4 bg-emerald-700" id="email-capture">
        <div className="max-w-2xl mx-auto text-center">
          <Download className="h-10 w-10 text-emerald-200 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{copy.emailCapture.title}</h2>
          <p className="text-lg text-emerald-100 mb-8">{copy.emailCapture.subtitle}</p>

          {emailSubmitted ? (
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
              <CheckCircle className="h-12 w-12 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">C'est envoyé ! 🎉</h3>
              <p className="text-emerald-100">Vérifiez votre boîte mail (et les spams). La checklist arrive dans 2 minutes.</p>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-emerald-200 text-sm mb-3">En attendant, découvrez le guide complet :</p>
                <a
                  href="#guide-section"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-800 font-bold rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  Voir le guide — 9€ <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ) : (
            <div>
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={copy.emailCapture.placeholder}
                  required
                  className="flex-1 px-5 py-4 rounded-xl text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
                <button
                  type="submit"
                  disabled={emailLoading}
                  className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {emailLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Mail className="h-5 w-5" />
                      {copy.emailCapture.cta}
                    </>
                  )}
                </button>
              </form>
              <p className="text-emerald-200 text-sm">{copy.emailCapture.privacy}</p>
              <p className="text-emerald-300 text-xs mt-2 font-medium">{copy.emailCapture.bonus}</p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          FAQ — Handle objections
          ============================================================ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 text-center mb-12">{copy.faq.title}</h2>
          <div className="space-y-3">
            {copy.faq.items.map((item, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-900 pr-4">{item.q}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-slate-600 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA — Last chance to convert
          ============================================================ */}
      <section className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            Le meilleur moment pour commencer,
            <br />c'était il y a 6 mois.
            <br /><span className="text-emerald-400">Le deuxième meilleur, c'est maintenant.</span>
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto">
            Chaque jour qui passe est un jour de moins avant la prochaine deadline.
            Ne laissez pas le manque d'information vous coûter votre place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={CONFIG.links.checkout}
              className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-lg"
            >
              Obtenir le guide — 9€
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#email-capture"
              className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors border border-slate-700"
            >
              Checklist gratuite d'abord
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER — Clean, simple, trust-building
          ============================================================ */}
      <footer className="py-12 px-4 bg-slate-950 text-slate-400">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold text-lg mb-3">StudentItaly.it</h4>
              <p className="text-sm leading-relaxed">{copy.footer.tagline}</p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Liens utiles</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href={`/${lang}/blog`} className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href={`/${lang}/guide`} className="hover:text-white transition-colors">Le Guide</Link></li>
                <li><Link href={`/${lang}/consultation`} className="hover:text-white transition-colors">Consultation</Link></li>
                <li><Link href={`/${lang}/contact`} className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href={`/${lang}/terms`} className="hover:text-white transition-colors">Conditions d'utilisation</Link></li>
                <li><Link href={`/${lang}/privacy`} className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} {copy.footer.copyright}. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}