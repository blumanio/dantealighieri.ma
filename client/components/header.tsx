'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, useUser, SignOutButton } from '@clerk/nextjs';
import MobileNav from './mobileNav'; // Make sure you have this component for the mobile menu
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage, defaultLang } from '../context/LanguageContext';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  CircleUserRound,
  LayoutGrid,
  FileText,
  Settings,
  LogOut,
  Crown,
  HelpCircle,
  Home,
  CircleCheck,
  Star,
  Mail,
  Bell,
  ChevronRight,
  ChevronDown,
  Search,
  Menu,
  MessageCircle,
  Download,
  User,
  BookOpen,
  Calendar,
  MapPin,
  GraduationCap,
  Building,
  Users,
  Award,
  Globe,
  TrendingUp,
  Clock,
  Filter,
  SettingsIcon,
  X,
  Brain,
  School,
  DollarSign,
  PenTool
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import University from '@/lib/models/University';

// Typing animation component for search placeholder
const TypingPlaceholder = () => {
  const examples = [
    "università di milano",
    "master data science",
    "bachelor biology",
    "mechanical engineering",
    "computer science degree",
    "economics program",
    "architecture course",
    "medicine university"
  ];

  const [currentExample, setCurrentExample] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typeSpeed, setTypeSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const current = examples[currentExample];

      if (isDeleting) {
        setCurrentText(current.substring(0, currentText.length - 1));
        setTypeSpeed(75);
      } else {
        setCurrentText(current.substring(0, currentText.length + 1));
        setTypeSpeed(150);
      }

      if (!isDeleting && currentText === current) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentExample((prev) => (prev + 1) % examples.length);
      }
    };

    const timer = setTimeout(handleTyping, typeSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentExample, typeSpeed, examples]);

  return (
    <span className="text-gray-400">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Updated menu items with React Lucide icons
const menuItems = {
  en: {
    universities: { text: 'Universities', icon: School },
    cityExplorer: { text: 'City Explorer', icon: MapPin },
    community: { text: 'Community', icon: Users },
    scholarships: { text: 'Scholarships', icon: DollarSign },
    explore: { text: 'Explore', icon: Globe },
    courseFinder: { text: 'Course Finder', icon: Brain },
    admitsRejects: { text: 'Admits & Rejects', icon: CircleCheck },
    products: { text: 'Products', icon: LayoutGrid },
    premium: { text: 'Premium', icon: Crown },
    askExperts: { text: 'Ask Our Experts', icon: MessageCircle },
    downloadApp: { text: 'Download App', icon: Download },
    blog: { text: 'Blog', icon: PenTool },
    imat: { text: 'IMAT', icon: FileText },
    tolc: { text: 'TOLC', icon: FileText },
    about: { text: 'About', icon: HelpCircle },
    apply: { text: 'Apply', icon: FileText },
    soon: { text: 'Soon', icon: Clock },
    programs: { text: 'Programs', icon: BookOpen },
    requirements: { text: 'Requirements', icon: FileText },
    services: { text: 'Services', icon: Settings },
    home: { text: 'Home', icon: Home },
    profile: { text: 'Profile', icon: User },
    signIn: { text: 'Sign In', icon: User },
    signUp: { text: 'Sign Up', icon: User },
    signOut: { text: 'Sign Out', icon: LogOut },
    topUniversities: { text: 'Top Universities', icon: Award },
    countryGuides: { text: 'Country Guides', icon: Globe },
    popularCourses: { text: 'Popular Courses', icon: TrendingUp },
    universityDeadlines: { text: 'University Deadlines', icon: Calendar },
    blogs: { text: 'Blogs', icon: PenTool },
    events: { text: 'Events', icon: Calendar },
  },
  ar: {
    community: { text: 'التغذية', icon: Users },
    scholarships: { text: ' المنح', icon: DollarSign },
    universities: { text: 'الجامعات', icon: School },
    explore: { text: 'استكشف', icon: Globe },
    courseFinder: { text: 'البحث عن الكليات', icon: Brain },
    admitsRejects: { text: 'القبول والرفض', icon: CircleCheck },
    products: { text: 'المنتجات', icon: LayoutGrid },
    premium: { text: 'مميز', icon: Crown },
    askExperts: { text: 'اسأل خبرائنا', icon: MessageCircle },
    downloadApp: { text: 'تحميل التطبيق', icon: Download },
    imat: { text: 'IMAT', icon: FileText },
    tolc: { text: 'TOLC', icon: FileText },
    blog: { text: 'مدونة', icon: PenTool },
    about: { text: 'من نحن', icon: HelpCircle },
    apply: { text: 'تقديم', icon: FileText },
    soon: { text: 'قريباً', icon: Clock },
    programs: { text: 'ابحث عن تخصصك', icon: BookOpen },
    requirements: { text: 'المتطلبات', icon: FileText },
    services: { text: 'الخدمات', icon: Settings },
    home: { text: 'الرئيسية', icon: Home },
    profile: { text: 'الملف الشخصي', icon: User },
    signIn: { text: 'تسجيل الدخول', icon: User },
    signUp: { text: 'انشاء حساب', icon: User },
    signOut: { text: 'تسجيل الخروج', icon: LogOut },
    topUniversities: { text: 'أفضل الجامعات', icon: Award },
    countryGuides: { text: 'أدلة البلدان', icon: Globe },
    popularCourses: { text: 'الدورات الشائعة', icon: TrendingUp },
    universityDeadlines: { text: 'مواعيد الجامعات', icon: Calendar },
    blogs: { text: 'المدونات', icon: PenTool },
    events: { text: 'الأحداث', icon: Calendar },
    cityExplorer: { text: 'مستكشف المدن الجامعية', icon: MapPin },
  },
  it: {
    community: { text: 'community', icon: Users },
    scholarships: { text: 'Borse di Studio', icon: DollarSign },
    universities: { text: 'Università', icon: School },
    explore: { text: 'Esplora', icon: Globe },
    courseFinder: { text: 'Trova Università', icon: Brain },
    admitsRejects: { text: 'Ammissioni e Rifiuti', icon: CircleCheck },
    products: { text: 'Prodotti', icon: LayoutGrid },
    premium: { text: 'Premium', icon: Crown },
    askExperts: { text: 'Chiedi agli Esperti', icon: MessageCircle },
    downloadApp: { text: 'Scarica App', icon: Download },
    imat: { text: 'IMAT', icon: FileText },
    tolc: { text: 'TOLC', icon: FileText },
    blog: { text: 'Blog', icon: PenTool },
    about: { text: 'Chi Siamo', icon: HelpCircle },
    apply: { text: 'Applica', icon: FileText },
    soon: { text: 'Presto', icon: Clock },
    programs: { text: 'Programmi', icon: BookOpen },
    requirements: { text: 'Requisiti', icon: FileText },
    services: { text: 'Servizi', icon: Settings },
    home: { text: 'Home', icon: Home },
    profile: { text: 'Profilo', icon: User },
    signIn: { text: 'Accedi', icon: User },
    signUp: { text: 'Registrati', icon: User },
    signOut: { text: 'Esci', icon: LogOut },
    topUniversities: { text: 'Migliori Università', icon: Award },
    countryGuides: { text: 'Guide Paesi', icon: Globe },
    popularCourses: { text: 'Corsi Popolari', icon: TrendingUp },
    universityDeadlines: { text: 'Scadenze Università', icon: Calendar },
    blogs: { text: 'Blog', icon: PenTool },
    events: { text: 'Eventi', icon: Calendar },
    cityExplorer: { text: 'Esplora Città Universitarie', icon: MapPin },
  },
  fr: {
    community: { text: 'Flux', icon: Users },
    scholarships: { text: 'Borse di Studio', icon: DollarSign },
    universities: { text: 'Universités', icon: School },
    explore: { text: 'Explorer', icon: Globe },
    courseFinder: { text: 'Trouveur d\'Université', icon: Brain },
    admitsRejects: { text: 'Admissions et Refus', icon: CircleCheck },
    products: { text: 'Produits', icon: LayoutGrid },
    premium: { text: 'Premium', icon: Crown },
    askExperts: { text: 'Demander aux Experts', icon: MessageCircle },
    downloadApp: { text: 'Télécharger l\'App', icon: Download },
    imat: { text: 'IMAT', icon: FileText },
    tolc: { text: 'TOLC', icon: FileText },
    blog: { text: 'Blog', icon: PenTool },
    about: { text: 'Qui sommes-nous', icon: HelpCircle },
    apply: { text: 'Postuler', icon: FileText },
    soon: { text: 'Bientôt', icon: Clock },
    programs: { text: 'Programmes', icon: BookOpen },
    requirements: { text: 'Exigences', icon: FileText },
    services: { text: 'Services', icon: Settings },
    home: { text: 'Accueil', icon: Home },
    profile: { text: 'Profil', icon: User },
    signIn: { text: 'Se connecter', icon: User },
    signUp: { text: "S'inscrire", icon: User },
    signOut: { text: 'Se déconnecter', icon: LogOut },
    topUniversities: { text: 'Meilleures Universités', icon: Award },
    countryGuides: { text: 'Guides Pays', icon: Globe },
    popularCourses: { text: 'Cours Populaires', icon: TrendingUp },
    universityDeadlines: { text: 'Échéances Université', icon: Calendar },
    blogs: { text: 'Blogs', icon: PenTool },
    events: { text: 'Événements', icon: Calendar },
    cityExplorer: { text: 'Explorateur de villes universitaires', icon: MapPin },
  }
} as const;

// Keep your existing exploreMenuData and productsMenuData objects unchanged...
const exploreMenuData = {
  en: {
    topUniversities: {
      title: 'Top Universities',
      description: 'Search courses & universities by country',
      items: [
        { name: 'United States', href: '/en/universities/usa', icon: '🇺🇸' },
        { name: 'Canada', href: '/en/universities/canada', icon: '🇨🇦' },
        { name: 'United Kingdom', href: '/en/universities/uk', icon: '🇬🇧' },
        { name: 'Germany', href: '/en/universities/germany', icon: '🇩🇪' },
        { name: 'Australia', href: '/en/universities/australia', icon: '🇦🇺' },
        { name: 'Explore all', href: '/en/universities', icon: '🌍' }
      ]
    },
    countryGuides: {
      title: 'Country Guides',
      description: 'What, where, why of education across countries',
      items: [
        { name: 'Study in USA', href: '/en/guides/usa', icon: '🏛️' },
        { name: 'Study in Canada', href: '/en/guides/canada', icon: '🍁' },
        { name: 'Study in UK', href: '/en/guides/uk', icon: '🎓' },
        { name: 'Study in Germany', href: '/en/guides/germany', icon: '🏰' },
        { name: 'Study in Australia', href: '/en/guides/australia', icon: '🦘' }
      ]
    },
    popularCourses: {
      title: 'Popular Courses',
      description: 'Course details, structure, pre-reqs & more...',
      items: [
        { name: 'Computer Science', href: '/en/courses/computer-science', icon: '💻' },
        { name: 'Medicine', href: '/en/courses/medicine', icon: '⚕️' },
        { name: 'Engineering', href: '/en/courses/engineering', icon: '⚙️' },
        { name: 'Business', href: '/en/courses/business', icon: '💼' },
        { name: 'Law', href: '/en/courses/law', icon: '⚖️' }
      ]
    },
    universityDeadlines: {
      title: 'University Deadlines',
      description: 'Know all about application deadlines',
      items: [
        { name: 'Fall 2024 Deadlines', href: '/en/deadlines/fall-2024', icon: '📅' },
        { name: 'Spring 2025 Deadlines', href: '/en/deadlines/spring-2025', icon: '🌸' },
        { name: 'MBA Deadlines', href: '/en/deadlines/mba', icon: '📊' },
        { name: 'PhD Deadlines', href: '/en/deadlines/phd', icon: '🔬' }
      ]
    }
  },
};

const productsMenuData = {
  en: {
    categories: [
      {
        title: 'Application Services',
        items: [
          { name: 'University Selection', href: '/en/services/selection', icon: '🎯' },
          { name: 'SOP Writing', href: '/en/services/sop', icon: '✍️' },
          { name: 'LOR Assistance', href: '/en/services/lor', icon: '📝' },
          { name: 'Visa Guidance', href: '/en/services/visa', icon: '🛂' }
        ]
      },
      {
        title: 'Test Prep',
        items: [
          { name: 'IELTS Preparation', href: '/en/prep/ielts', icon: '🗣️' },
          { name: 'TOEFL Preparation', href: '/en/prep/toefl', icon: '📚' },
          { name: 'GRE Preparation', href: '/en/prep/gre', icon: '🧮' },
          { name: 'GMAT Preparation', href: '/en/prep/gmat', icon: '📊' }
        ]
      }
    ]
  }
};

const getInitials = (fullName?: string | null, firstName?: string | null, lastName?: string | null): string => {
  if (fullName) {
    const names = fullName.split(' ');
    if (names.length > 1 && names[0] && names[names.length - 1]) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    if (names[0]) {
      return names[0][0].toUpperCase();
    }
  }
  if (firstName && lastName && firstName[0] && lastName[0]) {
    return (firstName[0] + lastName[0]).toUpperCase();
  }
  if (firstName && firstName[0]) {
    return firstName[0].toUpperCase();
  }
  if (lastName && lastName[0]) {
    return lastName[0].toUpperCase();
  }
  return 'U';
};

type SupportedLang = keyof typeof menuItems;

const AnimatedLogo = () => {
  return (
    <Link href="/" className="flex items-center" aria-label="StudentItaly Homepage">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center shadow-md"
      >
        <span className="text-white font-bold text-xl">SI</span>
      </motion.div>
      <span className="ml-3 text-xl font-bold text-gray-800">StudentItaly</span>
    </Link>
  );
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguage();
  const pathname = usePathname();

  const currentMenu = (Object.keys(menuItems).includes(language) ? menuItems[language as SupportedLang] : menuItems[defaultLang]);

  // Effect to handle scroll-based styling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const navigationLinks = [
    { href: `/${language}/community`, text: currentMenu.community.text, icon: currentMenu.community.icon, hasDropdown: false },
    { href: `/${language}/ai-advisor`, text: currentMenu.courseFinder.text, icon: currentMenu.courseFinder.icon, hasDropdown: false },
    { href: `/${language}/university`, text: currentMenu.universities.text, icon: currentMenu.universities.icon, hasDropdown: false },
    { href: `/${language}/italian-university-city-cost-explorer/`, text: currentMenu.cityExplorer.text, icon: currentMenu.cityExplorer.icon, hasDropdown: false },
    { href: `/${language}/scholarships`, text: currentMenu.scholarships.text, icon: currentMenu.scholarships.icon, hasDropdown: false },
    { href: `/${language}/blog`, text: currentMenu.blog.text, icon: currentMenu.blog.icon, hasDropdown: false },
  ];

  if (!language) return null;

  const MegaMenu = ({ type, isOpen }: { type: string, isOpen: boolean }) => {
    return null; // Placeholder
  };

  const NavLink = ({ href, text, icon: Icon, hasDropdown, dropdownKey }: {
    href: string;
    text: string;
    icon: React.ComponentType<any>;
    hasDropdown?: boolean;
    dropdownKey?: string;
  }) => {
    const isActive = pathname === href;

    return (
      <div
        className="relative"
        onMouseEnter={hasDropdown ? () => setActiveDropdown(dropdownKey || '') : undefined}
        onMouseLeave={hasDropdown ? () => setActiveDropdown(null) : undefined}
      >
        <Link
          href={href}
          className={`relative flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'}`}
        >
          <Icon className="w-4 h-4 mr-2" />
          <span>{text}</span>
          {hasDropdown && (<ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${activeDropdown === dropdownKey ? 'rotate-180' : ''}`} />)}
        </Link>
        {hasDropdown && dropdownKey && (<MegaMenu type={dropdownKey} isOpen={activeDropdown === dropdownKey} />)}
      </div>
    );
  };

  const UserDropdown = () => {
    const { user } = useUser();
    const router = useRouter();

    if (!user) return <div className="h-10 w-10 bg-white/20 rounded-full animate-pulse backdrop-blur-sm" />;

    const initials = getInitials(user.fullName, user.firstName, user.lastName);
    const isAdmin = user.publicMetadata?.isAdmin as boolean | undefined;
    const premiumTier = user.publicMetadata?.premiumTier as string | undefined || "Free";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="bg-transparent group relative rounded-full hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 hover:scale-105 active:scale-95">
            <div className="relative">
              <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-200 shadow-lg backdrop-blur-sm">
                <AvatarImage src={user.imageUrl} alt={user.fullName || "User avatar"} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-white/20 to-white/10 text-white font-semibold backdrop-blur-sm">{initials}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white shadow-sm"><div className="h-full w-full bg-green-400 rounded-full animate-pulse" /></div>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-80 p-0 border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200"
          align="end"
          sideOffset={12}
        >
          <div className="relative bg-gradient-to-br from-teal-500/10 via-orange-500/5 to-purple-500/10 px-6 pt-6 pb-4">
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <Avatar className="h-20 w-20 shadow-lg ring-3 ring-white/10">
                  <AvatarImage src={user.imageUrl} alt={user.fullName || "User avatar"} className="object-cover" />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-teal-500/20 to-orange-500/20 text-teal-700 dark:text-teal-300 font-bold">{initials}</AvatarFallback>
                </Avatar>
                {premiumTier?.toLowerCase() !== 'free' && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1 shadow-lg"><Star className="h-3 w-3 text-white" /></div>
                )}
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 text-center truncate max-w-full">{user.fullName || user.firstName || "User Name"}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${isAdmin ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300' : premiumTier?.toLowerCase() === 'pro' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'}`}>{isAdmin ? "👑 Admin" : `✨ ${premiumTier}`}</span>
            </div>
          </div>
          <DropdownMenuSeparator className="mx-6 my-0" />
          <div className="py-2">
            <DropdownMenuItem asChild><Link href={`/${language}/dashboard`} className="group flex items-center cursor-pointer px-6 py-3 text-sm font-medium hover:bg-gray-50/50 dark:hover:bg-orange-500 transition-all duration-200 mx-2 rounded-xl"><div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/20 group-hover:bg-orange-200 dark:group-hover:bg-orange-500 transition-colors duration-200 mr-3"><CircleUserRound className="h-4 w-4 text-orange-600 dark:text-orange-400" /></div><span className="text-gray-700 dark:text-gray-300">My Profile</span><ChevronRight className="ml-auto h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all duration-200 group-hover:translate-x-1" /></Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href={isAdmin ? `/${language}/admin` : `/${language}/profile/dashboard`} className="group flex items-center cursor-pointer px-6 py-3 text-sm font-medium hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-200 mx-2 rounded-xl"><div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/20 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-200 mr-3"><LayoutGrid className="h-4 w-4 text-purple-600 dark:text-purple-400" /></div><span className="text-gray-700 dark:text-gray-300">{isAdmin ? "Admin Panel" : "Dashboard"}</span><ChevronRight className="ml-auto h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all duration-200 group-hover:translate-x-1" /></Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href={`/${language}/dashboard#applications`} className="group flex items-center cursor-pointer px-6 py-3 text-sm font-medium hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-200 mx-2 rounded-xl"><div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 group-hover:bg-green-200 dark:group-hover:bg-green-800/30 transition-colors duration-200 mr-3"><FileText className="h-4 w-4 text-green-600 dark:text-green-400" /></div><span className="text-gray-700 dark:text-gray-300">My Applications</span><ChevronRight className="ml-auto h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all duration-200 group-hover:translate-x-1" /></Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href={`/${language}/profile/settings`} className="group flex items-center cursor-pointer px-6 py-3 text-sm font-medium hover:bg-orange-50 dark:hover:bg-orange-500/20 transition-all duration-200 mx-2 rounded-xl"><div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/20 group-hover:bg-orange-200 dark:group-hover:bg-orange-800/30 transition-colors duration-200 mr-3"><SettingsIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" /></div><span className="text-gray-700 dark:text-gray-300">Settings</span><ChevronRight className="ml-auto h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all duration-200 group-hover:translate-x-1" /></Link></DropdownMenuItem>
          </div>
          {(!isAdmin && premiumTier?.toLowerCase() !== 'pro' && premiumTier?.toLowerCase() !== 'enterprise') && (
            <><DropdownMenuSeparator className="mx-6 my-2" /><div className="p-4 mx-2 mb-2"><Link href={`/${language}/pricing`} className="group relative flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-orange-600 hover:from-teal-600 hover:to-orange-700 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] overflow-hidden"><div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" /><Star className="mr-2 h-4 w-4" /><span className="relative z-10">Upgrade to Premium</span></Link></div></>
          )}
          <DropdownMenuSeparator className="mx-6 my-0" />
          <div className="py-2">
            <DropdownMenuItem asChild><SignOutButton><button className="group w-full text-left flex items-center cursor-pointer px-6 py-3 text-sm font-medium hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-200 mx-2 rounded-xl text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" onClick={async () => { setTimeout(() => { router.push(`/${language}`); }, 500); }}><div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/20 group-hover:bg-red-200 dark:group-hover:bg-red-800/30 transition-colors duration-200 mr-3"><LogOut className="h-4 w-4" /></div><span>Sign Out</span></button></SignOutButton></DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Example: router.push(`/${language}/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const mobileMenuVariants = {
    hidden: { x: '-100%' },
    visible: { x: '0%' },
  };
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <>
      <motion.header
        className={`sticky top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm border-b transition-all duration-300 
                   ${isScrolled ? 'shadow-md border-transparent' : 'border-gray-200'}`}
        role="banner"
      >
        <nav className="container mx-auto px-4 flex items-center justify-between h-16 gap-4" aria-label="Main navigation">
          {/* ====== Left Side: Logo & Desktop Navigation ====== */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Hamburger Button */}
            <div className="lg:hidden">
              <Button variant='secondary' size="icon" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open main menu" className='p-0'>
                <Menu className="h-6 w-6" />
              </Button>
            </div>

            {/* Logo */}
            <Link href={`/${language}`} className="hidden sm:flex flex-shrink-0 items-center" aria-label="Homepage">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SI</span>
              </motion.div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navigationLinks.map((link) => (<NavLink key={link.href} {...link} />))}
            </div>
          </div>

          {/* ====== Center: Search Bar (NEW LOCATION) ====== */}
          <div className="lg:hidden flex-1 flex justify-center lg:px-8">
            <form onSubmit={handleSearch} className="relative w-full max-w-lg mb-0 pt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder=""
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50/50 hover:bg-white transition-colors"
                />
                <div className="absolute left-10 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {!searchQuery && <TypingPlaceholder />}
                </div>
              </div>
            </form>
          </div>

          {/* ====== Right Side: Actions & User Menu ====== */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <SignedIn>
              <UserDropdown />
            </SignedIn>
            <SignedOut>
              <div className="hidden sm:flex items-center gap-2">
                <SignInButton mode="modal"><Button className='bg-orange-500 text-white' variant="ghost" size="sm">{currentMenu.signIn.text}</Button></SignInButton>
                {/* <SignInButton mode="modal"><Button className='bg-orange-500 text-white' size="sm">{currentMenu.signUp.text}</Button></SignInButton> */}
              </div>
            </SignedOut>
          </div>
        </nav>
      </motion.header>

      {/* ====== Animated Mobile Menu Panel ====== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
              initial="hidden" animate="visible" exit="hidden"
              variants={overlayVariants}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-[60] flex flex-col shadow-xl lg:hidden"
              initial="hidden" animate="visible" exit="hidden"
              variants={mobileMenuVariants}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <AnimatedLogo />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Panel Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navigationLinks.map(link => {
                  const IconComponent = link.icon;
                  return (
                    <Link key={link.href} href={link.href} >
                      <a onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                        <IconComponent className="w-5 h-5 mr-3 text-gray-500" />
                        {link.text}
                      </a>
                    </Link>
                  );
                })}

                <div className="pt-4 border-t border-gray-200">
                  <div className="px-4 py-2"><span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Language</span></div>
                  <div className="px-4"><LanguageSwitcher /></div>
                </div>
              </nav>

              {/* Panel Footer for Sign In/Out */}
              <div className="p-4 border-t border-gray-200">
                <SignedOut>
                  <div className="flex flex-col gap-3">
                    <SignInButton mode="modal"><Button variant="outline" className="w-full flex items-center gap-2"><User className="w-4 h-4" />{currentMenu.signIn.text}</Button></SignInButton>
                    <SignInButton mode="modal"><Button className="w-full flex items-center gap-2"><User className="w-4 h-4" />{currentMenu.signUp.text}</Button></SignInButton>
                  </div>
                </SignedOut>
                <SignedIn>
                  <SignOutButton><Button variant="outline" className="w-full flex items-center gap-2"><LogOut className="w-4 h-4" />{currentMenu.signOut.text}</Button></SignOutButton>
                </SignedIn>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;