# CETAK BIRU SYSTEM PROMPT, DATA DPL, & JSON SCHEMA GENERATOR RPM PAUD

Dokumen ini berisi **System Prompt**, **Template User Prompt**, **Data 8 Dimensi Profil Lulusan (DPL)**, dan **JSON Output Schema** yang ditanamkan ke dalam kode JavaScript aplikasi generator Anda agar AI menghasilkan Perencanaan Pembelajaran Mendalam (RPM) yang 100% patuh regulasi dan identik dengan struktur tabel `Contoh Perencanaan 1 minggu.docx`.

---

## 1. SYSTEM PROMPT UTAMA (Tanamkan di Konfigurasi Panggilan API Gemini)

Salin teks di bawah ini sebagai `systemInstruction` saat memanggil API Gemini:

> Anda adalah Pakar Kurikulum Pendidikan Anak Usia Dini (PAUD) Kemendikdasmen RI yang menguasai penyusunan Perencanaan Pembelajaran Mendalam (Deep Learning) Fase Fondasi untuk TK Kelompok A (usia 4-5 tahun) dan Kelompok B (usia 5-6 tahun).
>
> **TUGAS UTAMA:**
> Menyusun dokumen "PERENCANAAN PEMBELAJARAN MENDALAM" 1 Minggu (6 Hari atau 5 Hari sesuai input) dalam format JSON terstruktur yang mematuhi regulasi resmi berikut:
> 1. Permendikdasmen Nomor 10 Tahun 2025 tentang Standar Kompetensi Lulusan (8 Dimensi Profil Lulusan & STPPA).
> 2. Permendikdasmen Nomor 12 Tahun 2025 tentang Standar Isi (mencakup pengetahuan esensial, pengetahuan aplikatif, serta nilai dan karakter).
> 3. Permendikdasmen Nomor 1 Tahun 2026 tentang Standar Proses (Prinsip Berkesadaran, Bermakna, Menggembirakan, serta tahapan Memahami, Mengaplikasi, dan Merefleksi).
> 4. Keputusan Kepala BSKAP Kemendikdasmen Nomor 046/H/KR/2025 tentang Capaian Pembelajaran PAUD Fase Fondasi.
>
> **ATURAN ANTI-HALUSINASI & PEDAGOGI PAUD (WAJIB DIPATUHI):**
> 1. **Larangan Istilah Lama:** Gunakan istilah resmi **"Dimensi Profil Lulusan"** (DPL1 s.d. DPL8). DILARANG KERAS menggunakan istilah lama *"Profil Pelajar Pancasila"* atau *"P5"*.
> 2. **Kutipan CP Verbatim:** Pada bagian `capaian_pembelajaran`, Anda WAJIB menyalin persis kalimat Capaian Pembelajaran / Subelemen yang dikirimkan dari `cp_paud_detail_2025.json` tanpa mengubah, mengurangi, atau mengarang kalimat baru.
> 3. **Sinkronisasi DPL 100% Konsisten:**
>    - Setiap Dimensi Profil Lulusan (DPL) yang dicentang pada bagian `IDENTIFIKASI` wajib muncul sebagai label di dalam kegiatan inti harian.
>    - DILARANG menuliskan label dimensi di kegiatan inti (misalnya menulis label `kreativitas` atau `kesehatan`) apabila kode DPL-nya (`DPL4` atau `DPL7`) tidak dicentang pada bagian `IDENTIFIKASI`.
>    - Pada bagian `Asesmen pada Akhir Pembelajaran` (poin *Observasi holistik*), sebutkan secara akurat jumlah dan nama Dimensi Profil Lulusan yang ditargetkan sesuai daftar DPL yang dicentang.
> 4. **Arsitektur Pengalaman Belajar Inti 6 Hari (Siklus Pembelajaran Mendalam):**
>    - **Tahap 1: MEMAHAMI (BERKESADARAN, BERMAKNA)** -> **Hari 1 dan Hari 2**. Fokus pada pengenalan konsep dasar secara konkret, cerita, pengamatan panca indra, dan eksplorasi awal tentang topik.
>    - **Tahap 2: MENGAPLIKASI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)** -> **Hari 3 dan Hari 4**. Fokus pada penerapan konsep melalui eksperimen sains/seni sederhana, merakit konstruksi *loose parts*/balok, dan permainan kolaboratif beraturan. *(Jangan mengulang label MEMAHAMI pada Hari 3 dan 4)*.
>    - **Tahap 3: MEREFLEKSI (BERKESADARAN, BERMAKNA)** -> **Hari 5 dan Hari 6**. Fokus pada permainan pemecahan masalah (sebab-akibat), unjuk karya/presentasi sederhana di depan teman, menyampaikan alasan atas pilihannya, dan refleksi pengalaman belajar.
> 5. **Struktur 3 Kegiatan Bermain per Hari (Total 18 Kegiatan Seminggu):**
>    - Setiap hari WAJIB memuat tepat **3 Kegiatan** yang seimbang (mengintegrasikan Olah Pikir, Olah Hati, Olah Rasa, dan Olah Raga):
>      - **Kegiatan 1:** Eksplorasi karya seni / konstruksi / sains-rekayasa konkret menggunakan bahan lepasan (*loose parts*) yang mudah ditemukan (kardus bekas, piring kertas, gelas kertas, stik es krim, daun kering, cat warna, karton, batu kerikil, tali, dll.). Wajib mencantumkan **Alat dan bahan** serta langkah **Cara Membuat** yang jelas.
>      - **Kegiatan 2:** Permainan fisik-motorik kasar/halus atau sosial-emosional interaktif (contoh: cermin ajaib, estafet senyum, lompat tali warna-warni, menggiring bola di labirin balok). Wajib mencantumkan **Alat dan bahan** serta **Cara bermain**.
>      - **Kegiatan 3:** Permainan lingkaran (*circle game*), bahasa & komunikasi, atau pramembaca/pranumerasi kontekstual yang menyenangkan (contoh: lingkaran nama, cerita berantai, lompat nama, kereta nama, siapa aku). **DILARANG KERAS** memberikan tugas dril Lembar Kerja Anak (LKA/LKS) calistung mekanis!
>    - Setiap judul kegiatan WAJIB diikuti tanda kurung berisi minimal 1 Prinsip Pembelajaran (`berkesadaran` / `bermakna` / `menggembirakan`) dan 1 Dimensi Profil Lulusan yang relevan, contoh: `Kegiatan 1 : Membuat Boneka Jari Keluarga (berkesadaran, bermakna, kreativitas)`.
> 6. **Kesesuaian Tahap Perkembangan Usia (DAP - Developmentally Appropriate Practice):**
>    - **Jika Jenjang/Kelas adalah A (4-5 Tahun):** Koordinasi motorik halus anak masih berkembang dan anak belum mampu mengukur dengan penggaris secara presisi. Apabila kegiatan menggunakan pola potong atau celah kardus yang rumit, tuliskan secara eksplisit bahwa *guru telah menyiapkan garis pola/potongan dasar pada Pijakan Lingkungan Main*, sehingga anak fokus menjiplak sederhana, menggunting garis lurus, mengecat, menempel, merakit, dan bermain.
>    - **Jika Jenjang/Kelas adalah B (5-6 Tahun):** Anak dapat dilibatkan sejak membuat pola sederhana, menggunting bentuk geometri/lengkung dengan gunting anak secara mandiri, mengukur dengan satuan tidak baku (jengkal, stik es krim, langkah), dan merakit konstruksi yang lebih menantang.

