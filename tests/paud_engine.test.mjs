import test from 'node:test';
import assert from 'node:assert/strict';

// Helper cleanListText replica for unit test verification
function cleanListText(text) {
  if (!text) return '';
  return text
    .replace(/^[\s•\-\*\u2022\u25E6\u25AA\u25CF\u2013\u2014]+/, '')
    .replace(/^\d+[\.\)]\s*/, '')
    .trim();
}

function validatePaudDocSchema(data) {
  if (!data || typeof data !== 'object') {
    return 'Respons bukan objek JSON yang valid.';
  }

  if (!data.informasi_umum?.topik_subtopik) {
    return 'Field informasi_umum.topik_subtopik belum terisi.';
  }

  if (!data.identifikasi?.peserta_didik) {
    return 'Data identifikasi peserta didik belum terisi.';
  }

  if (!data.identifikasi?.dimensi_profil_lulusan_terpilih?.length) {
    return 'Data identifikasi dimensi profil lulusan (DPL) terpilih kosong.';
  }

  if (!data.desain_pembelajaran?.capaian_pembelajaran?.length) {
    return 'Capaian pembelajaran belum terisi.';
  }

  if (!data.pengalaman_belajar?.inti?.blok_tahap?.length) {
    return 'Struktur pengalaman belajar inti tidak ditemukan.';
  }

  let totalKegiatan = 0;
  let totalHari = 0;
  for (const blok of data.pengalaman_belajar.inti.blok_tahap) {
    for (const h of blok.hari || []) {
      totalHari++;
      totalKegiatan += (h.kegiatan_list || []).length;
    }
  }

  if (totalKegiatan < 15) {
    return `Jumlah kegiatan inti hanya ${totalKegiatan} dari ${totalHari} hari. Minimal diharapkan 18 kegiatan untuk 6 hari pembelajaran PAUD.`;
  }

  if (!data.asesmen_pembelajaran?.akhir?.length) {
    return 'Asesmen akhir pembelajaran tidak lengkap.';
  }

  return null;
}

test('cleanListText should strip bullet points, asterisks, and numbers', () => {
  assert.equal(cleanListText('• Piring kertas'), 'Piring kertas');
  assert.equal(cleanListText('- Kardus bekas'), 'Kardus bekas');
  assert.equal(cleanListText('* Botol plastik'), 'Botol plastik');
  assert.equal(cleanListText('1. Mengamati tekstur'), 'Mengamati tekstur');
  assert.equal(cleanListText('2) Menyusun pola'), 'Menyusun pola');
  assert.equal(cleanListText(''), '');
  assert.equal(cleanListText(undefined), '');
});

test('validatePaudDocSchema rejects invalid / incomplete documents', () => {
  assert.equal(validatePaudDocSchema(null), 'Respons bukan objek JSON yang valid.');
  assert.equal(validatePaudDocSchema({}), 'Field informasi_umum.topik_subtopik belum terisi.');

  const missingActivities = {
    informasi_umum: { topik_subtopik: 'Aku Istimewa' },
    identifikasi: { peserta_didik: 'Anak TK A', dimensi_profil_lulusan_terpilih: ['DPL1'] },
    desain_pembelajaran: { capaian_pembelajaran: ['CP1'] },
    pengalaman_belajar: { inti: { blok_tahap: [] } }
  };
  assert.equal(validatePaudDocSchema(missingActivities), 'Struktur pengalaman belajar inti tidak ditemukan.');
});

test('validatePaudDocSchema accepts valid full document with 18 activities', () => {
  const activities = [{ nomor: 1, nama_kegiatan: 'K1' }, { nomor: 2, nama_kegiatan: 'K2' }, { nomor: 3, nama_kegiatan: 'K3' }];
  const fullDoc = {
    informasi_umum: { topik_subtopik: 'Aku Istimewa' },
    identifikasi: {
      peserta_didik: '15 Anak TK A',
      dimensi_profil_lulusan_terpilih: ['DPL1', 'DPL2', 'DPL3', 'DPL4', 'DPL5', 'DPL6', 'DPL7', 'DPL8']
    },
    desain_pembelajaran: {
      capaian_pembelajaran: ['Capaian Pembelajaran Fondasi']
    },
    pengalaman_belajar: {
      inti: {
        blok_tahap: [
          { header_tahap: 'MEMAHAMI', hari: [{ hari_ke: 1, kegiatan_list: activities }, { hari_ke: 2, kegiatan_list: activities }] },
          { header_tahap: 'MENGAPLIKASI', hari: [{ hari_ke: 3, kegiatan_list: activities }, { hari_ke: 4, kegiatan_list: activities }] },
          { header_tahap: 'MEREFLEKSI', hari: [{ hari_ke: 5, kegiatan_list: activities }, { hari_ke: 6, kegiatan_list: activities }] }
        ]
      }
    },
    asesmen_pembelajaran: {
      akhir: ['Observasi ketercapaian 8 DPL']
    }
  };

  assert.equal(validatePaudDocSchema(fullDoc), null);
});
