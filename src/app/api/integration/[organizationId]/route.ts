import { NextResponse } from 'next/server';

import { API_BASE_URL } from '@/constant';
import { APIException, APIExceptionCode } from '@/exception/APIException';

export async function GET(
  req: Request,
  { params }: { params: { organizationId: string } }
) {
  const { token } = await req.json();
  const organizationId = params.organizationId;

  try {
    const response = await fetch(
      `${API_BASE_URL}/integration/${organizationId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
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

export async function DELETE(
  req: Request,
  { params }: { params: { organizationId: string } }
) {
  const { token, accountToken, organizationAdminId } = await req.json();
  const organizationId = params.organizationId;

  try {
    const response = await fetch(
      `${API_BASE_URL}/integration/${organizationId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'integration-account-token': accountToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization_admin_id: organizationAdminId,
        }),
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
