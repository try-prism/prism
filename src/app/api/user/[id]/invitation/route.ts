import { NextResponse } from 'next/server';

import { API_BASE_URL } from '@/constant';
import { APIException, APIExceptionCode } from '@/exception/APIException';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/invitation`, {
      method: 'GET',
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
