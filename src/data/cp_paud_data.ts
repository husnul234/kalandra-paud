export interface SubelemenCP {
  kode: string;
  subelemen: string;
  indikator_ketercapaian: string[];
}

export interface ElemenCP {
  nama_elemen: string;
  deskripsi_utuh_cp: string;
  subelemen: SubelemenCP[];
}

export interface DPLItem {
  kode: string;
  nama: string;
  label_kegiatan: string;
  fokus_paud: string;
}

export const DATA_8_DPL: DPLItem[] = [
  {
    kode: "DPL1",
    nama: "Keimanan dan Ketakwaan terhadap Tuhan YME",
    label_kegiatan: "keimanan",
    fokus_paud: "Mengenal Tuhan YME melalui ciptaan-Nya, membiasakan doa harian dengan penuh kesadaran, bersyukur, serta menyayangi sesama dan lingkungan."
  },
  {
    kode: "DPL2",
    nama: "Kewargaan",
    label_kegiatan: "kewargaan",
    fokus_paud: "Mengenal identitas diri sebagai bagian dari keluarga, sekolah, dan masyarakat; menghargai perbedaan teman; serta mematuhi kesepakatan bermain."
  },
  {
    kode: "DPL3",
    nama: "Penalaran Kritis",
    label_kegiatan: "penalaran kritis",
    fokus_paud: "Mengamati perubahan benda/lingkungan, bertanya, membandingkan persamaan dan perbedaan, mengetahui sebab-akibat, serta mencari solusi sederhana saat bermain."
  },
  {
    kode: "DPL4",
    nama: "Kreativitas",
    label_kegiatan: "kreativitas",
    fokus_paud: "Mengeksplorasi berbagai media seni dan loose parts untuk menghasilkan karya orisinal, mengekspresikan imajinasi, serta mencoba cara-cara baru."
  },
  {
    kode: "DPL5",
    nama: "Kolaborasi",
    label_kegiatan: "kolaborasi",
    fokus_paud: "Bermain bersama teman, berbagi alat dan bahan main, sabar menunggu giliran, serta bekerja sama menyelesaikan proyek atau permainan kelompok."
  },
  {
    kode: "DPL6",
    nama: "Kemandirian",
    label_kegiatan: "kemandirian",
    fokus_paud: "Memilih kegiatan main, fokus menyelesaikan kegiatan, melakukan bina diri dasar, mengelola emosi dengan bantuan guru, dan merapikan kembali alat main."
  },
  {
    kode: "DPL7",
    nama: "Kesehatan",
    label_kegiatan: "kesehatan",
    fokus_paud: "Aktif bergerak melatih motorik kasar dan halus, menjaga kebersihan tubuh (mencuci tangan), mengenal makanan sehat, serta bermain dengan aman."
  },
  {
    kode: "DPL8",
    nama: "Komunikasi",
    label_kegiatan: "komunikasi",
    fokus_paud: "Menyimak cerita, menceritakan kembali pengalaman atau karya secara lisan, memperluas kosakata, menggunakan kata santun (tolong, maaf, terima kasih), dan keaksaraan awal."
  }
];

