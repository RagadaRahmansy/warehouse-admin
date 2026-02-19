const { Pool } = require('pg');

// Konfigurasi koneksi ke database PostgreSQL Anda.
// PENTING: Ganti nilai placeholder dengan kredensial database Anda yang sebenarnya.
// Untuk keamanan, sangat disarankan menggunakan environment variables untuk menyimpan informasi ini.
const pool = new Pool({
  user: 'postgres',      // Ganti dengan username PostgreSQL Anda
  host: 'localhost',
  database: 'warehaouse_db', // Ganti dengan nama database Anda
  password: 'ragaskal',        // Ganti dengan password Anda
  port: 5432,
});

// Ekspor query function agar bisa digunakan di file lain
// Ekspor query function agar bisa digunakan di file lain
module.exports = {
  query: (text, params) => pool.query(text, params), // Untuk query sederhana
  getClient: () => pool.connect(), // Untuk transaksi
  end: () => pool.end(), // Untuk menutup koneksi
};