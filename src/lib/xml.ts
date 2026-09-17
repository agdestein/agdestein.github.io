/** Escape text and attribute values used in our static XML feeds. */
export function xml(value: string) {
  return value.replace(/[<>&"']/g, c=>({'<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&apos;'}[c]!));
}
