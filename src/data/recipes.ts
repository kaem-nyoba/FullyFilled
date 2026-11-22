export type RecipeItem = {
  name: string;
  amount: string;
};

export type Recipe = {
  id: string;
  name: string;
  kcal: number;
  portion: string;
  proteinG: number;
  carbsG: number;
  fatG: number;
  items: readonly RecipeItem[];
};

/** Katalog contoh. Bahan di `items` dianggap bahan utama. */
export const RECIPES: readonly Recipe[] = [
  {
    id: 'tumis-tempe-bayam',
    name: 'Tumis tempe bayam',
    kcal: 380,
    portion: '1 porsi (250 g)',
    proteinG: 22,
    carbsG: 30,
    fatG: 18,
    items: [
      { name: 'Tempe', amount: '100 g' },
      { name: 'Bayam', amount: '1 ikat' },
      { name: 'Bawang putih', amount: '2 siung' },
    ],
  },
  {
    id: 'telur-dadar-sayur',
    name: 'Telur dadar sayur',
    kcal: 290,
    portion: '1 porsi (180 g)',
    proteinG: 17,
    carbsG: 9,
    fatG: 20,
    items: [
      { name: 'Telur', amount: '2 butir' },
      { name: 'Bayam', amount: '½ ikat' },
    ],
  },
  {
    id: 'pepes-tahu-kemangi',
    name: 'Pepes tahu kemangi',
    kcal: 240,
    portion: '1 porsi (200 g)',
    proteinG: 18,
    carbsG: 12,
    fatG: 14,
    items: [
      { name: 'Tahu', amount: '150 g' },
      { name: 'Kemangi', amount: '1 ikat' },
      { name: 'Bawang putih', amount: '2 siung' },
    ],
  },
  {
    id: 'orak-arik-tempe',
    name: 'Orak-arik tempe telur',
    kcal: 340,
    portion: '1 porsi (220 g)',
    proteinG: 24,
    carbsG: 16,
    fatG: 19,
    items: [
      { name: 'Tempe', amount: '80 g' },
      { name: 'Telur', amount: '2 butir' },
      { name: 'Bawang merah', amount: '2 siung' },
    ],
  },
  {
    id: 'pepes-ikan-kembung',
    name: 'Pepes ikan kembung',
    kcal: 310,
    portion: '1 porsi (230 g)',
    proteinG: 29,
    carbsG: 6,
    fatG: 19,
    items: [
      { name: 'Ikan kembung', amount: '1 ekor' },
      { name: 'Kemangi', amount: '1 ikat' },
    ],
  },
  {
    id: 'tumis-kangkung-tahu',
    name: 'Tumis kangkung tahu',
    kcal: 260,
    portion: '1 porsi (240 g)',
    proteinG: 15,
    carbsG: 14,
    fatG: 15,
    items: [
      { name: 'Kangkung', amount: '1 ikat' },
      { name: 'Tahu', amount: '100 g' },
      { name: 'Bawang putih', amount: '2 siung' },
    ],
  },
  {
    id: 'ayam-panggang-bayam',
    name: 'Ayam panggang dan bayam rebus',
    kcal: 360,
    portion: '1 porsi (260 g)',
    proteinG: 34,
    carbsG: 10,
    fatG: 19,
    items: [
      { name: 'Ayam', amount: '120 g' },
      { name: 'Bayam', amount: '1 ikat' },
    ],
  },
];
