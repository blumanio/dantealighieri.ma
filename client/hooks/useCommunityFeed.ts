import { useState, useEffect, useCallback } from 'react';
// Updated imports to use the unified types
import { 
  PostsResponse, 
  UniversityPostsResponse, 
  CommunityPostsResponse,
  Post,
  UniversityPost,
  CommunityPost,
  isUniversityPostsResponse,
  isCommunityPostsResponse,
  isUniversityPost,
  isCommunityPost
} from '@/types/community';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Unified display interface for the frontend
interface DisplayablePost {
  _id: string;
  authorName: string;
  authorAvatarUrl?: string;
  content: string;
  createdAt: Date;
  sourceType: 'community' | 'university';
  universitySlug?: string;
  likesCount: number;
  commentsCount: number;
  postType?: string;
  title?: string;
  tags?: string[];
  userRole?: string;
  // Additional fields that might be useful
  parentName?: string;
  originalPost?: Post; // Keep reference to original data if needed
}

export const useCommunityFeed = (options?: { universitySlug?: string }) => {
  const { universitySlug } = options || {};

  const [posts, setPosts] = useState<DisplayablePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuickFilter, setSelectedQuickFilter] = useState('Recent');

  // Transform university posts to displayable format
  const transformUniversityPost = (post: UniversityPost): DisplayablePost => ({
    _id: post._id,
    authorName: post.authorFirstName && post.authorLastName 
      ? `${post.authorFirstName} ${post.authorLastName}` 
      : post.authorUsername || 'Unknown',
    authorAvatarUrl: post.authorImageUrl,
    content: post.content,
    createdAt: new Date(post.createdAt),
    sourceType: 'university',
    universitySlug: post.parentSlug,
    likesCount: 0, // University posts don't have likes in the current structure
    commentsCount: post.commentsCount || 0,
    parentName: post.parentName,
    originalPost: post
  });

  // Transform community posts to displayable format
  const transformCommunityPost = (post: CommunityPost): DisplayablePost => ({
    _id: post._id,
    authorName: post.userFullName || `${post.authorFirstName || ''} ${post.authorLastName || ''}`.trim() || 'Anonymous',
    authorAvatarUrl: post.userAvatarUrl || post.authorImageUrl,
    content: post.content,
    createdAt: new Date(post.createdAt),
    sourceType: 'community',
    universitySlug: post.universitySlug,
    likesCount: 0, // Add likes logic if available in your data
    commentsCount: post.comments?.length || 0,
    postType: post.postType,
    title: post.title,
    tags: post.tags,
    userRole: post.userRole,
    originalPost: post
  });

  // Main fetch function that handles both endpoints
  const fetchPosts = useCallback(async (
    page: number, 
    categories: string[], 
    search: string, 
    filter: string, 
    reset: boolean
  ) => {
    setIsLoading(true);
    if (reset) setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        filter: filter.toLowerCase(),
      });
      
      if (search) params.append('search', search);
      categories.forEach(cat => params.append('categories', cat));

      // Build URLs for both endpoints
      const urls = [
        `${API_BASE_URL}/api/university-hubs/community-posts?${params.toString()}`,
        `${API_BASE_URL}/api/posts?${params.toString()}`
      ];

      // Fetch from both endpoints
      const responses = await Promise.all(
        urls.map(url => 
          fetch(url).catch(err => {
            console.warn(`Failed to fetch from ${url}:`, err);
            return null;
          })
        )
      );

      // Parse responses safely
      const parsedResponses = await Promise.all(
        responses.map(async (response, index) => {
          if (!response || !response.ok) {
            console.warn(`Response ${index} failed or not ok`);
            return null;
          }
          
          try {
            const text = await response.text();
            return text ? JSON.parse(text) : null;
          } catch (parseError) {
            console.warn(`Failed to parse response ${index}:`, parseError);
            return null;
          }
        })
      );

      const [communityResponse, universityResponse] = parsedResponses;

      // Transform and merge posts
      const transformedPosts: DisplayablePost[] = [];
      let combinedTotalPosts = 0;
      let combinedTotalPages = 1;

      // Handle community posts response
      if (communityResponse && isCommunityPostsResponse(communityResponse)) {
        const communityPosts = communityResponse.data.map(transformCommunityPost);
        transformedPosts.push(...communityPosts);
        combinedTotalPosts += communityResponse.pagination.totalPosts;
        combinedTotalPages = Math.max(combinedTotalPages, communityResponse.pagination.totalPages);
      }

      // Handle university posts response
      if (universityResponse && isUniversityPostsResponse(universityResponse)) {
        const universityPosts = universityResponse.posts.map(transformUniversityPost);
        transformedPosts.push(...universityPosts);
        combinedTotalPosts += universityResponse.totalPosts;
        combinedTotalPages = Math.max(combinedTotalPages, universityResponse.totalPages);
      }

      // Remove duplicates based on _id and sort by creation date
      const uniquePostsMap = new Map<string, DisplayablePost>();
      transformedPosts.forEach(post => {
        // Use the most recent version if there are duplicates
        const existing = uniquePostsMap.get(post._id);
        if (!existing || post.createdAt > existing.createdAt) {
          uniquePostsMap.set(post._id, post);
        }
      });

      const uniquePosts = Array.from(uniquePostsMap.values())
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // Update state
      setPosts(prev => {
        if (reset) {
          return uniquePosts;
        } else {
          // Merge with existing posts and remove duplicates
          const existingMap = new Map(prev.map(p => [p._id, p]));
          uniquePosts.forEach(post => existingMap.set(post._id, post));
          return Array.from(existingMap.values())
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
      });

      setTotalPosts(combinedTotalPosts);
      setTotalPages(combinedTotalPages);
      setCurrentPage(page);

    } catch (err: any) {
      console.error("Error in fetchPosts:", err);
      setError("Failed to load feed. Please try again.");
      if (reset) setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [universitySlug]);

  // Effect to fetch posts when filters change
  useEffect(() => {
    fetchPosts(1, selectedCategories, searchTerm, selectedQuickFilter, true);
  }, [selectedCategories, selectedQuickFilter, searchTerm, fetchPosts]);

  // Comment submission handler
  const handleCommentSubmit = async (postId: string, commentText: string): Promise<void> => {
    const post = posts.find(p => p._id === postId);
    
    if (!post || !post.universitySlug) {
      console.error("Cannot submit comment: Post not found or missing university slug.");
      return;
    }

    try {
      let endpoint = '';
      
      // Determine the correct endpoint based on post source
      if (post.sourceType === 'community') {
        endpoint = `${API_BASE_URL}/api/university/${post.universitySlug}/community-posts/${postId}/comments`;
      } else if (post.sourceType === 'university') {
        endpoint = `${API_BASE_URL}/api/posts/${postId}/comments`;
      } else {
        throw new Error('Unknown post source type');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit comment: ${response.status}`);
      }

      // Refresh the feed to show the new comment
      await fetchPosts(1, selectedCategories, searchTerm, selectedQuickFilter, true);

    } catch (err) {
      console.error("Error submitting comment:", err);
      setError("Failed to submit comment. Please try again.");
    }
  };

  // Filter posts by university slug if provided
  const filteredPosts = universitySlug 
    ? posts.filter(post => post.universitySlug === universitySlug)
    : posts;

  return {
    posts: filteredPosts,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalPosts,
    selectedCategories,
    searchTerm,
    selectedQuickFilter,
    
    // Handlers
    handleCategoryToggle: (category: string) => {
      setSelectedCategories(prev => 
        prev.includes(category) 
          ? prev.filter(c => c !== category) 
          : [...prev, category]
      );
    },
    
    handleQuickFilterChange: (filter: string) => {
      setSelectedQuickFilter(filter);
    },
    
    handleSearch: (term: string) => {
      setSearchTerm(term);
    },
    
    handleRefresh: () => {
      setSelectedCategories([]);
      setSearchTerm('');
      setSelectedQuickFilter('Recent');
      fetchPosts(1, [], '', 'Recent', true);
    },
    
    loadMore: () => {
      if (currentPage < totalPages && !isLoading) {
        fetchPosts(
          currentPage + 1, 
          selectedCategories, 
          searchTerm, 
          selectedQuickFilter, 
          false
        );
      }
    },
    
    handleCommentSubmit,
    setPosts,
    
    // Additional utility methods
    refreshPosts: () => {
      fetchPosts(1, selectedCategories, searchTerm, selectedQuickFilter, true);
    },
    
    getPostsBySource: (sourceType: 'community' | 'university') => {
      return filteredPosts.filter(post => post.sourceType === sourceType);
    }
  };
};