import { NextResponse } from 'next/server';

import { API_BASE_URL } from '@/constant';
import { APIException, APIExceptionCode } from '@/exception/APIException';

export function GET(req: Request) {
  return new Response('/user endpoint is working!', {
    status: 200,
  });
}

export async function POST(req: Request) {
  const { token, userId } = await req.json();

  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export async function DELETE(req: Request) {
  const { token, userId, organizationAdminId } = await req.json();

  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'org-admin-id': organizationAdminId,
      },
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