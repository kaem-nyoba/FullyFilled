# FullyFilled

Aplikasi mobile yang membantu kamu mencapai target berat badan dengan cara yang santai: pilih bahan
yang ada, dapat ide makan, dan cari tempat gerak di sekitar. Ditemani maskot beagle bernama **Nyam**.

Dibangun dengan Expo (React Native), Expo Router, dan TypeScript. Desain ada di Figma
(`FullyFilled v2 – Ceria`).

## Memulai

```bash
npm install
npm start          # lalu scan QR dengan Expo Go, atau tekan a / i / w
```

Akun demo di layar masuk: `demo@fullyfilled.app` / `Demo1234`.

## Skrip

- `npm start`: jalankan server pengembangan
- `npm run web`: buka di browser
- `npm run android` / `npm run ios`: buka di emulator

## Struktur

```
src/
  app/            Rute Expo Router (satu file = satu layar)
  components/     Komponen UI dan Nyam
  constants/      Design token (warna, font, spacing)
  data/           Data statis: resep dan tempat (mock)
  services/       Akses data (rute, dll.)
  state/          State global dan penyimpanan lokal
  utils/          Fungsi murni yang mudah diuji
assets/
  nyam/           Pose maskot (SVG dari Figma)
docs/             Dokumentasi, termasuk spesifikasi animasi Nyam
```

## Animasi Nyam

State dan trigger animasi maskot ada di [docs/nyam-animation.md](docs/nyam-animation.md). Saat ini
Nyam dirender dengan animasi Reanimated dari pose SVG. Renderer Rive bisa dipasang kemudian tanpa
mengubah layar manapun.

## Yang masih tiruan (mock)

Belum ada backend, jadi beberapa bagian sengaja berupa data contoh:

- **Masuk**: kredensial tidak diverifikasi. Email dan kata sandi yang valid langsung masuk; akun demo
  tinggal diketuk untuk mengisi form. Sesi dan target disimpan lokal (AsyncStorage).
- **Tempat dan rute**: `src/data/places.ts` dan `src/services/route-service.ts`. Rute ke
  `Klinik Sehat Citarum` sengaja selalu gagal supaya layar "rute gagal" bisa dicoba.
- **Ide makan**: katalog statis di `src/data/recipes.ts`, diurutkan menurut bahan yang kamu punya.
- **Placeholder**: "Daftar", "Lupa kata sandi?", "Ubah lokasi", dan "Mulai jalan" menampilkan
  pemberitahuan singkat karena fiturnya belum dibuat.

## Pratinjau web

`npm run web` membuka aplikasi di browser. Gunakan lebar sekitar 390 px agar sesuai desain.
