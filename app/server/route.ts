import { createTicket } from '@/storage/storageServerTicket';

export async function POST(request: Request) {
  const data = await request.json();
  createTicket(data);
  return Response.json({ status: 200 });
}
