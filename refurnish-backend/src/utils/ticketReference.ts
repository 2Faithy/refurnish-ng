export function formatTicketReference(id: string) {
  return `RF-SUP-${id.slice(0, 8).toUpperCase()}`;
}