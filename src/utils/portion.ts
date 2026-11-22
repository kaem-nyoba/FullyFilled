/** "1 porsi (250 g)" -> "1 porsi · 250 g" untuk kartu menu; teks lain dikembalikan apa adanya. */
export function shortPortion(portion: string): string {
  const match = /^(.*?)\s*\((.*)\)$/.exec(portion);
  return match ? `${match[1]} · ${match[2]}` : portion;
}
