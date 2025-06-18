// app/api/extract-course/route.js
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    let validUrl;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 30000, // 30 seconds timeout
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch webpage: HTTP ${response.status}` },
        { status: 400 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract course information
    const courseInfo = extractCourseInfo($, html, url);

    return NextResponse.json(courseInfo);

  } catch (error) {
    console.error('Course extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract course information' },
      { status: 500 }
    );
  }
}

function extractCourseInfo($, html, url) {
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

  // Extract basic metadata
  const title = $('title').text().trim() || 
                $('h1').first().text().trim() || 
                'Course Information';

  const description = $('meta[name="description"]').attr('content') || 
                     $('meta[property="og:description"]').attr('content') || 
                     $('p').first().text().trim() || '';

  // Get all text content
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

  // Extract structured data (JSON-LD)
  let structuredData = {};
  $('script[type="application/ld+json"]').each((i, elem) => {
    try {
      const data = JSON.parse($(elem).html());
      if (data['@type'] === 'Course' || 
          data['@type'] === 'EducationalOccupationalProgram' ||
          data['@type'] === 'Event') {
        structuredData = data;
      }
    } catch (e) {
      // Ignore invalid JSON
    }
  });

  // Find relevant links
  const relevantLinks = [];
  $('a[href]').each((i, elem) => {
    const linkText = $(elem).text().trim().toLowerCase();
    const href = $(elem).attr('href');
    
    if (href && (
      linkText.includes('admission') || 
      linkText.includes('application') || 
      linkText.includes('apply') ||
      linkText.includes('enroll') ||
      linkText.includes('fee') || 
      linkText.includes('tuition') ||
      linkText.includes('requirement') ||
      linkText.includes('deadline') ||
      linkText.includes('curriculum') ||
      linkText.includes('syllabus')
    )) {
      const fullUrl = href.startsWith('http') ? href : new URL(href, url).href;
      relevantLinks.push({
        url: fullUrl,
        text: $(elem).text().trim()
      });
    }
  });

  // Extract information by category
  function findInformation(text, keywords) {
    const results = [];
    const sentences = text.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase();
      keywords.forEach(keyword => {
        if (lowerSentence.includes(keyword.toLowerCase())) {
          const trimmedSentence = sentence.trim();
          if (trimmedSentence && trimmedSentence.length > 15 && !results.includes(trimmedSentence)) {
            // Clean up the sentence
            const cleanSentence = trimmedSentence
              .replace(/^\s*[-•*]\s*/, '') // Remove bullet points
              .replace(/\s+/g, ' ') // Normalize whitespace
              .trim();
            
            if (cleanSentence.length > 20) { // Only include substantial sentences
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
  }

  // Extract specific course details from structured areas
  const courseDetails = extractSpecificDetails($);

  return {
    title: title.substring(0, 200), // Limit title length
    description: description.substring(0, 500), // Limit description length
    url,
    extractedAt: new Date().toISOString(),
    fees: findInformation(bodyText, keywords.fees).concat(courseDetails.fees),
    deadlines: findInformation(bodyText, keywords.deadlines).concat(courseDetails.deadlines),
    duration: findInformation(bodyText, keywords.duration).concat(courseDetails.duration),
    requirements: findInformation(bodyText, keywords.requirements).concat(courseDetails.requirements),
    location: findInformation(bodyText, keywords.location).concat(courseDetails.location),
    credits: findInformation(bodyText, keywords.credits).concat(courseDetails.credits),
    startDates: findInformation(bodyText, keywords.start).concat(courseDetails.startDates),
    relevantLinks: relevantLinks.slice(0, 8), // Limit to 8 most relevant links
    structuredData
  };
}

function extractSpecificDetails($) {
  const details = {
    fees: [],
    deadlines: [],
    duration: [],
    requirements: [],
    location: [],
    credits: [],
    startDates: []
  };

  // Look for common class names and IDs that might contain course info
  const selectors = [
    '.price', '.cost', '.fee', '.tuition',
    '.deadline', '.date', '.apply',
    '.duration', '.length', '.time',
    '.requirement', '.prerequisite',
    '.location', '.campus',
    '.credit', '.unit',
    '.start', '.begin'
  ];

  selectors.forEach(selector => {
    $(selector).each((i, elem) => {
      const text = $(elem).text().trim();
      if (text.length > 10 && text.length < 200) {
        // Categorize based on selector and content
        if (selector.includes('price') || selector.includes('cost') || selector.includes('fee') || selector.includes('tuition')) {
          details.fees.push(text);
        } else if (selector.includes('deadline') || selector.includes('date') || selector.includes('apply')) {
          details.deadlines.push(text);
        } else if (selector.includes('duration') || selector.includes('length') || selector.includes('time')) {
          details.duration.push(text);
        } else if (selector.includes('requirement') || selector.includes('prerequisite')) {
          details.requirements.push(text);
        } else if (selector.includes('location') || selector.includes('campus')) {
          details.location.push(text);
        } else if (selector.includes('credit') || selector.includes('unit')) {
          details.credits.push(text);
        } else if (selector.includes('start') || selector.includes('begin')) {
          details.startDates.push(text);
        }
      }
    });
  });

  // Remove duplicates and limit results
  Object.keys(details).forEach(key => {
    details[key] = [...new Set(details[key])].slice(0, 3);
  });

  return details;
}