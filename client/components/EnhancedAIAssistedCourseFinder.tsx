'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Loader2,
  Search,
  Sparkles,
  Info,
  Link as LinkIcon,
  GraduationCap,
  BookOpen,
  Euro,
  CalendarDays,
  Target,
  Award,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Star,
  AlertCircle,
  Users,
  Building,
  Filter,
  X
} from 'lucide-react';

// Enhanced Types
interface Course {
  _id: string;
  title: string;
  universityName: string;
  description: string;
  url: string;
  language: string;
  degreeLevel: string;
  tuitionFee?: string;
  duration?: string;
  applicationDeadline?: string;
  startDate?: string;
  entryRequirements?: string;
  curriculumSummary?: string;
  careerOpportunities?: string;
  city?: string;
  aiSummary?: string;
  relevanceScore?: number;
  scholarships?: string;
  programHighlights?: string;
  contactInfo?: string;
  webScrapedInfo?: {
    applicationDeadlines?: string[];
    scholarships?: string[];
    tuitionFees?: string[];
    admissionRequirements?: string[];
    courseDuration?: string;
    contactInfo?: string[];
    programHighlights?: string[];
    careerOutcomes?: string[];
    languageOfInstruction?: string;
    campusLocation?: string;
    additionalInfo?: string[];
  };
}

interface AiAdvisorResponse {
  matchedCourses: Course[];
  aiGeneralAdvice?: string;
  error?: string;
  debug?: any;
  searchMetadata?: {
    totalFound: number;
    filtered: number;
    relevanceThreshold: number;
    searchTerms: string[];
    excludedTerms: string[];
  };
}

interface SearchFilters {
  minRelevanceScore: number;
  strictFieldMatching: boolean;
  excludeGenericMatches: boolean;
  exactPhraseMatching: boolean;
}

// Helper component for displaying info sections consistently
const InfoSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  content: string;
  variant?: 'default' | 'highlight' | 'urgent' | 'success';
}> = ({ icon, title, content, variant = 'default' }) => {
  const baseClasses = "p-4 rounded-lg flex items-start space-x-3";
  const variantClasses = {
    default: "bg-slate-100 text-slate-800",
    highlight: "bg-sky-50 border border-sky-200 text-sky-800",
    urgent: "bg-red-50 border border-red-200 text-red-800",
    success: "bg-green-50 border border-green-200 text-green-800",
  };
  const iconClasses = {
    default: "text-slate-500",
    highlight: "text-sky-500",
    urgent: "text-red-500",
    success: "text-green-500",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      <div className={`mt-1 h-5 w-5 flex-shrink-0 ${iconClasses[variant]}`}>
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-sm mt-1">{content}</p>
      </div>
    </div>
  );
};


