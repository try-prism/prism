import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { API_BASE_URL } from '@/constant';
import { APIException, APIExceptionCode } from '@/exception/APIException';

export async function GET(
  request: Request,
  { params }: { params: { organizationId: string } }
) {
  const auth = headers().get('Authorization');
  const organizationId = params.organizationId;

  try {
    if (!auth) {
      throw new Error(`Missing authorization header`);
    }

    const response = await fetch(
      `${API_BASE_URL}/integration/${organizationId}/generate`,
      {
        method: 'GET',
        headers: {
          Authorization: auth,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log('Error from API side: ' + response.statusText);
      return NextResponse.json(data, { status: response.status });
    }

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
