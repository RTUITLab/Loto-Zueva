import { Ticket } from '@/utils/generator';

let tickets: Ticket[] = [];

export function createTicket(ticketsAll: Ticket[]) {
  tickets = ticketsAll;
}

export function getTicket(ticketId: number) {
  return tickets[ticketId];
}

export function lengthTicket() {
  return tickets.length;
}
