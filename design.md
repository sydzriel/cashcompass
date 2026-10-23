# Cash Compass - Design System & App Architecture

**Tema Utama:** Minimalis, Moden, Premium (Konsep "Hybrid Flat Design")
**Sasaran Pengguna:** Pelajar Universiti / Belia

---

## 1. Palet Warna (Color Palette)
* **Latar Belakang (Gradient):** `#FFFFFF` -> `#F4E8F8` -> `#E5D9F2` (Kelegapan/Opacity direndahkan supaya kad menyerlah)
* **Kad Maklumat:** `#FFFFFF` (Putih bersih)
* **Aksen Utama (Butang/Progress Bar):** `#fd5ca3` (Merah Jambu / Pink)
* **Teks Utama (Jumlah Baki, Nama Item):** `#0D0E15` (Hitam Gelap)
* **Teks Sekunder (Label, Kategori):** `#666666` (Kelabu)

## 2. Tipografi (Typography)
* **Fon Pilihan:** Plus Jakarta Sans / Inter / Poppins
* **Tajuk Besar (Jumlah Baki Utama / Cth: RM599):** 48px, Bold (Dipesarkan untuk hierarki yang lebih jelas)
* **Tajuk Sekunder (Header):** 24px, Semi-Bold
* **Teks Biasa (Nama Item):** 15px, Medium 
* **Teks Subtajuk (Kategori):** 14px, Regular

## 3. Garis Panduan UI (UI Guidelines)
* **Kad (Cards):** Tiada bayang tebal (*shadow-less*). Gunakan sempadan halus `borderWidth: 1` dengan warna `rgba(0, 0, 0, 0.04)` untuk efek terapung bersih.
* **Ruang & Jarak (Spacing):** Seragamkan jarak (contoh: `marginBottom: 16`) antara kad dan tajuk seksyen supaya tidak bersaing untuk perhatian.
* **Radius Sudut (Border Radius):** 18px untuk kad, bulat penuh untuk butang (27px).
* **Ruang Bawah (Padding):** Ruang bawah `paddingBottom: 110px` pada kawasan skrol utama bagi mengelakkan kandungan tertutup oleh bar navigasi bawah.

---

## 4. Pelan Pelaksanaan "Faktor Wow" FYP (Lokasi & UI)

### I. Auto-Spending Tracker (Notification Listener)
* **Fungsi:** Mengesan notifikasi SMS/Push dari Bank atau eWallet dan memasukkan perbelanjaan secara automatik.
* **Lokasi UI:** Berjalan di latar belakang. *Toast/Banner* kecil yang kemas akan muncul dari atas di **Skrin Utama (`index.jsx`)** (Cth: *"RM15 (Starbucks) ditambah secara automatik!"*).

### II. AI Receipt Scanner (Camera OCR)
* **Fungsi:** Mengimbas resit fizikal menggunakan kamera telefon untuk auto-isi borang transaksi.
* **Lokasi UI:** Diletakkan dalam **Borang Log Transaction** — butang ikon imbasan di bahagian atas kanan header dan butang pill *"Scan receipt"* di bawah paparan jumlah RM untuk auto-isi borang.

### III. Impulse Buy / 48-Hour Chill Calculator
* **Fungsi:** Alat menyekat pembelian ikut nafsu dengan mengira nilai barang kehendak berdasarkan bajet harian dan menetapkan pemasa *cool-down* 48 jam.
* **Lokasi UI:** Akses melalui **Butang Tambah (+)** dan dipantau di tab/kad khas dalam **Skrin Transaksi (`transactions.jsx`)**.

### IV. AI Financial Coach (Live Chat Modal)
* **Fungsi:** AI Assistant yang memberi nasihat kewangan berasaskan corak perbelanjaan semasa pengguna.
* **Lokasi UI:** Butang *pill* berprestij `🤖 Talk to Coach` di bahagian atas **Skrin Insights (`insights.jsx`)** yang membuka *Full-Screen Chat Modal*.
