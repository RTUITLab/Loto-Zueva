import { Ticket } from '@/utils/generator';

const tickets: Ticket[] = [];

export function createTicket(ticketsAll: Ticket[]) {
  tickets.length = 0;
  ticketsAll.forEach((ticket) => {
    tickets.push(ticket);
  });
}

export function getTicket(ticketId: number) {
  return tickets[ticketId];
}

export function getAllTicket() {
  return tickets;
}

export function lengthTicket() {
  return tickets.length;
}
