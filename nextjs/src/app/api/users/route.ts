import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MOCK_USERS, UserItem } from '../../../lib/users';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const sortBy = searchParams.get('sortBy') || 'id';
  const order = searchParams.get('order') || 'asc';
  const search = searchParams.get('search') || '';

  let users = [...MOCK_USERS];

  if (search) {
    const term = search.toLowerCase();
    users = users.filter(
      u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
  }

  users.sort((a, b) => {
    let aVal = a[sortBy as keyof UserItem];
    let bVal = b[sortBy as keyof UserItem];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const total = users.length;
  const start = (page - 1) * limit;
  const paginatedUsers = users.slice(start, start + limit);

  return NextResponse.json({
    users: paginatedUsers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}
