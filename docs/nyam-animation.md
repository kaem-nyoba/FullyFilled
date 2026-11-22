# Animasi Nyam: state dan trigger

Spesifikasi ini menjadi kontrak antara kode aplikasi dan animasi maskot. Implementasinya ada di
`src/components/nyam/`. Pose sumber ada di Figma (frame **Mascot / Nyam**) dan diekspor sebagai SVG
ke `assets/nyam/`.

## State

| State       | Pose Figma      | Sifat                                         | Prioritas |
| ----------- | --------------- | --------------------------------------------- | --------- |
| `idle`      | Idle            | Loop pelan (napas, kedip, kuping)             | P0        |
| `celebrate` | Jump → Land     | Sekali jalan, lalu kembali ke mood sebelumnya | P0        |
| `sad`       | Sad             | Loop pelan                                    | P0        |
| `walk`      | Walk A ↔ Walk B | Loop                                          | P1        |
| `wave`      | Wave A ↔ Wave B | 3 siklus, lalu kembali `idle`                 | P1        |

`celebrate` bukan mood. Ia dipicu terpisah lewat `celebrateKey` supaya bisa diputar ulang kapan pun
tanpa mengubah mood yang sedang berjalan.

## Pemetaan layar

| Layar Figma                    | Ukuran | Props                             | Trigger                                   |
| ------------------------------ | ------ | --------------------------------- | ----------------------------------------- |
| 0a Masuk                       | `sm`   | `mood="wave"`                     | Layar tampil                              |
| 0b Masuk, error validasi       | `sm`   | `mood="idle"`                     | Ada error validasi (nada menyemangati)    |
| 1a Beranda, target kosong      | `lg`   | `mood="wave"`                     | Layar tampil dan belum ada target         |
| 1b Beranda                     | `sm`   | `mood="wave"` sekali, lalu `idle` | Layar tampil (wave singkat habis sendiri) |
| 2b Sheet "Targetmu tersimpan!" | `md`   | `celebrateKey={savedAt}`          | Simpan target berhasil                    |
| 4b Sekitar, hasil kosong       | `md`   | `mood="sad"`                      | Pencarian tidak menemukan tempat          |
| 5a Rute, memuat                | `sm`   | `mood="walk"`                     | Permintaan rute berjalan                  |
| 5c Rute gagal                  | `md`   | `mood="sad"`                      | Layanan rute gagal                        |

Layar 3 (Ide makan), 3b (Detail menu), 4a (Daftar tempat) dan 5b (Rute siap) tidak menampilkan Nyam.

## Pemakaian

```tsx
import { Nyam } from '@/components/nyam';

<Nyam mood="walk" size="sm" />
<Nyam mood="sad" size="md" />
<Nyam celebrateKey={savedAt} size="md" />
```

## Renderer saat ini: placeholder Reanimated

`NyamPlaceholder` menampilkan pose SVG dari Figma dan menggerakkannya dengan Reanimated:

- `idle`: napas (skala Y) dan pantulan kecil, loop.
- `walk`: ganti frame Walk A/B tiap 220 ms plus pantulan dan goyang.
- `wave`: ganti frame Wave A/B tiap 280 ms, 3 siklus.
- `sad`: goyang lambat.
- `celebrate`: lompat, pose Jump saat di udara, pose Land dengan squash saat mendarat.
- Jika pengguna mengaktifkan _reduce motion_, gerak dan pergantian frame dimatikan dan pose statis
  yang tampil.

Ini sengaja sederhana. Tujuannya agar semua layar sudah bisa dibangun dan diuji sambil menunggu
animasi Rive.

## Migrasi ke Rive

Aplikasi ini memakai Expo (React Native), jadi Rive-nya adalah `rive-react-native`, bukan runtime
web. Paket ini memuat kode native, sehingga **tidak jalan di Expo Go** dan butuh development build.

1. Buat animasi di editor Rive dengan satu artboard dan satu state machine `NyamMachine`:
   - Input `mood` (Number): `0 idle`, `1 wave`, `2 walk`, `3 sad`
   - Input `celebrate` (Trigger)
   - Transisi antar state memakai blend 200–300 ms
2. Jangan sekadar menukar gambar pose. Impor bagian tubuh (badan, kuping, lengan, ekor) sebagai layer
   terpisah dan animasikan. Pose Figma jadi acuan keyframe.
3. Taruh file di `assets/nyam/nyam.riv`, lalu pasang dengan `npx expo install rive-react-native` dan
   buat development build (`npx expo run:android` atau `eas build --profile development`).
4. Tulis `nyam-rive.tsx` yang memenuhi `NyamProps` (peta `mood` ke input `mood`, `celebrateKey` ke
   trigger `celebrate`), lalu ganti ekspor di `src/components/nyam/index.ts`. Tidak ada layar yang
   perlu diubah.

## Urutan pengerjaan animasi Rive

1. `idle` (dipakai hampir semua layar)
2. `celebrate` (momen utama)
3. `sad` (tiga layar)
4. `walk` (layar memuat rute)
5. `wave` (sambutan)
