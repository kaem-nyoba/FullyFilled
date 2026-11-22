# Panduan Pengembangan FullyFilled (Tugas Besar TST × PWAM)

Dokumen ini adalah pegangan bersama untuk satu kelompok. Isinya: apa yang harus dibuat, bagaimana
rancangannya (DDD), API apa yang dipakai, aturan teknis, pembagian kerja, dan rencana kerja cepat.
Kalau ada keputusan baru, **perbarui dokumen ini** supaya semua anggota tetap sejalan.

> Sumber utama: PPT "Tugas Besar TST × PWAM" dari dosen. Nomor slide disebut di tiap bagian supaya
> mudah dicek. PDF-nya **jangan di-commit** ke repo karena memuat kredensial akun Cloudflare kelas.

---

## Daftar isi

1. [Ringkasan tugas](#1-ringkasan-tugas)
2. [Status proyek saat ini](#2-status-proyek-saat-ini)
3. [Pembagian peran](#3-pembagian-peran)
4. [API yang dipakai](#4-api-yang-dipakai)
5. [Arsitektur](#5-arsitektur)
6. [Rancangan DDD](#6-rancangan-ddd)
7. [Rancangan endpoint core service](#7-rancangan-endpoint-core-service)
8. [Aturan teknis backend dan STB](#8-aturan-teknis-backend-dan-stb)
9. [Aturan memakai OSRM](#9-aturan-memakai-osrm)
10. [Integrasi dan ketahanan](#10-integrasi-dan-ketahanan)
11. [Aplikasi mobile](#11-aplikasi-mobile)
12. [Rencana kerja cepat](#12-rencana-kerja-cepat)
13. [Checklist pengumpulan dan penilaian](#13-checklist-pengumpulan-dan-penilaian)
14. [Keamanan dan rahasia](#14-keamanan-dan-rahasia)
15. [Keputusan yang belum diambil](#15-keputusan-yang-belum-diambil)
16. [Peta slide PPT](#16-peta-slide-ppt)

---

## 1. Ringkasan tugas

Satu proyek untuk dua mata kuliah (slide 3–4):

| Mata kuliah | Yang dibuat |
|---|---|
| **II3160 TST** | Makalah DDD, microservice di STB (Docker, akses publik), API untuk kelompok lain, integrasi dengan ≥ 2 kelompok lain |
| **II3140 PWAM** | Aplikasi React Native (Expo) sesuai tema, memanggil API sendiri + API ≥ 2 kelompok lain, testing, APK release |

Tiga tahap TST:

| Tahap | Isi | Status |
|---|---|---|
| Tugas 1 | Makalah DDD: deskripsi sistem, bounded context, dekomposisi subdomain | ✅ Selesai |
| Tugas 2 | Microservice di STB, akses publik lewat Cloudflare Tunnel, Docker, README.pdf | 🔨 Fondasi online di `https://inggrisbng2.stei.site/api/health` (gateway, core-service, PocketBase). Endpoint fitur belum dibuat |
| Tugas 3 | Layanan integrasi (API kita + ≥ 2 kelompok lain) + aplikasi mobile + video | ⏳ Berikutnya |

Batas waktu resmi (slide 24): URL microservice di API Registry **akhir Minggu 14 (29 Nov 2026)**,
pengumpulan final **13 Des 2026, 23.59 WIB** di Edunex. Kelompok kita menargetkan selesai **lebih
cepat** dari itu (lihat [bagian 12](#12-rencana-kerja-cepat)).

**Tema kita:** Health & Wellbeing. FullyFilled membantu pengguna mencapai target berat badan dengan
santai: ide makan dari bahan yang ada, tempat untuk bergerak di sekitar, dan rute jalan kaki.

---

## 2. Status proyek saat ini

Repo ini adalah **aplikasi mobile** (Expo + Expo Router + TypeScript).

Sudah ada:

- Layar masuk dengan validasi form, layar target dan preferensi, beranda, ide makan, tempat di
  sekitar, layar rute jalan (loading, siap, gagal), navigasi tab + stack.
- State global dengan penyimpanan lokal (AsyncStorage), maskot Nyam dengan animasi.

Masih tiruan (mock), harus diganti dengan API sungguhan:

| Bagian | Lokasi sekarang | Nanti diganti dengan |
|---|---|---|
| Login | validasi lokal saja | `POST /api/auth/login` di core service kita |
| Tempat di sekitar | `src/data/places.ts` | API Maps kelompok **Salma** |
| Ide makan + gizi | `src/data/recipes.ts` | katalog kita + API Gizi kelompok **Dani** |
| Rute jalan | `src/services/route-service.ts` | core service kita (`/api/walk-plans`) |

Belum ada: backend, `ApiService`, Jest, ikon/splash final, konfigurasi EAS build.

---

## 3. Pembagian peran

Kelompok 2 orang (slide 5).

| | **A · Backend & Bisnis** (fokus TST) | **B · Mobile Developer** (fokus PWAM) |
|---|---|---|
| Rancangan | Model domain, aturan bisnis, makalah DDD | User story, alur layar, kebutuhan fitur |
| Bangun | Core service + database + auth, Docker, deploy STB, tunnel | Aplikasi Expo, `ApiService`, state, form, loading/error |
| Integrasi | Layanan integrasi (ACL ke Salma, Dani, Google/OSRM), kontrak API, API key | Mengonsumsi API kita + API Salma & Dani di app |
| Kualitas | OpenAPI/Swagger, README.pdf, README.txt, log bukti integrasi | Jest, tabel uji fungsional, laporan testing .pdf |
| Rilis | URL publik + entri API Registry | Ikon, splash, `Aplikasi_Release.apk` |

**Dikerjakan bersama:** kontrak API, uji end-to-end, README, video (keduanya tampil).
Nilai individu dilihat dari kontribusi di GitHub, jadi **commit atas nama masing-masing**.

---

## 4. API yang dipakai

Kita memakai **3 API**. Syarat "≥ 2 kelompok lain" (slide 14) terpenuhi oleh Salma dan Dani.

| API | Penyedia | Dipakai untuk | Jenis subdomain (bagi kita) |
|---|---|---|---|
| **Maps** | Kelompok **Salma** | Peta dan tempat olahraga/taman di sekitar pengguna | Generic |
| **Info gizi bahan makanan** | Kelompok **Dani** | Kalori dan gizi bahan untuk ide makan | Generic |
| **Rute jalan sehat** | **Kita sendiri** (core service di STB) | Rute jalan kaki + kalori terbakar + progres target | **Core** |

Mesin perhitungan rute di dalam core service: **OSRM** (sudah diputuskan).

| Mesin | Peran | Catatan |
|---|---|---|
| OSRM (`https://routing.openstreetmap.de/routed-foot/`) | Satu-satunya mesin rute | Gratis, tanpa API key, mode jalan kaki, cocok dengan peta OSM. Sudah dites: **200 OK**. Lihat [bagian 9](#9-aturan-memakai-osrm) |

Google Routes **tidak dipakai**: OSRM tidak butuh API key, tidak ada tagihan, dan tidak bentrok
dengan aturan Google soal menampilkan rute di peta non-Google.

Catatan: server demo `router.project-osrm.org` hanya untuk mobil. Untuk jalan kaki pakai
`routing.openstreetmap.de/routed-foot`.

Hasil tes API publik lain (kalau nanti dibutuhkan):

| API | Hasil tes | Kemungkinan dipakai |
|---|---|---|
| Open-Meteo | 200 | Saran olahraga di luar atau di dalam ruangan |
| Nominatim | 200 | Ubah nama tempat jadi koordinat |
| Overpass | timeout | Tidak stabil. Kalau dipakai, wajib cache |

### Yang harus disepakati dengan Salma dan Dani (slide 14 poin 3)

Tulis di README **kedua** kelompok:

- Base URL dan endpoint yang kita pakai
- Format request dan response (contoh JSON)
- Cara autentikasi (API key / JWT) dan akun uji
- Batas pemanggilan (rate limit)
- Kontak yang bisa dihubungi

Kalau API mereka belum online, kita pakai **mock dari kontrak mereka** (Postman mock / mock lokal).
Kalau lewat 29 Nov belum ada, laporkan ke asisten (slide 27).

---

## 5. Arsitektur

Sesuai slide 11: **STB hanya untuk microservice.** Layanan integrasi dijalankan di tempat lain
(laptop, VM, server lain) atau digabung di aplikasi mobile.

```
┌─────────────────┐      ┌──────────────────────────┐
│ Aplikasi Mobile │ ───▶ │ Layanan Integrasi        │   (laptop / VM / server lain,
│ FullyFilled     │      │ ACL Salma · ACL Dani     │    BUKAN di STB)
│ (Expo)          │      │ cache · timeout · retry  │
└─────────────────┘      └───────┬─────────┬────────┘
                                 │         │
                ┌────────────────┘         └─────────────┬──────────────────┐
                ▼                                        ▼                  ▼
┌──────────────── STB kita (Docker) ──────────────┐  API Maps          API Gizi
│ tunnel ─▶ gateway (Nginx, rate limit)           │  kelompok Salma    kelompok Dani
│              │                                  │
│              ▼                                  │
│   core-service (Express) ── auth (JWT / API key)│
│              │                                  │
│              ├── PocketBase (tidak dibuka keluar)│
│              └── ACL ─▶ OSRM (routed-foot)      │
└─────────────────────────────────────────────────┘
Akses publik: https://<namakelompok>.stei.fun (kelas K01)
```

---

## 6. Rancangan DDD

Prinsip yang dinilai dosen TST: **konsisten**. Istilah dan batas yang ada di makalah harus terlihat
di nama endpoint, nama class, struktur folder, README, dan video.

> Kalau tabel di bawah berbeda dengan makalah yang sudah dikumpulkan, **ikuti makalah** dan
> perbarui dokumen ini.

### 6.1 Domain dan subdomain

**Domain:** membantu orang mencapai berat badan sehat secara santai.

| Jenis | Subdomain | Dibangun oleh |
|---|---|---|
| **Core** | Rencana jalan sehat: rute + kalori menuju target harian | Kita (core service di STB) |
| **Core / Supporting** | Target dan progres berat badan | Kita |
| **Supporting** | Ide makan dari bahan yang dimiliki | Kita, memakai data gizi Dani |
| **Generic** | Peta dan lokasi tempat | Kelompok Salma |
| **Generic** | Data gizi bahan makanan | Kelompok Dani |
| **Generic** | Mesin perhitungan rute | OSRM |
| **Generic** | Autentikasi | Kita (JWT + API key) |

**Kenapa ini penting:** slide 19 menyebut *Core = pembeda utama, dibangun sendiri.* Kalau core
service hanya meneruskan request ke Google, dosen bisa menilai tidak ada logika domain. Yang khas
FullyFilled adalah: *"rute ini membakar 180 kkal, kurang 1,2 km lagi untuk target hari ini"*.
Logika itu **harus ada di kode kita**, OSRM hanya menghitung jarak dan jalur.

### 6.2 Bounded context

| Context | Isi | Tempat |
|---|---|---|
| **Identity** | Pengguna, login, JWT, API key kelompok lain | Core service (STB) |
| **Aktivitas & Rute** | Rencana jalan, kalori, target harian, progres | Core service (STB) |
| **Makan** | Ide makan dari bahan, dihubungkan dengan gizi | App / layanan integrasi |
| **Maps** (milik Salma) | Tempat, koordinat, kategori | Di luar, diakses lewat ACL |
| **Nutrition** (milik Dani) | Gizi per bahan | Di luar, diakses lewat ACL |

Tiap context punya model sendiri. Contoh: "tempat" di context Salma bisa berbentuk
`{name, lat, lon, category}`, sedangkan bagi kita itu "titik tujuan jalan kaki". Jangan dicampur;
terjemahkan lewat ACL.

### 6.3 Context map (hubungan antar context)

| Hubungan | Pola DDD | Artinya |
|---|---|---|
| Kita → Salma (Maps) | Customer–Supplier | Kita pelanggan; kebutuhan kita disepakati dengan mereka |
| Kita → Dani (Gizi) | Customer–Supplier | Sama seperti di atas |
| Kita → OSRM | Conformist | Kita mengikuti format mereka, tidak bisa minta diubah |
| Semua hubungan keluar | **Anti-Corruption Layer (ACL)** | Lapisan penerjemah supaya format luar tidak masuk ke model kita |

Adapter OSRM di core service **adalah ACL**. Sebut dengan istilah ini di README dan video.

### 6.4 DDD taktis (wujudnya di kode)

| Konsep | Contoh di core service |
|---|---|
| **Aggregate root / Entity** | `RencanaJalan` (WalkPlan): punya ID, milik satu pengguna, status `direncanakan → selesai` |
| **Value Object** | `Koordinat(lat, lng)`, `Jarak(meter)`, `Kalori(kkal)`, divalidasi saat dibuat dan tidak bisa diubah |
| **Aturan domain (invariant)** | Jarak 0,2–15 km; berat badan pengguna wajib ada untuk menghitung kalori; hanya pemilik yang boleh menyelesaikan rencana |
| **Domain Service** | `KalkulatorKalori`: `kkal = MET × berat (kg) × durasi (jam)`, MET jalan santai ≈ 3,5 |
| **Repository** | `RencanaJalanRepository` (simpan/ambil dari database) |
| **Domain Event** | `JalanSelesai` → memperbarui progres target harian |
| **Ubiquitous Language** | Istilah yang **sama** di makalah, endpoint, class, dan teks di app |

Karena kontrak API memakai bahasa Inggris, nama di kode juga bahasa Inggris. Padanannya dengan
istilah makalah: `RencanaJalan` → **`WalkPlan`**, `KalkulatorKalori` → **`CalorieCalculator`**,
`JalanSelesai` → **`WalkCompleted`**, `Koordinat` → **`LatLng`**, `Jarak` → **`Distance`**,
`Kalori` → **`Calories`**, `PenyediaRute` → **`RouteProvider`**. Cantumkan tabel padanan ini di
README supaya penilai bisa menghubungkan makalah dengan kode.

### 6.5 Struktur folder core service

```
core-service/
  src/
    domain/            entity, value object, aturan, domain service (tanpa framework, tanpa HTTP)
    application/       use case: BuatRencanaJalan, SelesaikanJalan, LihatProgresHariIni
    infrastructure/    PocketBase, repository, adapter OSRM (ACL)
    interfaces/http/   controller, routing, middleware auth, validasi request
  test/
  Dockerfile
```

Lapisan `domain/` **tidak boleh** bergantung pada OSRM, PocketBase, atau Express. Ini bisa
ditunjukkan langsung di video.

---

## 7. Rancangan endpoint core service

Kontrak resmi ada di **[`backend/openapi.yaml`](../backend/openapi.yaml)** (OpenAPI 3.0.3). Tabel di
bawah adalah ringkasannya. Kalau berbeda, **`openapi.yaml` yang benar**.

Konvensi (diputuskan: **bahasa Inggris**):

- Nama field JSON memakai bahasa Inggris dengan camelCase dan satuan di akhir nama:
  `distanceM`, `durationMin`, `weightKg`, `estimatedCaloriesKcal`.
- Kode error memakai bahasa Inggris UPPER_SNAKE_CASE (`NOT_FOUND`, `ROUTE_NOT_FOUND`), sedangkan teks
  `message` tetap bahasa Indonesia karena ditampilkan ke pengguna.
- Koordinat selalu `{ "lat": ..., "lng": ... }`.

| Method | Path | Auth | Fungsi |
|---|---|---|---|
| GET | `/api/health` | – | Cek service hidup (dipakai untuk cek tunnel, slide 13) |
| POST | `/api/auth/register` | – | Daftar pengguna (data uji saja) |
| POST | `/api/auth/login` | – | Masuk, mengembalikan JWT |
| GET / PATCH | `/api/me` | JWT | Lihat / ubah profil (termasuk berat badan untuk hitung kalori) |
| GET / PUT | `/api/targets` | JWT | Lihat / ubah target berat badan dan target harian |
| POST | `/api/walk-plans/estimate` | API key atau JWT | Hitung rute, jarak, durasi, dan kalori **tanpa menyimpan**. Endpoint utama untuk kelompok lain |
| POST | `/api/walk-plans` | JWT | Buat dan simpan rencana jalan: `{origin, destination}` → rute, jarak, durasi, kalori, sisa target hari ini |
| GET | `/api/walk-plans` | JWT | Riwayat rencana jalan milik pengguna |
| GET | `/api/walk-plans/{id}` | JWT | Detail satu rencana |
| PATCH | `/api/walk-plans/{id}/complete` | JWT | Tandai selesai, picu `JalanSelesai`, perbarui progres |
| GET | `/api/progress/today` | JWT | Progres hari ini: jarak, kalori, sisa target |

Autentikasi (slide 17):

| Pemanggil | Cara |
|---|---|
| Pengguna aplikasi (sudah login) | `Authorization: Bearer <JWT>` |
| Kelompok lain (server ke server) | Header `X-API-Key`, **satu key per kelompok** supaya mudah dicabut |
| Publik | Hanya `/api/health`, tetap kena rate limit |

Contoh respons `POST /api/walk-plans`:

```json
{
  "id": "wp7k2m9x4q1abcd",
  "status": "planned",
  "origin": { "lat": -6.8915, "lng": 107.6098 },
  "destination": { "lat": -6.9025, "lng": 107.6186 },
  "destinationName": "Taman Lansia",
  "distanceM": 2258,
  "durationMin": 30,
  "estimatedCaloriesKcal": 119,
  "remainingDailyTargetM": 742,
  "route": { "provider": "osrm", "geometry": { "type": "LineString", "coordinates": [[107.6098, -6.8915], "..."] } },
  "createdAt": "2026-11-23T08:00:00.000Z",
  "completedAt": null
}
```

Format error yang seragam:

```json
{ "error": { "code": "ROUTE_NOT_FOUND", "message": "Rute jalan kaki ke tujuan ini tidak tersedia." } }
```

---

## 8. Aturan teknis backend dan STB

Stack yang dipilih: **Express (TypeScript)** untuk core service dan **PocketBase** sebagai database.
PocketBase berjalan di kontainer sendiri dan hanya bisa diakses oleh core service lewat jaringan
internal Docker. Admin UI PocketBase dibuka dari laptop lewat SSH tunnel, tidak lewat internet.

### 8.0 Kondisi STB saat ini

STB sudah menjalankan **phpMyAdmin, PocketBase, MySQL, dan Nginx** (sisa praktikum). Sebelum deploy:

- Cek apakah semuanya berjalan sebagai kontainer Docker atau terpasang langsung di sistem
  (`docker ps`, `systemctl status nginx mysql`), dan port mana yang sudah terpakai (`ss -tulpn`).
- Hindari bentrok port: gateway kita, PocketBase (8090), dan Nginx bawaan (80) tidak boleh memakai
  port yang sama.
- Kita memakai PocketBase, jadi **MySQL dan phpMyAdmin tidak dibutuhkan**. Kalau tidak dipakai
  untuk hal lain, matikan supaya RAM STB lega. phpMyAdmin dan port MySQL (3306) **tidak boleh**
  terbuka ke internet (slide 23).

### 8.1 Wajib (slide 20 dan 23)

- Setiap kontainer punya `mem_limit`, `cpus`, dan `restart: unless-stopped`.
- STB hanya menjalankan kontainer microservice: core, auth, gateway, tunnel. **Jangan** menjalankan
  frontend, build aplikasi mobile, atau model AI di STB.
- Port database **tidak** dibuka ke internet.
- Rahasia (password, token tunnel, JWT secret) di `.env`, **tidak** di GitHub. Commit
  `.env.example` sebagai gantinya.
- Rate limit di gateway (API tanpa batas pemanggilan dilarang).
- Hanya data uji, bukan data pribadi asli.
- Backup database berkala (`docker compose cp` / dump). Pantau beban dengan `docker stats` dan `free -h`.

### 8.2 Kerangka `docker-compose.yml` (versi lengkap dari slide 20)

```yaml
services:
  core-service:
    build: ./core-service
    restart: unless-stopped
    env_file: .env            # rahasia, jangan di-commit
    mem_limit: 256m           # jaga STB tidak hang
    cpus: 0.5
    expose: ["3000"]          # hanya untuk jaringan internal Docker
    depends_on: [pocketbase]

  pocketbase:
    build: ./pocketbase
    restart: unless-stopped
    volumes:
      - pb-data:/pb/pb_data   # data PocketBase disimpan di volume
    ports: ["127.0.0.1:8090:8090"]   # hanya localhost STB, untuk admin UI lewat SSH tunnel
    mem_limit: 128m
    cpus: 0.25

  gateway:
    image: nginx:1.28-alpine
    restart: unless-stopped
    volumes:
      - ./gateway/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    ports: ["8080:80"]        # opsional, hanya untuk tes lokal di STB
    mem_limit: 64m
    cpus: 0.25
    depends_on: [core-service]

  tunnel:
    image: cloudflare/cloudflared:<versi-spesifik>   # hindari :latest
    restart: unless-stopped
    command: tunnel run --token ${TUNNEL_TOKEN}
    mem_limit: 64m
    cpus: 0.25
    depends_on: [gateway]

volumes:
  pb-data:
```

Catatan: kelompok kita memasang `cloudflared` **langsung di STB sebagai service sistem** (lihat
8.4), jadi blok `tunnel:` di atas **tidak dipakai**. Gateway dibuka di `127.0.0.1:8081` dan
`cloudflared` menjangkaunya lewat `localhost:8081`. Port ini hanya terbuka untuk STB sendiri, bukan ke
internet.

### 8.3 Contoh `gateway/nginx.conf` dengan rate limit

```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

server {
    listen 80;

    location /api/ {
        limit_req zone=api burst=20 nodelay;
        limit_req_status 429;
        proxy_pass http://core-service:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 15s;
    }
}
```

### 8.4 Cloudflare Tunnel (slide 12–13)

> **Konfigurasi aktual kelompok kita.** Akun Cloudflare dipegang asisten, jadi kita tidak mengubah
> dashboard sendiri. Aturan yang dipasang asisten:
>
> | Urutan | Tujuan | Service di STB |
> |---|---|---|
> | 1 | `inggrisbng2.stei.site/^/api(/.*)?$` | `http://localhost:80` |
> | 2 | `inggrisbng2.stei.site` (selain `/api`) | `https://localhost:1122` (aaPanel) |
>
> Base URL API: **`https://inggrisbng2.stei.site/api`**. Menurut asisten, **port 80 di STB adalah
> tempat API kita**. Pintu masuk API kita adalah kontainer `gateway`, jadi gateway dibuka di
> **`127.0.0.1:80`, sama di laptop dan di STB**. Nginx sistem yang sebelumnya memakai port 80 di STB
> harus dimatikan dulu supaya port itu kosong. Langkah di bawah adalah panduan umum dari PPT.

1. Pesan nama kelompok di API Registry (huruf kecil, angka, `-`, 3–20 karakter, sama dengan nama repo).
2. Login akun Cloudflare kelas (kredensial ada di PPT, **jangan ditulis di repo**).
3. Networks → Tunnels → Create tunnel → Cloudflared → nama `k0X-namakelompok`.
4. Public Hostname: subdomain `namakelompok`, domain `stei.fun` (K01) / `stei.site` (K02),
   type HTTP, URL **`localhost:8081`** (port gateway kita yang dibuka di `127.0.0.1` STB).
5. Pasang `cloudflared` **langsung di STB sebagai service sistem** (sesuai instruksi kelas), bukan
   sebagai kontainer. Karena itu service `tunnel` di `docker-compose.yml` **tidak dipakai**, dan
   `TUNNEL_TOKEN` tidak perlu ada di `.env`.

```sh
# sekali saja: pasang cloudflared dari repo resmi Cloudflare, lalu daftarkan sebagai service
sudo cloudflared service install <TOKEN>

# cek
systemctl status cloudflared
curl -i http://127.0.0.1:8081/api/health
curl -i https://namakelompok.stei.fun/api/health
```

Kenapa URL-nya `localhost:8081` dan bukan `gateway:80`? Nama `gateway` hanya dikenal di dalam
jaringan Docker. `cloudflared` yang terpasang di sistem STB berada di luar jaringan itu, jadi ia
menjangkau gateway lewat port yang dibuka compose di `127.0.0.1:8081`.

Aturan akun bersama: hanya ubah tunnel dan hostname milik kelompok sendiri, jangan ubah password,
2FA, DNS lain, atau pengaturan akun, dan logout setelah selesai.

| Gejala | Solusi |
|---|---|
| Tunnel Down / Inactive | Token salah atau STB offline: cek `.env` dan log |
| 502 Bad Gateway | URL salah atau gateway mati: cek `gateway:80` |
| Subdomain sudah dipakai | Milik kelompok lain: cek API Registry |

### 8.5 README.pdf backend harus berisi

- Arsitektur (diagram bagian 5)
- Daftar endpoint + link Swagger UI / `openapi.yaml`
- Cara mendapat akses (API key untuk kelompok lain, akun uji)
- Contoh request dan response (`curl`)
- Cara menjalankan (`docker compose up -d`)

---

## 9. Aturan memakai OSRM

Mesin rute: `https://routing.openstreetmap.de/routed-foot/route/v1/foot/{lng},{lat};{lng},{lat}`.
Urutan koordinat OSRM adalah **longitude dulu, baru latitude**.

1. **Server publik punya aturan pemakaian wajar.** Jangan memanggil berulang-ulang untuk rute yang
   sama: pasang **cache** (misalnya 10–30 menit per pasangan asal–tujuan yang dibulatkan) dan
   rate limit di Nginx, supaya STB kita tidak diblokir.
2. Kirim **User-Agent yang jelas**, misalnya `FullyFilled-TugasBesar/1.0`.
3. **Timeout** 8–10 detik. Kalau OSRM gagal, kembalikan error yang rapi
   (`503 ROUTING_UNAVAILABLE`; kalau jalurnya memang tidak ada, `422 ROUTE_NOT_FOUND`), jangan crash.
4. Bungkus OSRM dalam **satu antarmuka adapter** (`PenyediaRute`) di lapisan infrastructure. Domain
   hanya mengenal `PenyediaRute`, bukan OSRM, sehingga mesin rute bisa diganti tanpa mengubah
   domain atau endpoint.
5. OSRM **hanya menghitung jalur, jarak, dan durasi**. Kalori, target harian, dan progres adalah
   logika domain kita sendiri.

---

## 10. Integrasi dan ketahanan

Aturan slide 14:

1. **Menyediakan:** API publik + dokumentasi, API key untuk kelompok lain, satu akun uji.
2. **Memakai ≥ 2 kelompok lain:** data Salma dan Dani dipakai **nyata** di fitur, bukan dipanggil sekali.
3. **Kesepakatan tertulis** di README kedua kelompok.
4. **Tahan gangguan:** kalau API lain mati, aplikasi tetap jalan.
5. **Bukti:** screenshot / log pemanggilan, dijelaskan di README dan ditunjukkan di video.

### 10.1 Alur layanan gabungan (Tugas 3)

Satu alur yang memakai ketiga API:

1. Pengguna membuka **peta** dan memilih taman / tempat olahraga terdekat → **API Salma**.
2. App meminta **rute jalan kaki** ke tempat itu, lengkap dengan estimasi kalori dan sisa target
   hari ini → **API kita**.
3. Setelah jalan selesai, app menyarankan **makanan** dari bahan yang dimiliki, dengan info gizi
   yang pas dengan kalori yang terbakar → **API Dani**.

### 10.2 Aturan ketahanan di layanan integrasi dan app

| Situasi | Perilaku yang diharapkan |
|---|---|
| API lambat | Timeout 8–10 detik, lalu tampilkan pesan jelas |
| API mati | Pakai data cache terakhir kalau ada; kalau tidak ada, tampilkan keadaan "tidak tersedia" tanpa crash |
| 401 / 403 | Pesan "akses ditolak", catat di log, cek API key |
| 429 | Tunggu lalu coba lagi sekali, atau pakai cache |
| Data kosong | Tampilkan keadaan kosong (empty state) dengan Nyam |

Setiap pemanggilan ke API kelompok lain dicatat di log (waktu, endpoint, status, durasi) sebagai
bukti integrasi.

---

## 11. Aplikasi mobile

Deliverable PWAM (slide 22):

| # | Syarat | Status |
|---|---|---|
| 1 | Repo GitHub + README cara menjalankan + akun demo | Sebagian (README ada, akun demo masih mock) |
| 2 | ≥ 4 layar, navigasi stack + tab, login, form dengan validasi | ✅ |
| 3 | `ApiService` memanggil API sendiri + ≥ 2 kelompok lain | ❌ Belum |
| 4 | Loading, error, data kosong, API lain mati tanpa crash | Sebagian (rute dan tempat) |
| 5 | Jest + tabel uji fungsional + uji integrasi API | ❌ Belum |
| 6 | `Aplikasi_Release.apk` lewat EAS, ikon & splash sesuai tema, URL API https | ❌ Belum |

### 11.1 `ApiService`

Project memakai TypeScript, jadi filenya `src/services/ApiService.ts`. Sebutkan di README bahwa ini
padanan `ApiService.js` di slide.

Isi yang diharapkan:

- Base URL dari konfigurasi (`app.json` → `extra`, atau env Expo), **https**.
- Satu fungsi `request()` bersama: pasang JWT, timeout, ubah error jadi pesan yang ramah.
- Fungsi per fitur: `login`, `getTarget`, `createWalkPlan`, `completeWalkPlan`, `getProgressToday`,
  `getNearbyPlaces` (Salma), `getNutrition` (Dani).
- Mode mock yang bisa dinyalakan, supaya app tetap bisa dikembangkan sebelum API online.
- API key kelompok lain **tidak** disimpan di app. Panggil lewat layanan integrasi.

### 11.2 Testing

- Jest untuk fungsi murni di `src/utils/` dan untuk `ApiService` (dengan fetch tiruan).
- Tabel uji fungsional: skenario, langkah, hasil yang diharapkan, hasil nyata, status.
- Uji integrasi: panggil API kita, Salma, dan Dani; uji juga skenario API mati.

### 11.3 Rilis

- Ikon dan splash bertema FullyFilled / Nyam.
- Build EAS dicoba **sedini mungkin**, karena antrean build gratis bisa lama.
- Nama file akhir: `Aplikasi_Release.apk`.

---

## 12. Rencana kerja cepat

Target kelompok: **selesai secepat mungkin**, sekitar 3 hari kerja penuh, lalu cadangan untuk
perbaikan. Tenggat resmi tetap batas paling akhir: Registry 29 Nov, final 13 Des.

### Prinsip

1. **Kontrak dulu.** `openapi.yaml` ditulis paling awal, supaya B bisa membuat app dengan mock dan
   kelompok lain bisa mulai integrasi.
2. **Deploy sekecil mungkin di awal.** `/api/health` harus hidup di URL publik pada hari pertama.
   Masalah STB, Docker, dan tunnel paling sering makan waktu.
3. **Satu alur utuh dulu.** Login → buat rencana jalan → lihat kalori, baru tambah fitur lain.
4. **Jangan menunggu kelompok lain.** Pakai mock, ganti URL begitu API mereka online.
5. **Bekukan fitur** setelah alur utama jalan. Sisanya hanya perbaikan, dokumen, APK, dan video.

### Hari 1: fondasi dan URL publik

| A · Backend | B · Mobile |
|---|---|
| Pilih nama domain, daftar di API Registry | Review kontrak bersama A |
| Tulis `openapi.yaml` v1 (bagian 7) | Buat `ApiService.ts` + mode mock sesuai kontrak |
| Kerangka `core-service` dengan struktur DDD + `/api/health` | Sambungkan layar masuk ke `ApiService` (mock) |
| `docker-compose.yml` + Nginx, deploy ke STB, pasang tunnel | Hubungi Salma dan Dani: kontrak, API key, akun uji |
| ✅ `curl https://namakelompok.stei.xxx/api/health` berhasil | Pasang Jest, tulis test pertama untuk `src/utils/` |

### Hari 2: domain, auth, integrasi

| A · Backend | B · Mobile |
|---|---|
| Auth: register, login JWT, middleware, API key per kelompok | Layar rute dan progres memakai `ApiService` |
| Domain: `RencanaJalan`, value object, `KalkulatorKalori`, repository | Layar tempat memakai data Salma (asli atau mock) |
| Adapter OSRM + cache + timeout | Ide makan memakai data gizi Dani (asli atau mock) |
| Swagger UI online, isi Registry lengkap (status Online) | Keadaan loading, error, kosong, dan API mati di semua layar |
| Layanan integrasi (di luar STB) dengan ACL Salma dan Dani | Ganti mock dengan API kita yang sudah online |

### Hari 3: uji, rilis, dokumen

| A · Backend | B · Mobile |
|---|---|
| Uji end-to-end bersama B | Uji end-to-end bersama A |
| Log bukti pemanggilan API Salma dan Dani | Ikon, splash, build EAS → `Aplikasi_Release.apk` |
| README.pdf backend, README.txt layanan integrasi | Tabel uji fungsional, laporan testing .pdf |
| Tulis kesepakatan integrasi di README kedua kelompok | README app: cara menjalankan, akun demo |

### Setelah itu: video dan cadangan

- Rekam video: kedua anggota tampil, jelaskan bounded context → kode → demo alur gabungan, dan beri
  tanggapan atas rancangan kelompok Salma dan Dani (slide 21a).
- Upload ke YouTube, cek semua URL masih hidup, kumpulkan di Edunex.
- Sisa hari dipakai untuk perbaikan bug dan merespons issue dari kelompok yang memakai API kita
  (penilaian sejawat).
- **Jaga STB tetap menyala** sampai penilaian selesai.

### Risiko dan antisipasi

| Risiko | Antisipasi |
|---|---|
| STB mati atau hang | `mem_limit`, `restart: unless-stopped`, backup DB. Rusak → lapor asisten, pakai VM Proxmox lab |
| Tunnel down / 502 | Cek log tunnel dan gateway; tes sejak hari 1 |
| OSRM publik lambat, menolak, atau membatasi | Cache, timeout, User-Agent jelas, rate limit, pesan error yang rapi |
| API Salma / Dani belum siap | Mock dari kontrak, lapor asisten kalau lewat 29 Nov |
| Build EAS lama atau gagal | Coba build di hari 2–3, jangan di malam terakhir |
| URL mati saat dinilai | Cek uptime sebelum dan sesudah pengumpulan |

---

## 13. Checklist pengumpulan dan penilaian

### Berkas yang dikumpulkan (slide 26)

| Berkas / tautan | Penanggung jawab | Format |
|---|---|---|
| Makalah DDD + cover | A (dibantu B) | ✅ sudah |
| URL microservice + entri API Registry | A | `namakelompok.stei.fun` / `.site` |
| Repo backend + README.pdf | A | GitHub |
| URL layanan integrasi + README.txt | A | URL / program lokal |
| Laporan testing aplikasi | B | .pdf |
| Repo aplikasi + `Aplikasi_Release.apk` | B | GitHub + .apk |
| Video penjelasan (kedua anggota tampil) | A + B | link YouTube |

Repo: kita memakai **monorepo** (slide 4: "satu repositori"). Aplikasi Expo tetap di root repo
FullyFilled, backend ada di folder **`backend/`**. `tsconfig.json` aplikasi mengecualikan `backend`.
Di STB: `git clone` repo FullyFilled, lalu `cd FullyFilled/backend` sebelum `docker compose up -d --build`.
Kode aplikasi ikut terunduh ke STB tetapi tidak dijalankan.

### Bobot penilaian (usulan, slide 25)

**TST**

| Komponen | Bobot | Yang harus terlihat |
|---|---|---|
| Makalah DDD | 25% | ✅ sudah dikumpulkan |
| Microservice + Docker + deploy STB | 30% | Limit kontainer, Nginx + rate limit, `/api/health` publik, DB tertutup, `.env` |
| Integrasi ≥ 2 kelompok + layanan baru | 25% | ACL, timeout/cache/fallback, kesepakatan tertulis, log bukti |
| README & video | 20% | README.pdf lengkap, Swagger, video jelas |
| Bonus auth & authorization | +10% | JWT + API key, pengguna hanya bisa akses datanya sendiri |

**PWAM**

| Komponen | Bobot | Yang harus terlihat |
|---|---|---|
| Fungsionalitas & integrasi API | 35% | Alur gabungan Salma → kita → Dani berjalan |
| Tampilan & kemudahan | 15% | Desain Figma + Nyam, keadaan kosong dan error yang ramah |
| Kode, testing, debugging | 20% | Jest, tabel uji, uji integrasi |
| Branding, APK, README | 15% | Ikon, splash, APK release, README |
| Demo & video | 15% | Demo lancar, kedua anggota tampil |

**Penilaian sejawat:** kelompok lain menilai kemudahan memakai API kita (dokumentasi, uptime,
respons atas issue). Balas issue dengan cepat.

---

## 14. Keamanan dan rahasia

- **Jangan commit:** `.env`, token tunnel, JWT secret, password PocketBase, API key dari Salma/Dani, PDF tugas
  (berisi kredensial akun Cloudflare kelas).
- Tambahkan ke `.gitignore`: `.env`, `*.pdf` dari dosen (atau pindahkan PDF ke luar folder repo).
- Commit `.env.example` berisi nama variabel tanpa nilai.
- Kalau rahasia terlanjur ter-commit: **ganti (rotate) rahasianya**, menghapus commit saja tidak cukup.
- Gunakan hanya data uji di database.

Contoh `.env.example`:

```dotenv
PORT=3000
PB_URL=http://pocketbase:8090
OSRM_BASE_URL=https://routing.openstreetmap.de/routed-foot
JWT_SECRET=
TUNNEL_TOKEN=
```

---

## 15. Keputusan yang belum diambil

Isi kolom "Keputusan" begitu sudah disepakati.

| Pertanyaan | Pilihan | Keputusan |
|---|---|---|
| Stack backend | Express (TypeScript, sama dengan app) / FastAPI | ✅ **Express (TypeScript)** |
| Kelas | K01 (`.stei.fun`) / K02 (`.stei.site`) | ✅ K01, tetapi domain yang dipasang asisten memakai **`.stei.site`** |
| Nama subdomain kelompok | huruf kecil, angka, `-`, 3–20 karakter | ✅ **`inggrisbng2`** → `https://inggrisbng2.stei.site/api` |
| Port tujuan tunnel untuk `/api` | `localhost:80` (aturan asisten) / `localhost:8081` (gateway kita) | ✅ **`localhost:80` = gateway kita**, sama di laptop dan STB |
| Database | SQLite / PocketBase / PostgreSQL | ✅ **PocketBase** |
| Mesin rute | Google Routes / OSRM | ✅ **OSRM** (`routing.openstreetmap.de/routed-foot`) |
| API kelompok lain | | ✅ Maps: kelompok Salma · Gizi: kelompok Dani |
| Struktur repo | 2 repo / monorepo | ✅ **Monorepo**: app di root, backend di `backend/` |
| Tempat layanan integrasi | Laptop / VM / server lain / digabung di app | |
| Kontrak API Salma | Endpoint, format, auth | |
| Kontrak API Dani | Endpoint, format, auth | |

---

## 16. Peta slide PPT

| Kebutuhan | Slide |
|---|---|
| Ringkasan tugas, dua mata kuliah, peran | 3, 4, 5 |
| Tema dan contoh ide | 7, 8 |
| Cara uji API publik | 9 |
| Arsitektur target | 11 |
| Aturan nama domain | 12 |
| Setup Cloudflare Tunnel | 13 |
| Aturan integrasi ≥ 2 kelompok | 14, 15 |
| API Registry | 16 |
| Kontrak API dan autentikasi | 17 |
| Tugas 1 (DDD) | 19 |
| Tugas 2 (microservice di STB) | 20 |
| Tugas 3 (integrasi dan video) | 21 |
| Deliverable aplikasi mobile | 22 |
| Aturan pemakaian STB | 23 |
| Timeline, penilaian, checklist, FAQ | 24, 25, 26, 27 |

Urutan baca untuk Tugas 2: **20 → 11 → 23 → 17** (desain dan kode), lalu **12 → 13 → 16** (deploy
dan pendaftaran).
