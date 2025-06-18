// components/auth/ForgotPasswordPage.tsx
'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
    const { isLoaded, signIn } = useSignIn();
    const [emailAddress, setEmailAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successfulCreation, setSuccessfulCreation] = useState(false);
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        setIsLoading(true);
        setError('');

        try {
            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: emailAddress,
            });
            setSuccessfulCreation(true);
        } catch (err: any) {
            setError(err.errors?.[0]?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        setIsLoading(true);
        setError('');

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password,
            });

            if (result.status === 'complete') {
                router.push('/sign-in');
            }
        } catch (err: any) {
            setError(err.errors?.[0]?.message || 'Invalid code or password');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {!successfulCreation ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                                    <Mail className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Forgot your password?
                                </h2>
                                <p className="text-gray-600">
                                    Enter your email address and we'll send you a reset link
                                </p>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={emailAddress}
                                            onChange={(e) => setEmailAddress(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Enter your email address"
                                        />
                                        <Mail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            Send reset code
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            {/* Reset Password Form */}
                            <div className="text-center mb-8">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                    <Mail className="h-6 w-6 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Check your email
                                </h2>
                                <p className="text-gray-600">
                                    We sent a reset code to <strong>{emailAddress}</strong>
                                </p>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleReset} className="space-y-4">
                                <div>
                                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                                        Reset code
                                    </label>
                                    <input
                                        id="code"
                                        name="code"
                                        type="text"
                                        required
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center text-lg tracking-widest"
                                        placeholder="Enter reset code"
                                        maxLength={6}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        New password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Enter new password"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        'Reset password'
                                    )}
                                </button>
                            </form>
                        </>
                    )}

                    {/* Back to Sign In */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => router.push('/sign-in')}
                            className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to sign in
                        </button>
                    </div>

                    {/* Clerk Branding */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500 flex items-center justify-center">
                            Secured by
                            <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                            </svg>
                            clerk
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}