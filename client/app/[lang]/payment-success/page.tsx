// app/[lang]/payment-success/page.tsx
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext'; //
import { Button } from '@/components/ui/button'; //

// It's good practice to define metadata for pages if possible,
// though for client components it's often handled differently or in a parent layout.
// For App Router, you might export a 'metadata' object if it were a Server Component,
// or manage document.title in useEffect for Client Components.

const PaymentSuccessPage: React.FC = () => {
    const { t, language } = useLanguage();
    const searchParams = useSearchParams();

    // Determine if the current language is RTL
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    const isRTL = rtlLanguages.includes(language);

    const tierId = searchParams?.get('tier'); // e.g., 'dante', 'davinci'
    const paymentIntentId = searchParams?.get('payment_intent');

    const tierName = tierId ? t('tiers', `tier_${tierId.toLowerCase()}`) || tierId.charAt(0).toUpperCase() + tierId.slice(1) : '';

    // Update document title
    React.useEffect(() => {
        document.title = t('paymentSuccess', 'pageTitle') || 'Payment Successful';
    }, [t]);

    const pageVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-neutral-100 py-12 md:py-20 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={pageVariants}
                className="container mx-auto max-w-2xl"
            >
                <div className="bg-white shadow-xl rounded-2xl p-8 md:p-12 text-center border border-green-200">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 120 }}
                        className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6"
                    >
                        <CheckCircle2 className="h-12 w-12 text-green-600" strokeWidth={1.5} />
                    </motion.div>

                    <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
                        {t('paymentSuccess', 'mainTitle') || "Payment Successful!"}
                    </h1>

                    <p className="text-lg text-textSecondary mb-3">
                        {t('paymentSuccess', 'thankYouMessage') || "Thank you for your purchase!"}
                    </p>

                    {tierName && (
                        <p className="text-md text-textSecondary mb-3"
                            dangerouslySetInnerHTML={{
                                __html: t('paymentSuccess', 'tierUpgradeMessage', { tierName: tierName }) ||
                                    `Your payment for the <strong>${tierName}</strong> tier has been processed successfully.`
                            }}
                        />
                    )}

                    <p className="text-md text-textSecondary mb-6">
                        {t('paymentSuccess', 'accessUpdatedMessage') || "Your account access has been updated. You can now enjoy your new features."}
                    </p>

                    {paymentIntentId && (
                        <div className="bg-neutral-50 p-4 rounded-lg mb-8 border border-neutral-200">
                            <p className="text-sm text-textPrimary font-medium">
                                {t('paymentSuccess', 'transactionIdLabel') || "Transaction ID:"}
                            </p>
                            <p className="text-sm text-textSecondary break-all">{paymentIntentId}</p>
                        </div>
                    )}

                    <p className="text-sm text-textSecondary mb-8">
                        {t('paymentSuccess', 'emailConfirmation') || "You will receive an email confirmation with the details of your transaction shortly."}
                    </p>

                    <div className="border-t border-neutral-200 pt-8">
                        <h2 className="text-xl font-semibold text-textPrimary mb-5">
                            {t('paymentSuccess', 'nextStepsTitle') || "What's Next?"}
                        </h2>
                        <div className="space-y-4 md:space-y-0 md:flex md:flex-wrap md:justify-center md:gap-4">
                            <Link href={`/${language}/profile`} passHref >
                                <Button size="lg" className="w-full md:w-auto group bg-primary hover:bg-primary-dark text-white">
                                    {t('paymentSuccess', 'goToDashboardButton') || "Go to My Dashboard"}
                                    <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'} transition-transform group-hover:translate-x-1`} />
                                </Button>
                            </Link>
                            {/* You might want a more specific link for features if available */}
                            <Link href={`/${language}/pricing`} passHref >
                                <Button variant="outline" size="lg" className="w-full md:w-auto">
                                    {t('paymentSuccess', 'backToPricingButton') || "View All Plans"}
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <p className="mt-10 text-xs text-textSecondary"
                        dangerouslySetInnerHTML={{
                            __html: t('paymentSuccess', 'contactSupportMessage', { lang: language }) ||
                                `If you have any questions or need assistance, please don't hesitate to <a href='/${language}/contact' class='font-semibold text-primary hover:text-primary-dark underline'>contact our support team</a>.`
                        }}
                    />

                </div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccessPage;