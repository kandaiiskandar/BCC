# 04 — Development

Semua yang berkaitan dengan pembangunan teknikal sistem Dashboard Jualan Kop-Pusamaju.

**Engineer:** Iskandar  
**PM:** —  
**Fasa Semasa:** Fasa 1 — MVP

---

## Struktur Folder

```
04_development/
│
├── specs/                        # Spesifikasi teknikal untuk engineer
│   ├── technical-spec.md         # Spesifikasi teknikal penuh
│   ├── user-stories.md           # User stories mengikut peranan
│   ├── data-model.md             # Struktur database & model data
│   └── api-spec.md               # Spesifikasi API endpoint
│
├── docs/                         # Dokumentasi teknikal semasa development
│   ├── architecture.md           # Keputusan seni bina sistem
│   ├── tech-stack.md             # Stack teknologi & sebab pemilihan
│   └── dev-notes.md              # Nota engineer semasa development
│
├── src/                          # Source code
│   ├── components/               # Komponen UI yang boleh guna semula
│   ├── pages/                    # Halaman utama sistem
│   ├── data/                     # Data sample / mock data
│   ├── utils/                    # Helper functions
│   └── assets/                   # Imej, ikon, logo
│
└── README.md                     # Fail ini
```

---

## Status Fail

| Fail | Status |
|---|---|
| `specs/technical-spec.md` | 🔜 Dalam proses |
| `specs/user-stories.md` | ⬜ Belum dibuat |
| `specs/data-model.md` | ⬜ Belum dibuat |
| `specs/api-spec.md` | ⬜ Belum dibuat |
| `docs/architecture.md` | ⬜ Belum dibuat |
| `docs/tech-stack.md` | ⬜ Belum dibuat |
| `src/` | ⬜ Belum dibuat |

---

## Peraturan Penting

- **PM** menulis semua fail dalam `specs/` — ini adalah keperluan yang engineer kena ikut
- **Engineer** menulis semua fail dalam `docs/` dan `src/`
- Sebarang perubahan keperluan mesti diluluskan PM dahulu sebelum engineer ubah kod
- Jangan campur fail development dengan fail projek lain (discovery, admin, dll.)
