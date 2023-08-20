import Image from 'next/image';

import BoxLogo from '@/images/integrations/full/box-full.png';
import DropboxLogo from '@/images/integrations/full/dropbox-full.png';
import GoogleDriveLogo from '@/images/integrations/full/gdrive-full.png';
import OneDriveLogo from '@/images/integrations/full/onedrive-full.png';
import SharePointLogo from '@/images/integrations/full/sharepoint-full.png';

export default function LogoCloud() {
  return (
    <div className="bg-white pb-24">
      <ul className="flex items-center justify-center gap-x-8 sm:flex-col sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0 mx-auto max-w-7xl">
        {[
          [
            { name: 'Google Drive', logo: GoogleDriveLogo },
            { name: 'Box', logo: BoxLogo },
            { name: 'Dropbox', logo: DropboxLogo },
          ],
          [
            { name: 'OneDrive', logo: OneDriveLogo },
            { name: 'Sharepoint', logo: SharePointLogo },
          ],
        ].map((group, groupIndex) => (
          <li key={groupIndex}>
            <ul className="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0">
              {group.map(company => (
                <li key={company.name} className="flex">
                  <Image src={company.logo} alt={company.name} unoptimized />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
