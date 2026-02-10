// components/SimpleEmailCapture.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function SimpleEmailCapture({ 
  placeholder = "Enter your email",
  buttonText = "GET FREE GUIDE",
  source = "homepage-hero" 
}: {
  placeholder?: string;
  buttonText?: string;
  source?: string;
}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Send to your Mailchimp/backend
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source })
      });

      if (response.ok) {
        toast({
          title: 'Success! 🎉',
          description: 'Check your email for the free Italy study guide'
        });
        setEmail('');
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      toast({
        title: 'Oops!',
        description: 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500/20 dark:bg-gray-700"
        disabled={loading}
      />
      <Button 
        type="submit" 
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600"
      >
        {loading ? 'Sending...' : buttonText}
      </Button>
    </form>
  );
}