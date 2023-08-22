import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { API_BASE_URL } from '@/constant';
import { APIException, APIExceptionCode } from '@/exception/APIException';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = headers().get('Authorization');
  try {
    if (!auth) {
      throw new Error(`Missing authorization header`);
    }
    const userId = params.id;

    const response = await fetch(`${API_BASE_URL}/user/${userId}/invitation`, {
      method: 'GET',
      headers: {
        Authorization: auth,
      },
    });

    const data = await response.json();
    const whitelistUser = data.whitelist_user;

    if (!response.ok) {
      console.log('Error from API side: ' + response.statusText);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(whitelistUser);
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
