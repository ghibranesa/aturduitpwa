# AturDuit PWA — Cara Deploy & Install

## Struktur File
```
aturduit-pwa/
├── index.html          ← HTML utama (sudah dimodifikasi untuk PWA)
├── manifest.json       ← Konfigurasi PWA (nama, ikon, warna)
├── sw.js               ← Service Worker (offline cache)
├── assets/
│   ├── qris.png        ← Gambar QRIS asli
│   └── icons/          ← Icon PWA semua ukuran
│       ├── icon-72x72.png
│       ├── icon-96x96.png
│       ├── icon-128x128.png
│       ├── icon-144x144.png
│       ├── icon-152x152.png
│       ├── icon-192x192.png
│       ├── icon-384x384.png
│       └── icon-512x512.png
```

## ⚠️ PENTING: PWA WAJIB PAKAI HTTPS
Service Worker hanya jalan di HTTPS (atau localhost untuk testing).
Kalau di-buka langsung dari file:// → SW tidak akan aktif.

## Opsi Deploy (GRATIS)

### 1. GitHub Pages (Paling Recommended)
1. Buat repo baru di GitHub (misal: `aturduit`)
2. Upload semua file ini ke repo
3. Pergi ke Settings → Pages → Source: `main branch / root`
4. URL akan jadi: `https://username.github.io/aturduit`
5. Buka URL itu di Chrome Android → menu ⋮ → "Tambahkan ke layar utama"

### 2. Netlify (Drag & Drop, 1 menit)
1. Buka https://netlify.com → login
2. Drag folder `aturduit-pwa` ke halaman Netlify
3. Dapat URL HTTPS langsung, misal: `https://aturduit-xxx.netlify.app`

### 3. Vercel
1. `npm i -g vercel`
2. Masuk folder: `cd aturduit-pwa`
3. Jalankan: `vercel`
4. Ikuti instruksi → dapat URL HTTPS

## Cara Install di Android (setelah deploy)
1. Buka URL di **Chrome Android**
2. Tunggu beberapa detik → muncul banner "Pasang AturDuit di HP"
3. Tap "Pasang" → konfirmasi
4. Icon AturDuit muncul di home screen ✅
5. Buka dari home screen → tampil full-screen tanpa address bar

## Testing Lokal (opsional)
```bash
# Perlu server HTTP, bukan buka file langsung
cd aturduit-pwa
python3 -m http.server 8080
# Buka http://localhost:8080
# SW aktif di localhost meski HTTP
```