export const MASTER_CP_PAUD: ElemenCP[] = [
  {
    nama_elemen: "Nilai Agama dan Budi Pekerti",
    deskripsi_utuh_cp: "Murid percaya kepada Tuhan Yang Maha Esa sebagai pencipta dirinya, makhluk lain dan alam, serta mulai mengenal dan mempraktikkan ajaran pokok sesuai dengan agama dan kepercayaannya; menghargai diri sendiri dan memiliki rasa syukur terhadap Tuhan YME sehingga dapat berpartisipasi aktif dalam menjaga kebersihan, kesehatan, dan keselamatan dirinya; menghargai sesama manusia dengan berbagai perbedaannya sehingga mempraktikkan perilaku baik dan berakhlak mulia; dan menghargai alam dan seluruh makhluk hidup ciptaan Tuhan Yang Maha Esa.",
    subelemen: [
      {
        kode: "NABP-1",
        subelemen: "Murid percaya kepada Tuhan Yang Maha Esa sebagai pencipta dirinya, makhluk lain dan alam, serta mulai mengenal dan mempraktikkan ajaran pokok sesuai dengan agama dan kepercayaannya.",
        indikator_ketercapaian: [
          "Mengenal nama Tuhan dan ciptaan-Nya",
          "Mengenal dan menirukan doa atau ibadah pokok harian sesuai agamanya",
          "Menunjukkan rasa syukur atas nikmat yang diterima"
        ]
      },
      {
        kode: "NABP-2",
        subelemen: "Murid menghargai diri sendiri dan memiliki rasa syukur terhadap Tuhan YME sehingga dapat berpartisipasi aktif dalam menjaga kebersihan, kesehatan, dan keselamatan dirinya.",
        indikator_ketercapaian: [
          "Mencuci tangan dan merawat kebersihan tubuh secara mandiri",
          "Memilih makanan dan minuman yang bersih dan sehat",
          "Mengenali situasi berbahaya dan menjaga keselamatan diri"
        ]
      },
      {
        kode: "NABP-3",
        subelemen: "Murid menghargai sesama manusia dengan berbagai perbedaannya sehingga mempraktikkan perilaku baik dan berakhlak mulia.",
        indikator_ketercapaian: [
          "Menghargai teman yang memiliki perbedaan fisik, agama, atau kebiasaan",
          "Menggunakan kata tolong, maaf, dan terima kasih secara wajar",
          "Berbagi, bergiliran, dan bekerja sama dalam kegiatan bermain"
        ]
      },
      {
        kode: "NABP-4",
        subelemen: "Murid menghargai alam dan seluruh makhluk hidup ciptaan Tuhan Yang Maha Esa.",
        indikator_ketercapaian: [
          "Menyayangi hewan dan merawat tanaman di sekitar",
          "Membuang sampah pada tempatnya dan menjaga kelestarian lingkungan bermain"
        ]
      }
    ]
  },
  {
    nama_elemen: "Jati Diri",
    deskripsi_utuh_cp: "Murid mengenali identitas dirinya yang terbentuk oleh karakteristik fisik dan gender, minat, kebutuhan, agama, dan sosial budaya; mengenali kebiasaan-kebiasaan di lingkungan keluarga, satuan pendidikan, dan masyarakat; mengenali, mengekspresikan, dan mengelola emosi diri, serta membangun hubungan sosial secara sehat; mengenali perannya sebagai bagian dari keluarga, satuan pendidikan, masyarakat dan warga negara Indonesia sehingga dapat menyesuaikan diri dengan lingkungan, aturan dan norma yang berlaku, dan mengetahui keberadaan negara lain di dunia; serta memiliki fungsi gerak (motorik kasar, halus, dan taktil) untuk merawat dirinya, membangun kemandirian dan berkegiatan.",
    subelemen: [
      {
        kode: "JD-1",
        subelemen: "Murid mengenali identitas dirinya yang terbentuk oleh karakteristik fisik dan gender, minat, kebutuhan, agama, dan sosial budaya.",
        indikator_ketercapaian: [
          "Menyebutkan nama, jenis kelamin, ciri fisik diri dengan percaya diri",
          "Mengenali dan mengungkapkan hal-hal yang disukai dan dibutuhkannya",
          "Menunjukkan rasa bangga atas identitas budaya keluarganya"
        ]
      },
      {
        kode: "JD-2",
        subelemen: "Murid mengenali kebiasaan-kebiasaan di lingkungan keluarga, satuan pendidikan, dan masyarakat.",
        indikator_ketercapaian: [
          "Mengenal aturan dan kebiasaan baik di rumah dan di sekolah",
          "Menyesuaikan perilaku sesuai aturan yang telah disepakati",
          "Mengenal perayaan hari besar keagamaan atau tradisi lokal"
        ]
      },
      {
        kode: "JD-3",
        subelemen: "Murid mengenali, mengekspresikan, dan mengelola emosi diri, serta membangun hubungan sosial secara sehat.",
        indikator_ketercapaian: [
          "Mengenali berbagai jenis emosi (senang, sedih, marah, takut)",
          "Mengekspresikan emosi secara wajar dan mulai belajar menenangkan diri",
          "Menunjukkan empati dan membina pertemanan positif"
        ]
      },
      {
        kode: "JD-4",
        subelemen: "Murid mengenali perannya sebagai bagian dari keluarga, satuan pendidikan, masyarakat dan warga negara Indonesia sehingga dapat menyesuaikan diri dengan lingkungan, aturan dan norma yang berlaku, dan mengetahui keberadaan negara lain di dunia.",
        indikator_ketercapaian: [
          "Mengenal simbol-simbol negara (Bendera Merah Putih, lagu kebangsaan)",
          "Menunjukkan rasa cinta tanah air melalui bahasa dan budaya Indonesia",
          "Mengetahui bahwa ada negara-negara lain dengan budaya yang berbeda"
        ]
      },
      {
        kode: "JD-5",
        subelemen: "Murid memiliki fungsi gerak (motorik kasar, halus, dan taktil) untuk merawat dirinya, membangun kemandirian dan berkegiatan.",
        indikator_ketercapaian: [
          "Melakukan gerakan motorik kasar terkoordinasi (berlari, melompat, melempar, menyeimbangkan)",
          "Menggunakan jari-jemari untuk kegiatan motorik halus (meremas, melipat, menggunting, meronce)",
          "Mengeksplorasi tekstur sensori dan merawat kebutuhan diri mandiri"
        ]
      }
    ]
  },
  {
    nama_elemen: "Dasar-Dasar Literasi, Matematika, Sains, Teknologi, Rekayasa, dan Seni (STEAM)",
    deskripsi_utuh_cp: "Murid memiliki kemampuan literasi dasar untuk memahami dan menyampaikan gagasan melalui berbagai media; memiliki pemahaman matematis awal tentang pola, bentuk, bilangan, dan pengukuran; memiliki rasa ingin tahu saintifik melalui eksplorasi alam dan lingkungan; mampu menggunakan teknologi sederhana dan rekayasa kreatif; serta mengekspresikan diri melalui karya seni orisinal.",
    subelemen: [
      {
        kode: "STEAM-1",
        subelemen: "Murid mengenali dan memahami berbagai informasi, mengomunikasikan perasaan dan pikiran secara lisan, tulisan, atau menggunakan berbagai media serta membangun percakapan.",
        indikator_ketercapaian: [
          "Menyimak dan menanggapi pembicaraan orang lain secara santun",
          "Menceritakan kembali isi cerita yang didengar dengan kalimat sendiri",
          "Mengenali simbol huruf, bunyi huruf, dan keaksaraan awal kontekstual"
        ]
      },
      {
        kode: "STEAM-2",
        subelemen: "Murid menunjukkan minat, kegemaran, dan berpartisipasi dalam kegiatan pramembaca dan pramenulis.",
        indikator_ketercapaian: [
          "Memegang buku dengan benar dan menunjukkan ketertarikan pada gambar/tulisan",
          "Membuat coretan bermakna atau meniru bentuk tulisan dengan media konkret",
          "Menceritakan ide/gambar buatannya kepada teman atau guru"
        ]
      },
      {
        kode: "STEAM-3",
        subelemen: "Murid mengenali dan menggunakan konsep pramatematika untuk memecahkan masalah di dalam kehidupan sehari-hari.",
        indikator_ketercapaian: [
          "Mengenal konsep bilangan, menghitung benda secara korespondensi satu-satu",
          "Mengenal bentuk geometri, ukuran (besar-kecil, panjang-pendek), dan pola serial",
          "Mengelompokkan benda berdasarkan warna, ukuran, atau fungsi"
        ]
      },
      {
        kode: "STEAM-4",
        subelemen: "Murid menunjukkan kemampuan berpikir kritis, kreatif, dan kolaboratif melalui eksplorasi alam, sains sederhana, dan pemecahan masalah.",
        indikator_ketercapaian: [
          "Mengamati perubahan benda atau fenomena alam sederhana",
          "Mengajukan pertanyaan 'mengapa' dan 'bagaimana' dengan rasa ingin tahu",
          "Mencoba mencari cara alternatif saat menghadapi kesulitan bermain"
        ]
      },
      {
        kode: "STEAM-5",
        subelemen: "Murid mengeksplorasi berbagai media seni, teknologi sederhana, dan material lepasan (loose parts) untuk merancang karya inovatif.",
        indikator_ketercapaian: [
          "Menciptakan karya seni dua atau tiga dimensi dengan bahan loose parts",
          "Mengenal dan menggunakan alat bantu sederhana secara aman",
          "Mengekspresikan ide imajinatif melalui gerak tari, musik, atau bermain peran"
        ]
      }
    ]
  }
];

export const REKOMENDASI_LOOSE_PARTS = [
  "Kardus bekas berbagai ukuran & bentuk",
  "Piring kertas & gelas kertas",
  "Stik es krim kayu",
  "Tutup botol plastik warna-warni",
  "Batu kerikil halus & biji-bijian",
  "Ranting & daun kering aneka bentuk",
  "Gulungan karton tisu toilet / tisu dapur",
  "Kain perca & benang wol warna",
  "Tali rami & pita kain",
  "Plastisin / playdough buatan sendiri",
  "Cangkang telur bersih / spons busa",
  "Kancing baju bekas aneka ukuran"
];
