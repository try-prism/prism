import Image from 'next/image';

import PrismLogo from '@/images/prism.svg';

export function Logo() {
  return <Image className="mx-auto h-10 w-auto" src={PrismLogo} alt="" />;
}
