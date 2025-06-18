// Filename: components/AIAssistedCourseFinder.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Assuming Shadcn UI button
import { Input } from '@/components/ui/input';   // Assuming Shadcn UI input
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Shadcn UI Card
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'; // Shadcn UI Accordion
import { Badge } from '@/components/ui/badge'; // Shadcn UI Badge
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Shadcn UI Alert
import { Loader2, Search, Sparkles, Info, Link as LinkIcon, GraduationCap, BookOpen, Euro, CalendarDays, Target } from 'lucide-react';
// import { useUser } from '@clerk/nextjs'; // For user context if needed - Temporarily commented out.

// --- Types ---
interface Course {
  _id: string;
  title: string; // Will be mapped from 'nome'
  universityName: string; // Will be mapped from 'uni'
  description: string; // Assuming a 'descrizione' or similar might exist, or will be N/A
  url: string; // Will be mapped from 'link'
  language: string; // Will be mapped from 'lingua'
  degreeLevel: string; // Will be mapped from 'tipo'
  tuitionFee?: string; // No direct mapping in example, would need to be added to DB schema
  duration?: string; // No direct mapping in example
  applicationDeadline?: string; // No direct mapping in example
  startDate?: string; // No direct mapping in example
  entryRequirements?: string; // Mapped from 'accesso', or AI summarized
  curriculumSummary?: string; 
  careerOpportunities?: string; 
  city?: string; // Will be mapped from 'comune'
  aiSummary?: string; 
  relevanceScore?: number; 
}

interface AiAdvisorResponse {
  matchedCourses: Course[];
  aiGeneralAdvice?: string;
  error?: string;
  debug?: any; // For receiving debug info from backend
}

