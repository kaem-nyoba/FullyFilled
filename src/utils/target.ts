const round1 = (value: number) => Math.round(value * 10) / 10;

/** 68.5 -> "68,5" (format desimal Indonesia). */
export function formatNumber(value: number): string {
  return String(round1(value)).replace('.', ',');
}

export function formatKg(value: number): string {
  return `${formatNumber(value)} kg`;
}

/** Catatan di bawah isian berat (Figma 2): menyebut selisih dengan nada santai. */
export function changeSummary(currentKg: number, goalKg: number): string {
  const diff = round1(Math.abs(currentKg - goalKg));
  if (diff === 0) return 'Berat sekarang sudah sama dengan target. Tinggal dijaga ya.';
  const verb = goalKg < currentKg ? 'Turun' : 'Naik';
  return `${verb} ${formatNumber(diff)} kg. Pelan tapi konsisten lebih gampang dijaga.`;
}

/** Catatan semangat di kartu target Beranda (Figma 1b). */
export function paceNote(currentKg: number, goalKg: number): string {
  if (round1(currentKg) === round1(goalKg)) {
    return 'Berat kamu sudah pas di target. Tinggal dijaga ya.';
  }
  const verb = goalKg < currentKg ? 'Turun' : 'Naik';
  return `Pelan-pelan aja. ${verb} 0,5 kg per minggu itu sudah keren.`;
}

export function ingredientsLine(ingredients: readonly string[]): string {
  if (ingredients.length === 0) return 'Belum ada bahan dipilih';
  return `Bahanmu: ${ingredients.map((item) => item.toLowerCase()).join(', ')}`;
}
