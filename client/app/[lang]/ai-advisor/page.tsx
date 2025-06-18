import AIAssistedCourseFinder from '@/components/AIAssistedCourseFinder'; // Adjust path if necessary
import EnhancedAIAssistedCourseFinder from '@/components/EnhancedAIAssistedCourseFinder'; // Adjust path if necessary
export default async function AiAdvisorPage() {
  // const dict = await getDictionary(lang); // Example: For localized page titles or text

  return (
    <main className="py-8">
      {/* You can add a page title or other layout elements here if needed */}
      {/* Example: <h1 className="text-3xl font-bold text-center mb-8">{dict.aiAdvisorPage.title}</h1> */}
      {/* <AIAssistedCourseFinder /> */}
      <EnhancedAIAssistedCourseFinder />
    </main>
  );
}

// Optional: Add metadata for the page
export async function generateMetadata() {
  // const dict = await getDictionary(lang);
  return {
    title: 'AI Course Advisor', // Or use dict.aiAdvisorPage.metaTitle
    description: 'Find your ideal course in Italy with our AI-powered advisor.', // Or use dict.aiAdvisorPage.metaDescription
  };
}