// --- Main Component ---
const AIAssistedCourseFinder: React.FC = () => {
  const [userInterest, setUserInterest] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<AiAdvisorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  const user: { id?: string } | null = { id: undefined }; // Placeholder for Clerk's useUser()

  useEffect(() => {
    if (userInterest) {
      setError(null);
      setResults(null);
      setDebugInfo(null);
    }
  }, [userInterest]);

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
      const response = await fetch('/api/ai/course-advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interest: userInterest,
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
      setResults(data);
      if (data.debug) {
        setDebugInfo(data.debug);
        console.log("Debug Info from Backend:", data.debug);
      }


      if (data.error) { 
        setError(data.error);
        if (results) setResults(prev => ({ ...(prev || { matchedCourses: [], aiGeneralAdvice: '' }), matchedCourses: [] }));
      } else if (!data.matchedCourses || data.matchedCourses.length === 0) {
        // Use the general advice from backend if available, otherwise a default message
        setError(data.aiGeneralAdvice || 'No courses found matching your interest. Try rephrasing your query.');
      }

    } catch (err: any) {
      console.error('AI Course Advisor Error:', err);
      setError(err.message || 'Failed to fetch course recommendations.');
      setResults(null); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gradient-to-br from-slate-50 to-sky-100 min-h-screen rounded-lg shadow-xl">
      <Card className="max-w-3xl mx-auto shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-teal-600 text-primary-content p-6">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-8 w-8 text-yellow-300" />
            <CardTitle className="text-3xl font-bold text-white">AI Course Advisor</CardTitle>
          </div>
          <CardDescription className="text-teal-100 text-sm mt-1">
            Tell us what you want to study, and our AI will find the best matches and details for you!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="userInterest" className="text-sm font-medium text-gray-700">
              Describe your study interests (e.g., "Master's in AI in Milan, taught in English")
            </label>
            <div className="flex space-x-2">
              <Input
                id="userInterest"
                type="text"
                value={userInterest}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInterest(e.target.value)}
                placeholder="e.g., Bachelor in Computer Science, focus on cybersecurity"
                className="flex-grow text-base p-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-150 ease-in-out shadow hover:shadow-md"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Search className="mr-2 h-5 w-5" />
                )}
                Find Courses
              </Button>
            </div>
          </div>

          {error && (!results || !results.matchedCourses || results.matchedCourses.length === 0) && (
            <Alert variant="destructive" className="bg-red-50 border-red-300 text-red-700">
              <Info className="h-5 w-5 text-red-500" />
              <AlertTitle className="font-semibold">Search Information</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-3 p-8 text-gray-600">
              <Loader2 className="h-12 w-12 animate-spin text-teal-500" />
              <p className="text-lg font-medium">Our AI is searching for you...</p>
              <p className="text-sm text-gray-500">This might take a few moments.</p>
            </div>
          )}

          {results && results.matchedCourses && results.matchedCourses.length > 0 && (
            <div className="space-y-6 pt-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                Recommended Courses
              </h2>
              {results.aiGeneralAdvice && (
                <Alert className="bg-sky-50 border-sky-300 text-sky-800">
                  <Sparkles className="h-5 w-5 text-sky-500" />
                  <AlertTitle className="font-semibold">AI Advice</AlertTitle>
                  <AlertDescription>{results.aiGeneralAdvice}</AlertDescription>
                </Alert>
              )}
              <Accordion type="single" collapsible className="w-full space-y-4">
                {results.matchedCourses.map((course, index) => (
                  <Card key={course._id || index} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <AccordionItem value={`course-${index}`} className="border-b-0">
                      <AccordionTrigger className="p-4 md:p-6 hover:bg-slate-50 rounded-t-xl text-left">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-teal-700">{course.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            <GraduationCap className="inline-block mr-1 h-4 w-4" /> {course.universityName} - {course.city}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-sky-100 text-sky-700">{course.degreeLevel}</Badge>
                            <Badge variant="secondary" className="bg-green-100 text-green-700">{course.language}</Badge>
                            {course.duration && <Badge variant="outline">{course.duration}</Badge>}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 md:p-6 bg-slate-50/50 rounded-b-xl">
                        {course.aiSummary && (
                          <Alert className="mb-4 bg-yellow-50 border-yellow-300 text-yellow-800">
                            <Sparkles className="h-4 w-4 text-yellow-600" />
                            <AlertTitle className="font-medium text-sm">AI Quick Summary</AlertTitle>
                            <AlertDescription className="text-xs">{course.aiSummary}</AlertDescription>
                          </Alert>
                        )}
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">{course.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                          {course.tuitionFee && <InfoItem icon={<Euro />} label="Tuition Fee" value={course.tuitionFee} />}
                          {course.applicationDeadline && <InfoItem icon={<CalendarDays />} label="Application Deadline" value={course.applicationDeadline} />}
                          {course.startDate && <InfoItem icon={<Target />} label="Start Date" value={course.startDate} />}
                        </div>

                        {course.entryRequirements && (
                          <div className="mb-3">
                            <h4 className="font-semibold text-gray-700 text-sm mb-1">Entry Requirements:</h4>
                            <p className="text-xs text-gray-600 whitespace-pre-line bg-gray-100 p-2 rounded-md">{course.entryRequirements}</p>
                          </div>
                        )}
                        {course.curriculumSummary && (
                          <div className="mb-3">
                            <h4 className="font-semibold text-gray-700 text-sm mb-1">Curriculum Highlights:</h4>
                            <p className="text-xs text-gray-600 whitespace-pre-line bg-gray-100 p-2 rounded-md">{course.curriculumSummary}</p>
                          </div>
                        )}
                        {course.careerOpportunities && (
                          <div className="mb-3">
                            <h4 className="font-semibold text-gray-700 text-sm mb-1">Career Opportunities:</h4>
                            <p className="text-xs text-gray-600 whitespace-pre-line bg-gray-100 p-2 rounded-md">{course.careerOpportunities}</p>
                          </div>
                        )}

                        <Button
                            variant="link"
                            asChild
                            className="text-teal-600 hover:text-teal-700 p-0 h-auto text-sm"
                        >
                          <a href={course.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            Visit Official Course Page <LinkIcon className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                ))}
              </Accordion>
            </div>
          )}
          {/* Section to display debug information */}
          {debugInfo && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Debugging Information</CardTitle>
              </CardHeader>
              <CardContent className="text-xs bg-slate-100 p-4 rounded-md overflow-x-auto">
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter className="p-6 bg-gray-50 border-t">
            <p className="text-xs text-gray-500 text-center w-full">
                AI recommendations are based on available data and your input. Always verify details on the official university website.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
};

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start space-x-2 p-2 bg-slate-100 rounded-md">
    <span className="text-teal-600 mt-0.5">{React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4" })}</span>
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-xs text-gray-800 font-semibold">{value}</p>
    </div>
  </div>
);

export default AIAssistedCourseFinder;
