import { getAllTicket } from '@/storage/storageServerTicket';

export async function GET() {
  return Response.json({ data: getAllTicket() });
}
