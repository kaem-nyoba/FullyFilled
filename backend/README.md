# FullyFilled Core Service (inggrisbng2)

Microservice inti aplikasi **FullyFilled** untuk Tugas Besar II3160 TST × II3140 PWAM.
Tema: **Health & Wellbeing**, membantu pengguna mencapai target berat badan lewat rencana jalan kaki
sehat. Service ini menghitung **rute jalan kaki**, **estimasi kalori**, dan **progres target harian**.

| | |
|---|---|
| **Base URL** | `https://inggrisbng2.stei.site/api` |
| **Health check** | `https://inggrisbng2.stei.site/api/health` |
| **Kontrak API** | [`openapi.yaml`](openapi.yaml) (OpenAPI 3.0.3) |
| **Repositori** | Monorepo FullyFilled: aplikasi Expo di root, backend di folder `backend/` |
| **Deploy** | STB (Armbian, ARM64) dengan Docker Compose, akses publik lewat Cloudflare Tunnel |

---

## 1. Arsitektur

```
 📱 Aplikasi FullyFilled (Expo)          🌐 Kelompok lain (X-API-Key)
              │                                    │
              └──────────────┬─────────────────────┘
                             ▼  HTTPS
                  Cloudflare (inggrisbng2.stei.site)
                             │  Cloudflare Tunnel (cloudflared, service sistem di STB)
                             ▼  http://localhost:80
 ┌──────────────────────── STB · Docker Compose (project "fullyfilled") ───────────────────────┐
 │                                                                                              │
 │  gateway (Nginx 1.28)          core-service (Express 5 + TypeScript)      pocketbase (0.40)  │
 │  127.0.0.1:80 ─────────────▶   :3000 (internal saja)  ──────────────────▶  :8090 (internal)  │
 │  · rate limit 10 r/s/IP        · logika domain (DDD)                       · database        │
 │  · hanya /api/ diteruskan      · validasi, auth API key                    · volume pb-data  │
 │  · error JSON seragam          │                                           · admin UI hanya  │
 │                                └──▶ OSRM publik (rute jalan kaki)            lewat SSH tunnel│
 └──────────────────────────────────────────────────────────────────────────────────────────────┘
```

| Kontainer | Image / build | Port | Batas sumber daya | Fungsi |
|---|---|---|---|---|
| `gateway` | `nginx:1.28-alpine` | `127.0.0.1:80` | 64 MB, 0,25 CPU | Satu-satunya pintu masuk, rate limit, error JSON |
| `core-service` | `./core-service` (Node 22 Alpine, multi-stage) | internal `3000` | 256 MB, 0,5 CPU | Logika domain dan API |
| `pocketbase` | `./pocketbase` (PocketBase 0.40.6) | `127.0.0.1:8093` (admin) | 128 MB, 0,25 CPU | Database |

Semua kontainer memakai `restart: unless-stopped`. Port hanya dibuka di `127.0.0.1`, sehingga dari luar
STB hanya bisa diakses lewat Cloudflare Tunnel. Rahasia (API key, password) ada di `.env` yang tidak
di-commit.

### Alur satu request

```
POST /api/walk-plans/estimate
  → Cloudflare → cloudflared → gateway (cek rate limit)
  → core-service: cek X-API-Key → validasi body
  → OSRM: hitung jalur jalan kaki (urutan koordinat lng,lat)
  → domain: hitung kalori = MET 3,5 × berat (kg) × durasi (jam)
  → response JSON
```

---

## 2. Rancangan DDD di kode

```
core-service/src/
  domain/            aturan bisnis murni: LatLng, RouteProvider, estimateCaloriesKcal, DomainError
  application/       use case: estimateWalk
  infrastructure/    adapter ke luar: OsrmRouteProvider (Anti-Corruption Layer ke OSRM)
  interfaces/http/   Express: routing, validasi request, API key, format error
```

Lapisan `domain/` tidak bergantung pada Express, PocketBase, atau OSRM. OSRM dibungkus adapter
(`OsrmRouteProvider`) yang menerjemahkan format OSRM (`lng,lat`, `distance`, `duration`) ke model kita
(`{ lat, lng }`, `distanceM`, `durationMin`). Mesin rute bisa diganti tanpa mengubah domain.

Padanan istilah makalah DDD dengan kode:

| Makalah | Kode |
|---|---|
| Rencana Jalan | `WalkPlan` |
| Kalkulator Kalori | `estimateCaloriesKcal` |
| Penyedia Rute | `RouteProvider` / `OsrmRouteProvider` |
| Koordinat | `LatLng` |
| Jalan Selesai (event) | `WalkCompleted` (direncanakan) |

---

## 3. Daftar endpoint

