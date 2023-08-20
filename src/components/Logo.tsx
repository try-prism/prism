import Image from 'next/image';

import PrismLogo from '@/images/prism.svg';
import PrismBlackLogo from '@/images/prism_black.svg';

interface LogoProps {
  isBlack?: boolean;
}

export function Logo({ isBlack }: LogoProps) {
  if (isBlack) {
    return (
      <Image className="mx-auto h-10 w-auto" src={PrismBlackLogo} alt="" />
    );
  }
  return <Image className="mx-auto h-10 w-auto" src={PrismLogo} alt="" />;
}
