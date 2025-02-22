// app/apply/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Study in Italy',
    default: 'Study in Italy Application',
  },
  description: 'Apply to study in Italy with our professional guidance service.',
};

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* You can add any layout elements here that should wrap all pages in the apply section */}
      {children}
    </>
  );
}