Kontrak lengkap (format request, response, dan error) ada di [`openapi.yaml`](openapi.yaml).
Buka di [editor.swagger.io](https://editor.swagger.io) untuk tampilan interaktif.

| Method | Endpoint | Auth | Fungsi | Status |
|---|---|---|---|---|
| GET | `/health` | – | Cek service dan database | ✅ Tersedia |
| POST | `/walk-plans/estimate` | `X-API-Key` | Rute jalan kaki, jarak, durasi, dan estimasi kalori (tanpa menyimpan) | ✅ Tersedia |
| POST | `/auth/register` | – | Daftar akun | 🔨 Dalam pengembangan |
| POST | `/auth/login` | – | Masuk, dapat JWT | 🔨 Dalam pengembangan |
| GET / PATCH | `/me` | JWT | Profil pengguna | 🔨 Dalam pengembangan |
| GET / PUT | `/targets` | JWT | Target berat badan dan target jalan harian | 🔨 Dalam pengembangan |
| POST / GET | `/walk-plans` | JWT | Simpan dan lihat riwayat rencana jalan | 🔨 Dalam pengembangan |
| GET | `/walk-plans/{id}` | JWT | Detail rencana jalan | 🔨 Dalam pengembangan |
| PATCH | `/walk-plans/{id}/complete` | JWT | Tandai selesai, perbarui progres | 🔨 Dalam pengembangan |
| GET | `/progress/today` | JWT | Progres hari ini | 🔨 Dalam pengembangan |

---

## 4. Cara mendapat akses

1. **Minta API key** ke kelompok inggrisbng2 (lewat kontak di API Registry kelas). Setiap kelompok
   mendapat **satu kunci sendiri**, sehingga mudah dicabut bila disalahgunakan.
2. Kirim kunci di header **`X-API-Key`** pada setiap request ke endpoint yang membutuhkannya.
3. **Batas pemanggilan:** 10 request/detik per IP, toleransi lonjakan 20. Kelebihan dijawab
   `429 TOO_MANY_REQUESTS`.
4. Endpoint `/health` terbuka tanpa kunci.

Format error selalu sama, baik dari gateway maupun dari core-service:

```json
{ "error": { "code": "ROUTE_NOT_FOUND", "message": "Rute jalan kaki ke tujuan ini tidak tersedia." } }
```

| Status | `code` | Arti |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Body tidak valid (disertai `details` per field) |
| 400 | `INVALID_JSON` | Body bukan JSON |
| 401 | `UNAUTHORIZED` | API key tidak ada atau salah |
| 404 | `NOT_FOUND` | Endpoint tidak ada |
| 422 | `ROUTE_NOT_FOUND` | Tidak ada jalur jalan kaki, atau jarak di luar 0,2–15 km |
| 429 | `TOO_MANY_REQUESTS` | Melebihi batas pemanggilan |
| 503 | `ROUTING_UNAVAILABLE` | Mesin rute (OSRM) sedang tidak bisa dihubungi |
| 500 | `INTERNAL_ERROR` | Kesalahan di server |

---

## 5. Contoh request

### Health check

```bash
curl -i https://inggrisbng2.stei.site/api/health
```

```json
{ "status": "ok", "service": "fullyfilled-core", "database": "ok", "time": "2026-11-23T08:00:00.000Z" }
```

### Estimasi rute dan kalori

```bash
curl -X POST https://inggrisbng2.stei.site/api/walk-plans/estimate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: <API_KEY_KELOMPOKMU>" \
  -d '{
        "origin":      { "lat": -6.8915, "lng": 107.6098 },
        "destination": { "lat": -6.9025, "lng": 107.6186 },
        "weightKg": 68
      }'
```

```json
{
  "distanceM": 2258,
  "durationMin": 30,
  "estimatedCaloriesKcal": 119,
  "route": {
    "provider": "osrm",
    "geometry": { "type": "LineString", "coordinates": [[107.6098, -6.8915], "…", [107.6186, -6.9022]] }
  }
}
```

`route.geometry` memakai format **GeoJSON** (urutan `[lng, lat]`), jadi bisa langsung digambar di
peta. Semua field lain memakai `{ "lat", "lng" }`.

Contoh error validasi:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data yang dikirim tidak valid.",
    "details": [{ "field": "weightKg", "message": "Harus angka antara 20 dan 300." }]
  }
}
```

---

## 6. Menjalankan sendiri

Prasyarat: Docker dan Docker Compose.

```bash
cd backend
cp .env.example .env        # lalu isi API_KEYS dengan kunci acak
docker compose up -d --build
curl -i http://localhost/api/health
```

Di STB, repo di-clone ke `/opt/FullyFilled`, lalu perintah yang sama dijalankan di `backend/`.
Update: `git pull` lalu `docker compose up -d --build`.

Catatan jaringan STB: STB mendapat internet lewat Windows Internet Connection Sharing. DNS-nya
(`192.168.137.1`) salah menjawab pertanyaan IPv6 untuk nama tanpa IPv6, sehingga Docker di STB diatur
memakai DNS itu (`/etc/docker/daemon.json`) dan unduhan PocketBase di Dockerfile memakai `wget -4`.

---

## 7. Integrasi dengan kelompok lain

| Arah | Kelompok | Data | Status |
|---|---|---|---|
| Kami memakai | Kelompok Salma | Peta dan tempat (taman, tempat olahraga) | Menunggu kontrak API |
| Kami memakai | Kelompok Dani | Info gizi bahan makanan | Menunggu kontrak API |
| Kami menyediakan | Semua kelompok | `POST /walk-plans/estimate`: rute jalan kaki + kalori | ✅ Tersedia |

Kesepakatan (endpoint, format data, batas pemanggilan, kontak) dicatat di sini setelah disepakati.