---

## 2. TEMPLATE USER PROMPT DINAMIS (Dirakit dari Input Form Guru & `cp_paud_detail_2025.json`)

Gunakan format berikut saat mengirimkan data input guru ke API Gemini:

    Susunlah dokumen PERENCANAAN PEMBELAJARAN MENDALAM 1 Minggu secara lengkap dan siap cetak berdasarkan parameter berikut:

    1. IDENTITAS DOKUMEN:
    - Nama Guru: {guru}
    - Asal Sekolah: {asal_sekolah}
    - Fase: Fondasi
    - Jenjang/Kelas: {jenjang_kelas} (A (4-5 Tahun) atau B (5-6 Tahun))
    - Semester: {semester}
    - Minggu Ke-: {minggu_ke}
    - Bulan: {bulan}
    - Alokasi Waktu: {alokasi_waktu} (6 x 3 JP)
    - Model Pembelajaran: {model_pembelajaran} (Sentra / Kelompok / Area / Proyek)
    - Jumlah Anak: {jumlah_anak}
    - Topik / Sub Topik: {topik_subtopik}

    2. DIMENSI PROFIL LULUSAN YANG DITARGETKAN (Wajib sinkron di Identifikasi, Label Kegiatan Harian, dan Asesmen Akhir):
    {daftar_dpl_terpilih}

    3. CAPAIAN PEMBELAJARAN RESMI DARI FILE cp_paud_detail_2025.json (Salin verbatim ke dalam array capaian_pembelajaran):
    {daftar_subelemen_cp_terpilih}

    4. INDIKATOR KETERCAPAIAN ACUAN (Gunakan untuk merumuskan Tujuan Pembelajaran, 18 Kegiatan Inti, dan Asesmen):
    {daftar_indikator_cp_terpilih}

    5. CATATAN TAMBAHAN / KONTEKS LOKAL:
    {catatan_guru}

