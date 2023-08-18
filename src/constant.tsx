import { StaticImageData } from 'next/image';

import BoxLogo from '@/images/integrations/storage/box.png';
import DropboxLogo from '@/images/integrations/storage/dropbox.png';
import GoogleDriveLogo from '@/images/integrations/storage/googledrive.png';
import OneDriveLogo from '@/images/integrations/storage/onedrive.png';
import ShareDriveLogo from '@/images/integrations/storage/sharedrive.png';
import ConfluenceLogo from '@/images/integrations/workspace/confluence.png';
import NotionLogo from '@/images/integrations/workspace/notion.png';

export const API_BASE_DOMAIN = '127.0.0.1:8000';
export const API_BASE_URL = 'http://127.0.0.1:8000/v1';

export const TEST_TOKEN = 'test-token';
export const TEST_ORG_ID = 'e5bd43fc-44f6-456a-be57-50f4ab33a019';
export const TEST_ADMIN_ID = 'hwuiwon@tryprism.ai';

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
