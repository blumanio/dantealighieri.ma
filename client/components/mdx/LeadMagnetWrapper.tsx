// components/mdx/LeadMagnetWrapper.tsx
import DynamicLeadMagnet from '@/components/blog/DynamicLeadMagnet';

type Props = {
  type?: any;
  variant?: 'sidebar' | 'inline';
  className?: string;
};

export default function LeadMagnetWrapper(props: Props) {
  return <DynamicLeadMagnet {...props} />;
}