# FullyFilled

Aplikasi mobile yang membantu kamu mencapai target berat badan dengan cara yang santai: pilih bahan
yang ada, dapat ide makan, dan cari tempat gerak di sekitar. Ditemani maskot beagle bernama **Nyam**.

Dibangun dengan Expo (React Native), Expo Router, dan TypeScript. Desain ada di Figma
(`FullyFilled v2 – Ceria`).

## Memulai

Prasyarat:

- Node.js 20 LTS atau lebih baru (dikembangkan dengan Node 24) dan npm.
- Aplikasi **Expo Go** versi terbaru di HP (Android/iOS), atau emulator Android, atau browser.
- API key core service untuk fitur rute. Tanpa kunci, aplikasi tetap jalan, tetapi layar rute
  menampilkan pesan gagal.

```bash
npm install
# buat file .env.local berisi API key core service (minta ke kelompok inggrisbng2):
#   EXPO_PUBLIC_FULLYFILLED_API_KEY=<kunci>
npx expo start -c  # lalu scan QR dengan Expo Go, atau tekan a / i / w
```

Akun demo di layar masuk: `demo@fullyfilled.app` / `Demo1234`.

### Cara mencoba

1. Di layar **Masuk**, ketuk akun demo (form terisi otomatis), lalu **Masuk**.
2. Isi **target** berat badan dan preferensi, lalu simpan.
3. Buka **Ide makan** untuk melihat rekomendasi dari bahan yang dipilih.
4. Buka **Tempat di sekitar**, pilih **Taman Lansia**: layar rute menampilkan jarak, durasi, dan
   estimasi kalori yang dihitung core service (`POST /walk-plans/estimate`).
5. Pilih **Klinik Sehat Citarum** untuk melihat tampilan saat rute gagal.

## Backend dan API

Repositori ini monorepo. Backend (core service) ada di folder [`backend/`](backend/README.md) dan
berjalan di `https://inggrisbng2.stei.site/api`. Kontrak API: [`backend/openapi.yaml`](backend/openapi.yaml).

Semua panggilan API dari aplikasi lewat [`src/services/ApiService.ts`](src/services/ApiService.ts):

| Fungsi | Endpoint | Dipakai di |
|---|---|---|
| `ApiService.health()` | `GET /health` | Cek koneksi ke server |
| `ApiService.estimateWalk()` | `POST /walk-plans/estimate` | Layar rute: jarak, durasi, dan kalori dari API |

`ApiService` menangani timeout 10 detik, internet mati, dan error dari server, lalu mengubahnya
menjadi pesan yang aman ditampilkan, sehingga aplikasi tidak crash. API key dibaca dari
`.env.local` (tidak di-commit). Ini sementara sampai login JWT selesai.

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

Endpoint backend untuk login dan data pengguna masih dikembangkan, jadi beberapa bagian sengaja
berupa data contoh:

- **Masuk**: kredensial tidak diverifikasi. Email dan kata sandi yang valid langsung masuk; akun demo
  tinggal diketuk untuk mengisi form. Sesi dan target disimpan lokal (AsyncStorage).
- **Tempat**: `src/data/places.ts` (nama dan koordinat perkiraan). Nanti diganti API Maps kelompok
  Salma. Lokasi pengguna sementara tetap di sekitar Cihapit.
- **Rute**: jarak, durasi, dan kalori sudah **dari API sungguhan** (`src/services/route-service.ts`).
  Teks langkah belok masih contoh. Rute ke `Klinik Sehat Citarum` sengaja selalu gagal supaya layar
  "rute gagal" bisa dicoba.
- **Info gizi**: nanti dari API kelompok Dani.
- **Ide makan**: katalog statis di `src/data/recipes.ts`, diurutkan menurut bahan yang kamu punya.
- **Placeholder**: "Daftar", "Lupa kata sandi?", "Ubah lokasi", dan "Mulai jalan" menampilkan
  pemberitahuan singkat karena fiturnya belum dibuat.

## Pratinjau web

`npm run web` membuka aplikasi di browser. Gunakan lebar sekitar 390 px agar sesuai desain.
