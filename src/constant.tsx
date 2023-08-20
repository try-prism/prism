import { StaticImageData } from 'next/image';

import BoxLogo from '@/images/integrations/storage/box.png';
import DropboxLogo from '@/images/integrations/storage/dropbox.png';
import GoogleDriveLogo from '@/images/integrations/storage/googledrive.png';
import OneDriveLogo from '@/images/integrations/storage/onedrive.png';
import ShareDriveLogo from '@/images/integrations/storage/sharedrive.png';
import ConfluenceLogo from '@/images/integrations/workspace/confluence.png';
import NotionLogo from '@/images/integrations/workspace/notion.png';

export const API_BASE_DOMAIN = '127.0.0.1:8000/v1';
export const API_BASE_URL = 'http://127.0.0.1:8000/v1';

export const TEST_TOKEN = 'test-token';
export const TEST_ORG_ID = 'p_4fc4bae9_eddb_4950_b2b9_c7074e2678c1';
export const TEST_ADMIN_ID = '0b0bba07-e34b-4fe4-9e2b-d9a2f8533968';

interface IntegrationLogos {
  [key: string]: StaticImageData;
}

export const INTEGRATION_LOGO_MAPPINGS: IntegrationLogos = {
  'google-drive': GoogleDriveLogo,
  box: BoxLogo,
  dropbox: DropboxLogo,
  onedrive: OneDriveLogo,
  sharedrive: ShareDriveLogo,
  confluence: ConfluenceLogo,
  notion: NotionLogo,
};
