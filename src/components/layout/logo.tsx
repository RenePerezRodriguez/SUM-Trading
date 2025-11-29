import { cn } from '@/lib/utils';
import Image from 'next/image';

export const Logo = ({
  className
}: {
  className?: string;
}) => (
  <div className={cn('relative', className)}>
    <Image
      src="/images/logo_sum_trading.webp"
      alt="SUM Trading Logo"
      fill
      sizes="(max-width: 768px) 32px, 40px"
      className='object-contain'
    />
  </div>
);
