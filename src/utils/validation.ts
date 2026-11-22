export const MIN_PASSWORD_LENGTH = 8;
export const MIN_WEIGHT_KG = 30;
export const MAX_WEIGHT_KG = 300;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type LoginErrors = { email?: string; password?: string };

/** Validasi form masuk. Pesan mengikuti layar error Figma (0b). */
export function validateLogin(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};

  if (email.trim() === '') {
    errors.email = 'Isi email dulu ya.';
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Format email belum lengkap, contoh: nama@email.com';
  }

  if (password === '') {
    errors.password = 'Isi kata sandi dulu ya.';
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Minimal ${MIN_PASSWORD_LENGTH} karakter. Sekarang baru ${password.length}.`;
  }

  return errors;
}

/** "kenneth@email.com" -> "Kenneth"; "demo.user@x.id" -> "Demo". */
export function displayNameFromEmail(email: string): string {
  const local = email.trim().split('@')[0] ?? '';
  const first = local.split(/[._-]/)[0] ?? '';
  if (first === '') return 'Teman';
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

/** Mengubah "68,5" atau "68.5" menjadi angka; null jika bukan berat yang masuk akal. */
export function parseWeight(input: string): number | null {
  const value = Number.parseFloat(input.trim().replace(',', '.'));
  if (!Number.isFinite(value)) return null;
  if (value < MIN_WEIGHT_KG || value > MAX_WEIGHT_KG) return null;
  return Math.round(value * 10) / 10;
}
