const db = require('./db');

async function verifyDatabase() {
  console.log('Mencoba menghubungkan ke database dan mendaftar tabel...');
  let client;
  try {
    client = await db.getClient();
    console.log('\n✅ SUKSES! Koneksi ke database berhasil dibuat.');

    // Query untuk mendapatkan semua nama tabel dari skema publik
    const res = await client.query(`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public';
    `);

    const tables = res.rows.map(row => row.tablename);

    if (tables.length > 0) {
      console.log('Tabel yang ditemukan:', tables.join(', '));

      // Cek secara spesifik untuk tabel yang kita butuhkan
      if (tables.includes('inventory') && tables.includes('movements')) {
        console.log('✅ Bagus! Tabel "inventory" dan "movements" keduanya ada.');
      } else {
        if (!tables.includes('inventory')) {
          console.log('❌ PERINGATAN: Tabel "inventory" TIDAK DITEMUKAN.');
        }
        if (!tables.includes('movements')) {
          console.log('❌ PERINGATAN: Tabel "movements" TIDAK DITEMUKAN.');
        }
      }
    } else {
      console.log('⚠️ Koneksi berhasil, namun tidak ada tabel yang ditemukan di skema publik.');
    }

  } catch (error) {
    console.error('\n❌ GAGAL! Tidak dapat terhubung atau melakukan query ke database.');
    console.error('Detail Error:', error.message);
    console.error('Pastikan detail koneksi di db.js sudah benar dan layanan PostgreSQL sedang berjalan.');
  } finally {
    if (client) {
      client.release();
    }
    // Kita tutup pool agar prosesnya bisa berhenti setelah selesai
    await db.end();
    console.log('\nSkrip verifikasi selesai.');
  }
}

verifyDatabase();