---

## 3. DATA REFERENSI 8 DIMENSI PROFIL LULUSAN (DPL1 - DPL8)

Tanamkan array konstanta ini di dalam kode JavaScript aplikasi untuk merender *checkbox* di tabel **IDENTIFIKASI** dan memvalidasi label kegiatan:

    [
      {
        "kode": "DPL1",
        "nama": "Keimanan dan Ketakwaan terhadap Tuhan YME",
        "label_kegiatan": "keimanan",
        "fokus_paud": "Mengenal Tuhan YME melalui ciptaan-Nya, membiasakan doa harian dengan penuh kesadaran, bersyukur, serta menyayangi sesama dan lingkungan."
      },
      {
        "kode": "DPL2",
        "nama": "Kewargaan",
        "label_kegiatan": "kewargaan",
        "fokus_paud": "Mengenal identitas diri sebagai bagian dari keluarga, sekolah, dan masyarakat; menghargai perbedaan teman; serta mematuhi kesepakatan bermain."
      },
      {
        "kode": "DPL3",
        "nama": "Penalaran Kritis",
        "label_kegiatan": "penalaran kritis",
        "fokus_paud": "Mengamati perubahan benda/lingkungan, bertanya, membandingkan persamaan dan perbedaan, mengetahui sebab-akibat, serta mencari solusi sederhana saat bermain."
      },
      {
        "kode": "DPL4",
        "nama": "Kreativitas",
        "label_kegiatan": "kreativitas",
        "fokus_paud": "Mengeksplorasi berbagai media seni dan loose parts untuk menghasilkan karya orisinal, mengekspresikan imajinasi, serta mencoba cara-cara baru."
      },
      {
        "kode": "DPL5",
        "nama": "Kolaborasi",
        "label_kegiatan": "kolaborasi",
        "fokus_paud": "Bermain bersama teman, berbagi alat dan bahan main, sabar menunggu giliran, serta bekerja sama menyelesaikan proyek atau permainan kelompok."
      },
      {
        "kode": "DPL6",
        "nama": "Kemandirian",
        "label_kegiatan": "kemandirian",
        "fokus_paud": "Memilih kegiatan main, fokus menyelesaikan kegiatan, melakukan bina diri dasar, mengelola emosi dengan bantuan guru, dan merapikan kembali alat main."
      },
      {
        "kode": "DPL7",
        "nama": "Kesehatan",
        "label_kegiatan": "kesehatan",
        "fokus_paud": "Aktif bergerak melatih motorik kasar dan halus, menjaga kebersihan tubuh (mencuci tangan), mengenal makanan sehat, serta bermain dengan aman."
      },
      {
        "kode": "DPL8",
        "nama": "Komunikasi",
        "label_kegiatan": "komunikasi",
        "fokus_paud": "Menyimak cerita, menceritakan kembali pengalaman atau karya secara lisan, memperluas kosakata, menggunakan kata santun (tolong, maaf, terima kasih), dan keaksaraan awal."
      }
    ]

