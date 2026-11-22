/** Pilihan bahan dan aktivitas di layar Target & preferensi (Figma 2). */
export const INGREDIENT_OPTIONS = [
  'Tempe',
  'Tahu',
  'Telur',
  'Bayam',
  'Ayam',
  'Ikan kembung',
  'Kangkung',
] as const;

export const ACTIVITY_OPTIONS = ['Jalan kaki', 'Bersepeda', 'Lari', 'Senam'] as const;

/** Akun demo yang tampil di layar masuk. Belum ada backend: kredensial tidak diverifikasi. */
export const DEMO_ACCOUNT = { email: 'demo@fullyfilled.app', password: 'Demo1234' } as const;
