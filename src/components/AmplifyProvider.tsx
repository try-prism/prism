'use client';
import { Amplify } from 'aws-amplify';
import React from 'react';

import awsExports from '@/aws-exports';

Amplify.configure({
  Auth: {
    region: awsExports.aws_cognito_region,
    userPoolId: awsExports.aws_user_pools_id,
    userPoolWebClientId: awsExports.aws_user_pools_web_client_id,
  },
});

export default function AmplifyProvider({ children }: React.PropsWithChildren) {
  return <React.Fragment>{children}</React.Fragment>;
}