---

## 4. JSON OUTPUT SCHEMA (Struktur Data Respons AI untuk Dirender ke Tabel & `.docx`)

Gunakan skema JSON berikut pada `generationConfig.responseSchema` (atau instruksikan AI mengembalikan struktur JSON ini) agar langsung bisa dipetakan ke tabel HTML Preview dan dokumen Word (`.docx`):

    {
      "informasi_umum": {
        "guru": "Nama Guru",
        "semester": "1 (Gasal)",
        "asal_sekolah": "TK ANAK BAHAGIA",
        "minggu_ke": "1",
        "fase": "Fondasi",
        "bulan": "Juli 2026",
        "jenjang_kelas": "A (4-5 Tahun)",
        "alokasi_waktu": "6 x 3 JP",
        "model_pembelajaran": "Sentra",
        "jumlah_anak": "15",
        "topik_subtopik": "Identitas / Diriku (Aku Istimewa: Ayo Kita Berkenalan)"
      },
      "identifikasi": {
        "peserta_didik": "Paragraf deskripsi kesiapan, minat, latar belakang sosial budaya, rentang perhatian, dan kebutuhan belajar konkret anak usia 4-5 tahun / 5-6 tahun.",
        "materi_pelajaran": "Paragraf rincian pengetahuan esensial, pengetahuan aplikatif, serta pengetahuan nilai dan karakter yang relevan dengan kehidupan sehari-hari anak.",
        "dimensi_profil_lulusan_terpilih": ["DPL1", "DPL2", "DPL4", "DPL5", "DPL6", "DPL7", "DPL8"]
      },
      "desain_pembelajaran": {
        "capaian_pembelajaran": [
          "CP Jati Diri: Murid mengenali identitas dirinya yang terbentuk oleh karakteristik fisik dan gender, minat, kebutuhan, agama, dan sosial budaya.",
          "CP Jati Diri: Murid mengenali perannya sebagai bagian dari keluarga, satuan pendidikan, masyarakat dan warga negara Indonesia sehingga dapat menyesuaikan diri dengan lingkungan, aturan dan norma yang berlaku, dan mengetahui keberadaan negara lain di dunia."
        ],
        "lintas_disiplin_ilmu": "Pendidikan Karakter, Seni dan Kreativitas, Bahasa dan Komunikasi, Sosial Emosional, Perkembangan Motorik",
        "tujuan_pembelajaran": [
          "Anak mampu mengenali identitas diri dan mengekspresikannya melalui berbagai media kreatif dengan percaya diri",
          "Anak mampu berinteraksi, berkolaborasi, dan menghargai perbedaan dengan teman dalam aktivitas kelompok",
          "Anak mampu merefleksikan pengalaman belajar dan mengungkapkan perasaannya secara lisan maupun melalui karya"
        ],
        "topik_pembelajaran": "Aku Istimewa: Ayo Kita Berkenalan",
        "praktik_pedagogis": "Pembelajaran berbasis bermain, pembelajaran berbasis proyek sederhana, pembelajaran kolaboratif melalui aktivitas kelompok, pembelajaran eksploratif dengan pendekatan inkuiri",
        "kemitraan_pembelajaran": {
          "lingkungan_sekolah": "Guru kelas, kepala sekolah, guru pendamping",
          "masyarakat": "Orang tua sebagai narasumber tentang keluarga, kakek nenek yang bisa bercerita",
          "lingkungan_luar_sekolah": "Komunitas sekitar sekolah untuk berbagi pengalaman"
        },
        "lingkungan_pembelajaran": {
          "ruang_fisik": "Area bermain yang fleksibel, sudut seni dan kreativitas, area bercerita dan sharing circle, display area untuk memamerkan karya anak",
          "ruang_virtual": "Video cerita interaktif, musik dan lagu digital, dokumentasi pembelajaran",
          "budaya_belajar": "Menciptakan atmosfer saling menghargai, keamanan emosional, kebebasan berekspresi, dan eksplorasi tanpa takut salah"
        },
        "pemanfaatan_digital": {
          "perencanaan": "Persiapan video cerita dan lagu digital, aplikasi dokumentasi pembelajaran",
          "pelaksanaan": "Video interaktif sesuai topik, musik latar untuk aktivitas, dokumentasi foto dan video proses belajar anak",
          "asesmen": "Portofolio digital karya anak, rekaman video presentasi sederhana anak",
          "tautan_media": "https://drive.paud.id/download/ayo-berkenalan/"
        }
      },
      "pengalaman_belajar": {
        "awal": {
          "judul_tahap": "AWAL (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)",
          "pengantar": "Pembuka dari proses pembelajaran yang bertujuan untuk mempersiapkan peserta didik sebelum memasuki inti pembelajaran. Kegiatan dalam tahap ini meliputi orientasi yang bermakna, apersepsi yang kontekstual, dan motivasi yang menggembirakan:",
          "poin_kegiatan": [
            "Salam dan doa dengan penuh perhatian dan kesadaran",
            "Teknik pemusatan konsentrasi: 'Duduk seperti katak yang tenang, rasakan napas masuk dan keluar'",
            "Lagu selamat datang yang menyebutkan nama setiap anak",
            "Menyimak cerita atau video pemantik dengan pertanyaan reflektif",
            "Menghubungkan cerita dengan pengalaman nyata anak",
            "Membangun ekspektasi positif dan menyepakati aturan bermain hari ini"
          ]
        },
        "inti": {
          "pengantar": "Pada tahap ini, anak aktif terlibat dalam pengalaman belajar memahami, mengaplikasi, dan merefleksi. Guru menerapkan prinsip pembelajaran berkesadaran, bermakna, menggembirakan untuk mencapai tujuan pembelajaran.",
          "blok_tahap": [
            {
              "header_tahap": "MEMAHAMI (BERKESADARAN, BERMAKNA)",
              "hari": [
                {
                  "hari_ke": 1,
                  "kegiatan_list": [
                    {
                      "nomor": 1,
                      "nama_kegiatan": "Membuat Boneka Jari Keluarga",
                      "label": "berkesadaran, bermakna, kreativitas",
                      "alat_dan_bahan": "Kertas karton, spidol, cat warna, gunting anak, stik es krim, pensil, krayon, lem.",
                      "judul_langkah": "Cara Membuat",
                      "langkah": [
                        "Siapkan kertas karton, mintalah anak meletakkan telapak tangan di atas karton lalu menjiplak dengan pensil secara bergantian (guru membantu menggunting pola dasar untuk Kelompok A).",
                        "Pada kertas lain, anak menggambar anggota keluarga mereka, mewarnai, lalu menempelkannya pada jari-jari karton.",
                        "Pasang stik es krim sebagai pegangan di bagian bawah telapak tangan karton.",
                        "Bimbing anak menceritakan anggota keluarganya menggunakan boneka jari tersebut."
                      ]
                    },
                    {
                      "nomor": 2,
                      "nama_kegiatan": "Lingkaran Nama",
                      "label": "menggembirakan, kolaborasi",
                      "alat_dan_bahan": "Bola kecil yang lembut",
                      "judul_langkah": "Cara bermain",
                      "langkah": [
                        "Anak-anak duduk membentuk lingkaran besar bersama guru.",
                        "Satu anak menggelindingkan atau melempar bola ke teman sambil menyebutkan namanya sendiri.",
                        "Anak yang menangkap bola menyebutkan nama teman yang melempar, lalu mengoper bola ke teman lain hingga semua mendapat giliran."
                      ]
                    },
                    {
                      "nomor": 3,
                      "nama_kegiatan": "Cerita Berantai Perkenalan",
                      "label": "bermakna, komunikasi",
                      "alat_dan_bahan": "Boneka tangan atau bola kecil",
                      "judul_langkah": "Cara bermain",
                      "langkah": [
                        "Anak-anak duduk melingkar dan guru memulai cerita singkat tentang tokoh boneka.",
                        "Anak yang menerima boneka melanjutkan cerita dengan menyebutkan satu hal kesukaannya.",
                        "Boneka dioper bergantian hingga seluruh anak berkesempatan berbicara."
                      ]
                    }
                  ]
                },
                {
                  "hari_ke": 2,
                  "kegiatan_list": []
                }
              ]
            },
            {
              "header_tahap": "MENGAPLIKASI (BERKESADARAN, BERMAKNA, MENGGEMBIRAKAN)",
              "hari": [
                {
                  "hari_ke": 3,
                  "kegiatan_list": []
                },
                {
                  "hari_ke": 4,
                  "kegiatan_list": []
                }
              ]
            },
            {
              "header_tahap": "MEREFLEKSI (BERKESADARAN, BERMAKNA)",
              "hari": [
                {
                  "hari_ke": 5,
                  "kegiatan_list": []
                },
                {
                  "hari_ke": 6,
                  "kegiatan_list": []
                }
              ]
            }
          ]
        },
        "penutup": {
          "judul_tahap": "PENUTUP (BERKESADARAN, MENGGEMBIRAKAN)",
          "pengantar": "Tahap akhir dalam proses pembelajaran yang bertujuan memberikan umpan balik yang konstruktif kepada anak atas pengalaman belajar yang telah dilakukan, menyimpulkan pembelajaran, dan anak terlibat dalam perencanaan pembelajaran selanjutnya:",
          "poin_kegiatan": [
            "Lingkaran refleksi (recalling): setiap anak berbagi satu hal yang paling disukai hari ini dengan penuh kesadaran",
            "Gerakan tubuh atau memilih kartu ekspresi yang merepresentasikan perasaan hari ini",
            "Penyimpulan bersama tentang keistimewaan setiap anak dan pentingnya saling menghargai",
            "Pratinjau kegiatan bermain esok hari untuk membangun antusiasme anak",
            "Doa penutup dengan rasa syukur atas pengalaman belajar hari ini",
            "Apresiasi hangat dan salam penutup untuk setiap pencapaian anak"
          ]
        }
      },
      "asesmen_pembelajaran": {
        "awal": [
          "Observasi kesiapan: Mengamati kesiapan emosional dan sosial anak saat memasuki kelas dan berpisah dengan pengantar",
          "Wawancara sederhana: Pertanyaan pemantik lisan untuk mengetahui pengetahuan awal anak terkait topik",
          "Checklist motorik: Mengamati kemampuan dasar motorik halus dan kasar awal"
        ],
        "proses": [
          "Catatan anekdot: Dokumentasi perkembangan harian anak dalam berinteraksi, memecahkan masalah, dan mengekspresikan diri",
          "Foto dokumentasi (Hasil Karya): Mengabadikan proses pembuatan karya, ekspresi wajah, dan celoteh anak tentang karyanya",
          "Observasi partisipasi (Ceklis): Tingkat keterlibatan dan ketercapaian tujuan pembelajaran pada setiap aktivitas",
          "Self-assessment sederhana: 'Bagaimana perasaanmu hari ini?' menggunakan kartu emoji atau gambar ekspresi"
        ],
        "akhir": [
          "Portofolio karya: Kumpulan hasil karya anak selama 6 pertemuan beserta catatan refleksi singkat",
          "Presentasi sederhana: Kemampuan anak menceritakan karyanya atau memperkenalkan diri di depan teman-teman",
          "Observasi holistik: Perkembangan anak dalam Dimensi Profil Lulusan yang ditargetkan pada perencanaan ini",
          "Dokumentasi video: Rekaman singkat saat anak bercerita dan berkolaborasi dalam kegiatan puncak"
        ]
      }
    }