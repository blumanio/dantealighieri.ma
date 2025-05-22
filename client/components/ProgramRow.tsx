import React, { useState, useEffect } from 'react';
import { SignInButton, useUser } from '@clerk/nextjs';
import { Lock, MapPin, ExternalLink, School, ArrowRight, Heart, Loader2 } from 'lucide-react'; // Added Heart, Loader2
import { useLanguage } from '@/context/LanguageContext';

interface Course {
  uni: string;
  comune: string;
  link: string;
  nome: string;
}

// This type should ideally come from a shared types file
interface FavoriteItem {
  _id: string;
  userId: string;
  courseUni: string;
  courseNome: string;
  courseLink: string;
  courseComune: string;
  createdAt: string;
  updatedAt: string;
}

interface ProgramRowProps {
  course: Course;
  // These props would be determined by a parent component that fetches all user favorites
  // and checks if this course is among them.
  initialIsFavorite?: boolean;
  initialFavoriteId?: string | null;
  onFavoriteToggle?: (courseLink: string, isFavorite: boolean, favoriteId: string | null) => void; // Callback for parent
}

const ProgramRow: React.FC<ProgramRowProps> = ({
  course,
  initialIsFavorite = false,
  initialFavoriteId = null,
  onFavoriteToggle,
}) => {
  const { isSignedIn, user } = useUser();
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [favoriteId, setFavoriteId] = useState<string | null>(initialFavoriteId);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
    setFavoriteId(initialFavoriteId);
  }, [initialIsFavorite, initialFavoriteId]);

  const handleToggleFavorite = async () => {
    if (!isSignedIn || !user) {
      setFeedbackMessage('Please sign in to manage favorites.');
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }

    setIsLoading(true);
    setFeedbackMessage(null);

    try {
      let response;
      let result;

      if (isFavorite && favoriteId) {
        // Remove from favorites
        response = await fetch(`/api/favorites?id=${favoriteId}`, {
          method: 'DELETE',
        });
        result = await response.json();
        if (response.ok && result.success) {
          setIsFavorite(false);
          setFavoriteId(null);
          setFeedbackMessage(result.message || 'Removed from favorites.');
          if (onFavoriteToggle) onFavoriteToggle(course.link, false, null);
        } else {
          throw new Error(result.message || 'Failed to remove favorite.');
        }
      } else {
        // Add to favorites
        response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ course }),
        });
        result = await response.json();
        if (response.ok && result.success) {
          setIsFavorite(true);
          setFavoriteId(result.data._id); // Assuming API returns the new/existing favorite item
          setFeedbackMessage(result.message || 'Added to favorites!');
          if (onFavoriteToggle) onFavoriteToggle(course.link, true, result.data._id);
        } else {
          throw new Error(result.message || 'Failed to add favorite.');
        }
      }
    } catch (error: any) {
      console.error('Failed to toggle favorite:', error);
      setFeedbackMessage(error.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };
  
  // Non-signed in view remains the same...
  if (!isSignedIn) {
    return (
      <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-neutral-200 
                      hover:shadow-medium transition-all duration-300">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2 
                             line-clamp-2 hover:line-clamp-none transition-all duration-300">
                {course.uni}
              </h3>
              <div className="flex items-center gap-2 text-textSecondary text-sm">
                <MapPin className="h-4 w-4 text-primary/70" />
                <span>{course.comune}</span>
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                             bg-primary/10 text-primary whitespace-nowrap">
              <Lock className="h-3.5 w-3.5 mr-1" />
              Restricted
            </span>
          </div>
          <p className="mt-4 text-lg font-semibold text-textSecondary line-clamp-2 
                       hover:line-clamp-none transition-all duration-300">
            {course.nome}
          </p>
          <div className="mt-6">
            <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <School className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2 text-center">
                  <h4 className="font-medium text-primary">
                    {t('universities', 'protectedContent')}
                  </h4>
                  <p className="text-sm text-textSecondary max-w-sm mx-auto">
                    {t('programs', 'signInToAccess')}
                  </p>
                </div>
                <SignInButton mode="modal">
                  <button className="inline-flex items-center gap-2 px-6 py-2.5 
                                     bg-primary hover:bg-primary-dark text-white font-medium 
                                     rounded-full transition-all duration-300 text-sm
                                     hover:shadow-soft active:scale-95">
                    {t('universities', 'login')}
                    <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                </SignInButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Signed-in user view
  return (
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 sm:p-6 
                   hover:shadow-medium transition-all duration-300 hover:border-primary/20 group relative">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="space-y-4 flex-grow">
          <div>
            <p className="text-sm text-textSecondary mb-1">
              {t('programs', 'clickLink')}
            </p>
            <a
              href={course.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-2 font-semibold text-lg 
                         text-primary hover:text-primary-dark transition-colors duration-300"
            >
              <span className="underline-offset-4 group-hover/link:underline">
                {course.nome}
              </span>
              <ExternalLink className="h-4 w-4 transform group-hover/link:translate-x-0.5 
                                         group-hover/link:-translate-y-0.5 transition-transform duration-300" />
            </a>
          </div>
          <div className="flex items-center text-sm text-textSecondary">
            <MapPin className="h-4 w-4 text-primary/70 mr-2" />
            <span className="font-medium">{course.comune}</span>
          </div>
          <div className="flex items-center gap-2 text-textPrimary font-medium">
            <School className="h-5 w-5 text-primary/70" />
            <span className="group-hover:text-primary transition-colors duration-300">
              {course.uni}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 sm:pt-1">
          <button
            onClick={handleToggleFavorite}
            disabled={isLoading}
            title={isLoading ? t('profile', 'favoritesUpdating') : (isFavorite ? t('profile', 'favoritesRemoveTooltip') : t('profile', 'favoritesAddTooltip'))}
            className={`p-2.5 rounded-full transition-all duration-200 ease-in-out group/fav
                        ${isLoading ? 'cursor-not-allowed bg-gray-200' : 'hover:bg-red-100 active:bg-red-200'}
                        ${isFavorite ? 'text-red-500 bg-red-100' : 'text-neutral-500 hover:text-red-500'}`}
            aria-label="Toggle Favorite"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
            )}
          </button>
        </div>
      </div>
      {feedbackMessage && (
        <p className={`mt-3 text-xs text-center sm:text-left ${feedbackMessage.includes('Failed') || feedbackMessage.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
          {feedbackMessage}
        </p>
      )}
    </div>
  );
};

export default ProgramRow;