const EnhancedAIAssistedCourseFinder: React.FC = () => {
  const [userInterest, setUserInterest] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<AiAdvisorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    minRelevanceScore: 0.7,
    strictFieldMatching: true,
    excludeGenericMatches: true,
    exactPhraseMatching: false
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const user: { id?: string } | null = { id: undefined };

  // Predefined field mappings to avoid generic matches
  const fieldMappings: { [key: string]: string[] } = {
    'computer science': ['computer science', 'informatics', 'computing', 'software engineering', 'IT'],
    'artificial intelligence': ['AI', 'artificial intelligence', 'machine learning', 'deep learning', 'neural networks'],
    'data science': ['data science', 'data analytics', 'big data', 'statistics', 'data mining'],
    'cybersecurity': ['cybersecurity', 'information security', 'network security', 'cyber defense'],
    'business': ['business administration', 'MBA', 'management', 'finance', 'marketing', 'economics'],
    'engineering': ['engineering', 'mechanical engineering', 'electrical engineering', 'civil engineering'],
    'medicine': ['medicine', 'medical', 'healthcare', 'nursing', 'pharmacy'],
    'psychology': ['psychology', 'cognitive science', 'behavioral science', 'neuroscience'],
    'design': ['design', 'graphic design', 'UX design', 'product design', 'visual design']
  };

  // Generic terms that should be excluded when not the main field
  const genericTerms = ['science', 'technology', 'studies', 'program', 'course', 'degree', 'bachelor', 'master', 'university'];

  useEffect(() => {
    if (userInterest) {
      setError(null);
      setResults(null);
      setDebugInfo(null);
    }
  }, [userInterest]);

  const preprocessSearchQuery = (query: string): { enhancedQuery: string; searchMetadata: any } => {
    const lowerQuery = query.toLowerCase();
    let enhancedQuery = query;
    let searchMetadata: {
        originalQuery: string;
        detectedField: string | null;
        synonymsAdded: string[];
        excludedTerms: string[];
        searchStrategy: string;
    } = {
      originalQuery: query,
      detectedField: null,
      synonymsAdded: [],
      excludedTerms: [],
      searchStrategy: 'standard'
    };

    // Detect primary field and add synonyms
    for (const [field, synonyms] of Object.entries(fieldMappings)) {
      if (lowerQuery.includes(field) || synonyms.some(syn => lowerQuery.includes(syn.toLowerCase()))) {
        searchMetadata.detectedField = field;
        searchMetadata.synonymsAdded = synonyms;
        searchMetadata.searchStrategy = 'field-specific';

        // Create enhanced query with field-specific terms
        const fieldTerms = synonyms.map(s => `"${s}"`).join(' OR '); // Use phrase matching for synonyms
        enhancedQuery = `(${fieldTerms}) AND (${query})`;

        // Add terms to exclude if strict matching is enabled
        if (searchFilters.strictFieldMatching) {
          const otherFields = Object.entries(fieldMappings)
            .filter(([otherField]) => otherField !== field)
            .flatMap(([, otherSynonyms]) => otherSynonyms);
          searchMetadata.excludedTerms = otherFields;
        }
        break;
      }
    }

    return { enhancedQuery, searchMetadata };
  };

  const handleSearch = async () => {
    if (!userInterest.trim()) {
      setError('Please enter your study interests.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);
    setDebugInfo(null);

    try {
      const { enhancedQuery, searchMetadata } = preprocessSearchQuery(userInterest);

      const response = await fetch('/api/ai/course-advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interest: userInterest,
          enhancedQuery: enhancedQuery,
          searchFilters: searchFilters,
          searchMetadata: searchMetadata,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(`An error occurred: ${response.statusText || 'Server error'} (Status: ${response.status})`);
        }
        throw new Error(errorData.message || errorData.error || `An error occurred: ${response.statusText}`);
      }

      const data: AiAdvisorResponse = await response.json();

      // Client-side filtering for additional precision
      if (data.matchedCourses && searchFilters.excludeGenericMatches) {
        data.matchedCourses = data.matchedCourses.filter(course => {
          const courseText = `${course.title} ${course.description}`.toLowerCase();
          const mainField = searchMetadata.detectedField;

          if (mainField) {
            const fieldSynonyms = fieldMappings[mainField];
            const hasFieldMatch = fieldSynonyms.some(synonym =>
              courseText.includes(synonym.toLowerCase())
            );

            // Only include if course has a specific field match
            if (!hasFieldMatch) return false;

            // Exclude if the course title seems to only match generic terms while lacking specific field synonyms
            const onlyGenericMatch = genericTerms.some(term =>
              course.title.toLowerCase().includes(term) && !fieldSynonyms.some(syn =>
                course.title.toLowerCase().includes(syn.toLowerCase())
              )
            );

            return !onlyGenericMatch;
          }

          return true;
        });
      }

      // Sort by relevance score if available
      if (data.matchedCourses) {
        data.matchedCourses.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      }

      setResults(data);
      if (data.debug) {
        setDebugInfo({ ...data.debug, clientSearchMetadata: searchMetadata });
        console.log("Enhanced Debug Info:", { ...data.debug, clientSearchMetadata: searchMetadata });
      }

      if (data.error) {
        setError(data.error);
        if (results) setResults(prev => ({ ...(prev || { matchedCourses: [], aiGeneralAdvice: '' }), matchedCourses: [] }));
      } else if (!data.matchedCourses || data.matchedCourses.length === 0) {
        setError(`No courses found matching "${userInterest}". Try using more specific terms or adjusting search filters.`);
      }

    } catch (err: any) {
      console.error('Enhanced AI Course Advisor Error:', err);
      setError(err.message || 'Failed to fetch course recommendations.');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const SearchSuggestions = () => (
    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
      <h4 className="text-sm font-medium text-blue-800 mb-2">Search Tips for Better Results:</h4>
      <ul className="text-xs text-blue-700 space-y-1">
        <li>• Use specific field names: "Computer Science" instead of just "Science"</li>
        <li>• Include degree level: "Master's in Data Science"</li>
        <li>• Specify language: "taught in English"</li>
        <li>• Add location: "in Milan" or "Italy"</li>
        <li>• Use full program names: "Artificial Intelligence" not just "AI"</li>
      </ul>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gradient-to-br from-slate-50 to-sky-100 min-h-screen rounded-lg shadow-xl">
      <Card className="max-w-5xl mx-auto shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-teal-600 to-blue-600 text-primary-content p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-8 w-8 text-yellow-300" />
              <div>
                <CardTitle className="text-3xl font-bold text-white"> AI Course Finder</CardTitle>
                <CardDescription className="text-teal-100 text-sm mt-1">
                  Advanced field-specific search with intelligent filtering
                </CardDescription>
              </div>
            </div>
            {/* <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-teal-600 border-white hover:bg-white hover:text-teal-600"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button> */}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {showFilters && (
            <Card className="bg-gray-50 border-gray-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Search Settings</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Minimum Relevance Score</label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={searchFilters.minRelevanceScore}
                      onChange={(e) => setSearchFilters(prev => ({
                        ...prev,
                        minRelevanceScore: parseFloat(e.target.value) || 0.7
                      }))}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="strictMatching"
                        checked={searchFilters.strictFieldMatching}
                        onChange={(e) => setSearchFilters(prev => ({
                          ...prev,
                          strictFieldMatching: e.target.checked
                        }))}
                        className="rounded"
                      />
                      <label htmlFor="strictMatching" className="text-sm">Strict Field Matching</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="excludeGeneric"
                        checked={searchFilters.excludeGenericMatches}
                        onChange={(e) => setSearchFilters(prev => ({
                          ...prev,
                          excludeGenericMatches: e.target.checked
                        }))}
                        className="rounded"
                      />
                      <label htmlFor="excludeGeneric" className="text-sm">Exclude Generic Matches</label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <label htmlFor="userInterest" className="text-sm font-medium text-gray-700">
              Describe your study interests with specific field names
            </label>
            <div className="flex space-x-2">
              <Input
                id="userInterest"
                type="text"
                value={userInterest}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInterest(e.target.value)}
                placeholder="e.g., Master's in Computer Science with focus on Machine Learning"
                className="flex-grow text-base p-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-150 ease-in-out shadow hover:shadow-md"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Search className="mr-2 h-5 w-5" />
                )}
                Find Courses
              </Button>
            </div>
            <SearchSuggestions />
          </div>

          {error && (!results || !results.matchedCourses || results.matchedCourses.length === 0) && (
            <Alert variant="destructive" className="bg-red-50 border-red-300 text-red-700">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <AlertTitle className="font-semibold">Search Information</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-3 p-8 text-gray-600">
              <Loader2 className="h-12 w-12 animate-spin text-teal-500" />
              <p className="text-lg font-medium">AI is analyzing and filtering results...</p>
              <p className="text-sm text-gray-500">Applying field-specific matching and precision filters.</p>
            </div>
          )}

          {results && results.matchedCourses && results.matchedCourses.length > 0 && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                  Filtered Results ({results.matchedCourses.length})
                </h2>
                {results.searchMetadata && (
                  <Badge variant="outline" className="text-xs">
                    {results.searchMetadata.searchTerms?.length || 0} search terms used
                  </Badge>
                )}
              </div>

              {results.aiGeneralAdvice && (
                <Alert className="bg-sky-50 border-sky-300 text-sky-800">
                  <Sparkles className="h-5 w-5 text-sky-500" />
                  <AlertTitle className="font-semibold">AI Enhanced Analysis</AlertTitle>
                  <AlertDescription>{results.aiGeneralAdvice}</AlertDescription>
                </Alert>
              )}

              <Accordion type="single" collapsible className="w-full space-y-4">
                {results.matchedCourses.map((course, index) => (
                  <Card key={course._id || index} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <AccordionItem value={`course-${index}`} className="border-b-0">
                      <AccordionTrigger className="p-4 md:p-6 hover:bg-slate-50 rounded-t-xl text-left">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-teal-700">{course.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                <Building className="inline-block mr-1 h-4 w-4" />
                                {course.universityName} - {course.city}
                              </p>
                            </div>
                            {course.relevanceScore && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 ml-2">
                                <Star className="w-3 h-3 mr-1" />
                                {Math.round(course.relevanceScore * 100)}% match
                              </Badge>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-sky-100 text-sky-700">
                              <GraduationCap className="w-3 h-3 mr-1" />
                              {course.degreeLevel}
                            </Badge>
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              {course.language}
                            </Badge>
                            {course.duration && (
                              <Badge variant="outline">
                                <Clock className="w-3 h-3 mr-1" />
                                {course.duration}
                              </Badge>
                            )}
                            {course.scholarships && course.scholarships !== "No scholarship information available." && (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                                    <Award className="w-3 h-3 mr-1" />
                                    Scholarships Available
                                </Badge>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="p-4 md:p-6 bg-slate-50/50 rounded-b-xl">
                        {course.aiSummary && (
                          <Alert className="mb-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 text-yellow-800">
                            <Sparkles className="h-4 w-4 text-yellow-600" />
                            <AlertTitle className="font-medium text-sm">AI Enhanced Summary</AlertTitle>
                            <AlertDescription className="text-xs">{course.aiSummary}</AlertDescription>
                          </Alert>
                        )}

                        <Tabs defaultValue="overview" className="w-full">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="requirements">Requirements</TabsTrigger>
                            <TabsTrigger value="financial">Financial</TabsTrigger>
                            <TabsTrigger value="contact">Contact</TabsTrigger>
                          </TabsList>

                          <TabsContent value="overview" className="space-y-4 mt-4">
                            <div className="text-sm text-gray-700 leading-relaxed">
                                <p className="mb-3">{course.description}</p>
                            </div>

                            {course.curriculumSummary && (
                                <InfoSection
                                    icon={<BookOpen />}
                                    title="Curriculum Highlights"
                                    content={course.curriculumSummary}
                                />
                            )}

                            {course.programHighlights && course.programHighlights !== "Program features not specified." && (
                                <InfoSection
                                    icon={<Star />}
                                    title="Program Features"
                                    content={course.programHighlights}
                                    variant="highlight"
                                />
                            )}

                            {course.careerOpportunities && (
                                <InfoSection
                                    icon={<Briefcase />}
                                    title="Career Opportunities"
                                    content={course.careerOpportunities}
                                />
                            )}
                          </TabsContent>

                          <TabsContent value="requirements" className="space-y-4 mt-4">
                            {course.entryRequirements && (
                                <InfoSection
                                    icon={<Target />}
                                    title="Entry Requirements"
                                    content={course.entryRequirements}
                                />
                            )}

                            {course.applicationDeadline && course.applicationDeadline !== "No deadline information available." && (
                                <InfoSection
                                    icon={<CalendarDays />}
                                    title="Important Deadlines"
                                    content={course.applicationDeadline}
                                    variant="urgent"
                                />
                            )}

                            {course.webScrapedInfo?.admissionRequirements && course.webScrapedInfo.admissionRequirements.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-700 text-sm flex items-center">
                                        <Users className="w-4 h-4 mr-2 text-blue-600" />
                                        Detailed Admission Requirements
                                    </h4>
                                    <div className="bg-blue-50 p-3 rounded-md">
                                        {course.webScrapedInfo.admissionRequirements.map((req, idx) => (
                                            <p key={idx} className="text-xs text-blue-800 mb-1">• {req}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                          </TabsContent>

                          <TabsContent value="financial" className="space-y-4 mt-4">
                            {course.tuitionFee && course.tuitionFee !== "Cost information not available." && (
                                <InfoSection
                                    icon={<Euro />}
                                    title="Cost Information"
                                    content={course.tuitionFee}
                                />
                            )}

                            {course.scholarships && course.scholarships !== "No scholarship information available." && (
                                <InfoSection
                                    icon={<Award />}
                                    title="Scholarship Opportunities"
                                    content={course.scholarships}
                                    variant="success"
                                />
                            )}

                            {course.webScrapedInfo?.tuitionFees && course.webScrapedInfo.tuitionFees.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-700 text-sm flex items-center">
                                        <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                                        Detailed Fee Information
                                    </h4>
                                    <div className="bg-green-50 p-3 rounded-md">
                                        {course.webScrapedInfo.tuitionFees.map((fee, idx) => (
                                            <p key={idx} className="text-xs text-green-800 mb-1">• {fee}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {course.webScrapedInfo?.scholarships && course.webScrapedInfo.scholarships.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-700 text-sm flex items-center">
                                        <Award className="w-4 h-4 mr-2 text-yellow-600" />
                                        Available Scholarships
                                    </h4>
                                    <div className="bg-yellow-50 p-3 rounded-md">
                                        {course.webScrapedInfo.scholarships.map((scholarship, idx) => (
                                            <p key={idx} className="text-xs text-yellow-800 mb-1">• {scholarship}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                          </TabsContent>

                          <TabsContent value="contact" className="space-y-4 mt-4">
                            {course.contactInfo && course.contactInfo !== "Contact information not available." && (
                                <InfoSection
                                    icon={<Phone />}
                                    title="Contact Information"
                                    content={course.contactInfo}
                                />
                            )}

                            {course.webScrapedInfo?.contactInfo && course.webScrapedInfo.contactInfo.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-700 text-sm flex items-center">
                                        <Mail className="w-4 h-4 mr-2 text-purple-600" />
                                        Additional Contact Details
                                    </h4>
                                    <div className="bg-purple-50 p-3 rounded-md">
                                        {course.webScrapedInfo.contactInfo.map((contact, idx) => (
                                            <p key={idx} className="text-xs text-purple-800 mb-1">• {contact}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {course.webScrapedInfo?.campusLocation && (
                                <InfoSection
                                    icon={<MapPin />}
                                    title="Campus Location"
                                    content={course.webScrapedInfo.campusLocation}
                                />
                            )}

                            <div className="pt-3 border-t">
                                <Button
                                    variant="default"
                                    asChild
                                    className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
                                >
                                    <a href={course.url} target="_blank" rel="noopener noreferrer">
                                        Visit Official Course Page <LinkIcon className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                ))}
              </Accordion>
            </div>
          )}

          {debugInfo && (
            <Card className="mt-6 bg-slate-50 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-slate-700">
                  <Info className="w-5 h-5 mr-2" />
                  Search Analytics & Debug
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {debugInfo.clientSearchMetadata && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <h4 className="font-medium text-sm mb-2 text-blue-800">Client-Side Search Strategy:</h4>
                    <div className="text-xs space-y-1 text-blue-700">
                      <p><strong>Detected Field:</strong> {debugInfo.clientSearchMetadata.detectedField || 'Generic'}</p>
                      <p><strong>Strategy:</strong> {debugInfo.clientSearchMetadata.searchStrategy}</p>
                      {debugInfo.clientSearchMetadata.synonymsAdded?.length > 0 && (
                        <p><strong>Synonyms Used:</strong> {debugInfo.clientSearchMetadata.synonymsAdded.join(', ')}</p>
                      )}
                      {debugInfo.clientSearchMetadata.excludedTerms?.length > 0 && (
                        <p><strong>Excluded Terms:</strong> {debugInfo.clientSearchMetadata.excludedTerms.slice(0, 5).join(', ')}...</p>
                      )}
                    </div>
                  </div>
                )}
                <div className="text-xs bg-slate-100 p-4 rounded-md overflow-x-auto">
                  <h4 className="font-medium text-sm mb-2 text-slate-600">Full Debug Response from Server:</h4>
                  <pre className="whitespace-pre-wrap break-all">
                    <code>{JSON.stringify(debugInfo, null, 2)}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
        {/* <CardFooter className="p-4 bg-slate-50 border-t">
            <p className="text-xs text-slate-500 text-center w-full">
                Enhanced AI Course Finder © 2025. All rights reserved.
            </p>
        </CardFooter> */}
      </Card>
    </div>
  );
};

export default EnhancedAIAssistedCourseFinder;