import { NextResponse } from 'next/server';

import { API_BASE_URL } from '@/constant';
import { APIException, APIExceptionCode } from '@/exception/APIException';

export function GET(req: Request) {
  return new Response('/integration endpoint is working!', {
    status: 200,
  });
}

export async function POST(req: Request) {
  const { token, publicToken, organizationId, organizationName } =
    await req.json();

  try {
    const response = await fetch(`${API_BASE_URL}/integration`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_token: publicToken,
        organization_id: organizationId,
        organization_name: organizationName,
      }),
    });

    if (!response.ok) {
      console.log('Error from API side: ' + response.statusText);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error retrieving API response: ' + error);

    return NextResponse.json(
      new APIException(
        APIExceptionCode.UNKNOWN_ERROR,
        error instanceof Error ? error.message : 'Unknown Error'
      ).toJSON()
    );
  }
}
