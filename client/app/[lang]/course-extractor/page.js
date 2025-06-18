'use client';

import React, { useState } from 'react';
import { Search, ExternalLink, Calendar, DollarSign, Clock, BookOpen, Users, MapPin, Award, AlertCircle, Info, Globe, Download, Copy, CheckCircle } from 'lucide-react';

const CourseExtractor = () => {
  const [url, setUrl] = useState('');
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Sample URLs for testing (real educational websites)
  const sampleUrls = [
    'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x',
    'https://www.coursera.org/specializations/machine-learning-introduction',
    'https://www.udacity.com/course/data-scientist-nanodegree--nd025',
    'https://online.stanford.edu/courses/cs229-machine-learning',
    'https://www.futurelearn.com/courses/programming-for-everybody-python'
  ];

  // Enhanced keywords for better extraction
  const keywords = {
    fees: ['tuition', 'fee', 'cost', 'price', 'payment', '$', '€', '£', 'USD', 'EUR', 'GBP', 'pricing', 'subscription', 'monthly', 'yearly', 'semester fee', 'course fee'],
    deadlines: ['deadline', 'due date', 'application', 'registration', 'enrollment', 'closing date', 'apply by', 'registration deadline', 'admission deadline', 'cutoff date'],
    duration: ['duration', 'length', 'weeks', 'months', 'years', 'semester', 'term', 'hours', 'self-paced', 'timeline', 'course length', 'study time'],
    requirements: ['requirement', 'prerequisite', 'qualification', 'grade', 'GPA', 'score', 'background', 'experience', 'skills needed', 'prior knowledge'],
    location: ['location', 'campus', 'city', 'country', 'online', 'remote', 'hybrid', 'in-person', 'virtual', 'on-campus', 'distance learning'],
    credits: ['credit', 'unit', 'hour', 'ECTS', 'credit hour', 'CEU', 'continuing education', 'academic credit', 'transfer credit'],
    start: ['start date', 'begin', 'commence', 'session', 'intake', 'enrollment period', 'next session', 'upcoming', 'schedule']
  };

  const extractTextFromHtml = (html) => {
    const cleanHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                         .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    const div = document.createElement('div');
    div.innerHTML = cleanHtml;
    return div.textContent || div.innerText || '';
  };

  const findInformation = (text, keywords) => {
    const results = [];
    const sentences = text.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase();
      keywords.forEach(keyword => {
        if (lowerSentence.includes(keyword.toLowerCase())) {
          const trimmedSentence = sentence.trim();
          if (trimmedSentence && trimmedSentence.length > 10 && !results.includes(trimmedSentence)) {
            // Clean up the sentence
            const cleanSentence = trimmedSentence
              .replace(/^\s*[-•*]\s*/, '') // Remove bullet points
              .replace(/\s+/g, ' ') // Normalize whitespace
              .trim();
            
            if (cleanSentence.length > 15) { // Only include substantial sentences
              results.push(cleanSentence);
            }
          }
        }
      });
    });
    
    // Sort by relevance (sentences with multiple keywords first)
    results.sort((a, b) => {
      const aMatches = keywords.filter(keyword => a.toLowerCase().includes(keyword.toLowerCase())).length;
      const bMatches = keywords.filter(keyword => b.toLowerCase().includes(keyword.toLowerCase())).length;
      return bMatches - aMatches;
    });
    
    return results.slice(0, 5); // Return top 5 most relevant
  };

  const extractCourseInfo = (html, url) => {
    const text = extractTextFromHtml(html);
    
    // Extract title from HTML
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Course Information';
    
    // Extract meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const description = descMatch ? descMatch[1] : '';

    // Extract structured data (JSON-LD)
    const jsonLdMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([^<]+)<\/script>/gi) || [];
    let structuredData = {};
    
    jsonLdMatches.forEach(match => {
      try {
        const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
        const data = JSON.parse(jsonContent);
        if (data['@type'] === 'Course' || data['@type'] === 'EducationalOccupationalProgram') {
          structuredData = data;
        }
      } catch (e) {
        // Ignore invalid JSON
      }
    });

    // Find links in the HTML that might contain more information
    const linkMatches = html.match(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi) || [];
    const relevantLinks = linkMatches
      .map(link => {
        const hrefMatch = link.match(/href=["']([^"']+)["']/i);
        const textMatch = link.match(/>([^<]+)</);
        return {
          url: hrefMatch ? hrefMatch[1] : '',
          text: textMatch ? textMatch[1].trim() : ''
        };
      })
      .filter(link => {
        const linkText = link.text.toLowerCase();
        return linkText.includes('admission') || 
               linkText.includes('application') || 
               linkText.includes('fee') || 
               linkText.includes('tuition') ||
               linkText.includes('requirement') ||
               linkText.includes('deadline') ||
               linkText.includes('apply') ||
               linkText.includes('enroll');
      })
      .slice(0, 8);

    return {
      title,
      description,
      url,
      extractedAt: new Date().toISOString(),
      fees: findInformation(text, keywords.fees),
      deadlines: findInformation(text, keywords.deadlines),
      duration: findInformation(text, keywords.duration),
      requirements: findInformation(text, keywords.requirements),
      location: findInformation(text, keywords.location),
      credits: findInformation(text, keywords.credits),
      startDates: findInformation(text, keywords.start),
      relevantLinks,
      structuredData
    };
  };

  const fetchCourseData = async () => {
    if (!url) {
      setError('Please enter a valid URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL (must include http:// or https://)');
      return;
    }

    setLoading(true);
    setError('');
    setCourseData(null);

    try {
      const response = await fetch('/api/extract-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCourseData(data);
    } catch (err) {
      console.error('Extraction error:', err);
      setError(`Failed to extract course information: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text');
    }
  };

  const exportData = () => {
    if (!courseData) return;
    
    const dataStr = JSON.stringify(courseData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `course-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const InfoSection = ({ title, items, icon: Icon, color }) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-5 h-5 ${color}`} />
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border-l-4 border-l-blue-200">
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Course Information Extractor</h1>
                <p className="text-sm text-gray-600">Extract comprehensive course details from any educational website</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Globe className="w-4 h-4" />
              <span>Production Environment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Course Page URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/course-page"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={fetchCourseData}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Extract Course Info
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sample URLs */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Try these sample URLs:</p>
              <div className="flex flex-wrap gap-2">
                {sampleUrls.map((sampleUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setUrl(sampleUrl)}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                  >
                    Sample {index + 1}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">Extracting Course Information</h3>
                <p className="text-gray-600">Analyzing the webpage and extracting relevant details...</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {courseData && (
          <div className="space-y-6">
            {/* Course Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{courseData.title}</h2>
                  {courseData.description && (
                    <p className="text-gray-600 mb-3 text-lg">{courseData.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ExternalLink className="w-4 h-4" />
                    <a href={courseData.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                      {courseData.url}
                    </a>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(courseData, null, 2))}
                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy JSON'}
                  </button>
                  <button
                    onClick={exportData}
                    className="px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400 border-t pt-3">
                <span>Extracted: {new Date(courseData.extractedAt).toLocaleString()}</span>
                <span>•</span>
                <span>Data points: {Object.values(courseData).flat().length}</span>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <InfoSection
                title="Tuition & Fees"
                items={courseData.fees}
                icon={DollarSign}
                color="text-green-600"
              />
              
              <InfoSection
                title="Application Deadlines"
                items={courseData.deadlines}
                icon={Calendar}
                color="text-red-600"
              />
              
              <InfoSection
                title="Program Duration"
                items={courseData.duration}
                icon={Clock}
                color="text-blue-600"
              />
              
              <InfoSection
                title="Requirements"
                items={courseData.requirements}
                icon={Award}
                color="text-purple-600"
              />
              
              <InfoSection
                title="Location & Format"
                items={courseData.location}
                icon={MapPin}
                color="text-orange-600"
              />
              
              <InfoSection
                title="Credits & Units"
                items={courseData.credits}
                icon={Users}
                color="text-indigo-600"
              />
            </div>

            {/* Start Dates */}
            <InfoSection
              title="Start Dates & Sessions"
              items={courseData.startDates}
              icon={Calendar}
              color="text-teal-600"
            />

            {/* Relevant Links */}
            {courseData.relevantLinks && courseData.relevantLinks.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-gray-600" />
                  Additional Resources
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {courseData.relevantLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 text-sm text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        {link.text}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* API Setup Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Info className="w-5 h-5" />
                <span className="font-medium">API Integration</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                This component now uses real web scraping. Make sure to implement the <code className="bg-blue-100 px-1 rounded">/api/extract-course</code> endpoint for live data extraction.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseExtractor;