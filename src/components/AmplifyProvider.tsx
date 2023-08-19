'use client';
import { Amplify } from 'aws-amplify';

import awsExports from '@/aws-exports';

Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID,
  },
});

export default function AmplifyProvider({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}
