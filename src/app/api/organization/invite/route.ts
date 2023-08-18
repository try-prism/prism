import { NextResponse } from 'next/server';

import { API_BASE_URL } from '@/constant';
import { APIException, APIExceptionCode } from '@/exception/APIException';

export function GET(req: Request) {
  return new Response('/organization/invite endpoint is working!', {
    status: 200,
  });
}

export async function POST(req: Request) {
  const {
    token,
    organizationId,
    organizationName,
    organizationUserEmail,
    organizationAdminId,
  } = await req.json();

  try {
    const response = await fetch(
      `${API_BASE_URL}/organization/${organizationId}/invite`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization_name: organizationName,
          organization_user_email: organizationUserEmail,
          organization_admin_id: organizationAdminId,
        }),
      }
    );

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
  const {
    token,
    organizationId,
    organizationName,
    organizationUserId,
    organizationAdminId,
  } = await req.json();

  try {
    const response = await fetch(
      `${API_BASE_URL}/organization/${organizationId}/invite`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization_name: organizationName,
          organization_user_id: organizationUserId,
          organization_admin_id: organizationAdminId,
        }),
      }
    );

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
