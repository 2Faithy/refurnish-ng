export function formatOrderReference(seq: number): string {
  return `RF-${String(seq).padStart(6, "0")}`;
}