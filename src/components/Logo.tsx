import Image from 'next/image';

import PrismLogo from '@/images/prism/prism.svg';
import PrismBlackLogo from '@/images/prism/prism_black.svg';

interface LogoProperties {
  isBlack?: boolean;
}

export function Logo({ isBlack }: LogoProperties) {
  if (isBlack) {
    return (
      <Image className="mx-auto h-14 w-auto" src={PrismBlackLogo} alt="" />
    );
  }
  return <Image className="mx-auto h-10 w-auto" src={PrismLogo} alt="" />;
}
