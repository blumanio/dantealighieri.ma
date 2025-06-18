// components/auth/SignInPage.tsx
'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

export default function SignInPage() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        setIsLoading(true);
        setError('');

        try {
            const result = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.errors?.[0]?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthSignIn = async (strategy: 'oauth_google' | 'oauth_facebook') => {
        if (!isLoaded) return;

        try {
            await signIn.authenticateWithRedirect({
                strategy,
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/dashboard',
            });
        } catch (err: any) {
            setError(err.errors?.[0]?.message || 'An error occurred');
        }
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
            {/* Header Banner */}
            {/* <div className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <ArrowRight className="w-4 h-4" />
          </div>
          <h3 className="font-semibold">Exciting changes are on the way!</h3>
        </div>
        <p className="text-sm text-white/90">
          We're making things even better for you. Check back in a little while to discover our new features.
          It'll be worth the wait!
        </p>
      </div> */}

            <div className="flex items-center justify-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 sm:p-8">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                    Sign in to StudentItaly.it
                                </h1>
                                <p className="text-gray-600 text-sm sm:text-base">
                                    Welcome back! Please sign in to continue
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100">
                                    <p className="text-sm text-red-700 font-medium">{error}</p>
                                </div>
                            )}

                            {/* OAuth Buttons */}
                            <div className="space-y-3 mb-6">
                                <button
                                    onClick={() => handleOAuthSignIn('oauth_facebook')}
                                    className="w-full flex items-center justify-center px-4 py-3.5 border border-gray-200 rounded-xl bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                                >
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                        <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook
                                </button>

                                <button
                                    onClick={() => handleOAuthSignIn('oauth_google')}
                                    className="w-full flex items-center justify-center px-4 py-3.5 border border-gray-200 rounded-xl bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                                >
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Google
                                </button>
                            </div>

                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500 font-medium">or</span>
                                </div>
                            </div>

                            {/* Sign In Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email address or username
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            name="email"
                                            type="text"
                                            autoComplete="email"
                                            required
                                            value={emailAddress}
                                            onChange={(e) => setEmailAddress(e.target.value)}
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                                            placeholder="Enter email or username"
                                        />
                                        <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 pr-12"
                                            placeholder="Enter password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                            Remember me
                                        </label>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => router.push('/forgot-password')}
                                        className="text-sm text-emerald-600 hover:text-emerald-500 font-medium"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center px-4 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            Continue
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Sign Up Link */}
                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <button
                                        onClick={() => router.push('/sign-up')}
                                        className="text-emerald-600 hover:text-emerald-500 font-semibold"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            </div>
                        </div>

                        {/* Clerk Branding */}
                        <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
                            <p className="text-xs text-gray-500 flex items-center justify-center">
                                Secured by
                                <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                                </svg>
                                <span className="ml-1 font-medium">clerk</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}