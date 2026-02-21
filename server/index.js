const express = require('express');
const { V2 } = require('paseto');
const cors = require('cors');
const db = require('./db'); // Impor koneksi database
const app = express();
const port = 3001;

// KUNCI STATIS UNTUK PASETO (Development)
// Dengan kunci statis, token tidak akan menjadi tidak valid saat server restart.
const privateKey = `-----BEGIN PRIVATE KEY-----\nMC4CAQAwBQYDK2VwBCIEIH+Po87gXP83UWIxFhgNqE+lXoX1x3QvOYRNUGyr70d4\n-----END PRIVATE KEY-----`;
const publicKey = `-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEA81ekUMFnJTT3gfuu/EzdjPVcUTD77oePfVvoNucdzFQ=\n-----END PUBLIC KEY-----`;

app.use(cors());
app.use(express.json());


// Middleware logger sederhana
const requestLogger = (req, res, next) => {
  console.log(`=> Request Received: ${req.method} ${req.originalUrl}`);
  next();
};
app.use(requestLogger);

// Rute untuk login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Jika kredensial cocok, buat token Paseto
  if (username === 'admin' && password === 'password') {
    const token = await V2.sign({ sub: 'admin', iat: new Date().toISOString() }, privateKey);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Middleware untuk memverifikasi token Paseto
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    const payload = await V2.verify(token, publicKey);
    req.user = payload; // Menyimpan payload token ke object request
    next(); // Lanjutkan ke rute berikutnya
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.sendStatus(403); // Forbidden (token tidak valid)Forbidden (token tidak valid)
  }
};

// Rute yang dilindungi
// Hanya bisa diakses dengan token yang valid
app.get('/api/profile', verifyToken, (req, res) => {
  // req.user berasal dari middleware verifyToken
  res.json({
    message: 'Ini adalah data profil rahasia.',
    user: req.user
  });
});


// === INVENTORY API ENDPOINTS ===

// GET semua item inventaris
app.get('/api/inventory', verifyToken, async (req, res) => {
  try {
    // Query diubah untuk join dengan tabel warehouses dan mendapatkan nama gudang
    const { rows } = await db.query(`
      SELECT 
        i.id, 
        i.name, 
        i.quantity, 
        i.price, 
        w.name as warehouse_name 
      FROM inventory i
      JOIN warehouses w ON i.warehouse_id = w.id
      ORDER BY i.name
    `);
    res.json(rows);
  } catch (err) {
    console.error('[ERROR] GET /api/inventory:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/inventory
// @desc    Add a new inventory item
// @access  Private
app.post('/api/inventory', verifyToken, async (req, res) => {
  try {
    const { name, quantity, price, warehouse_id } = req.body;

    // Validasi input: name tidak boleh kosong, dan field numerik tidak boleh null
    if (!name || quantity == null || price == null || warehouse_id == null) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const newItemQuery = await db.query(
      'INSERT INTO inventory (name, quantity, price, warehouse_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, quantity, price, warehouse_id]
    );

    res.status(201).json(newItemQuery.rows[0]);
  } catch (err) {
    console.error('[ERROR] POST /api/inventory:', err.message);
    res.status(500).send('Server Error');
  }
});

// === WAREHOUSE API ENDPOINTS ===

// GET semua gudang
app.get('/api/warehouses', verifyToken, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM warehouses ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error('[ERROR] GET /api/warehouses:', err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE item inventaris
app.delete('/api/inventory/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deleteOp = await db.query("DELETE FROM inventory WHERE id = $1", [id]);

        if (deleteOp.rowCount === 0) {
            return res.status(404).json({ msg: "Item not found" });
        }

        res.json({ msg: "Item deleted" });
    } catch (err) {
        console.error('[ERROR] DELETE /api/inventory/:id:', err.message);
        res.status(500).send('Server Error');
    }
});

// PUT (Update) item inventaris
app.put('/api/inventory/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity, price, warehouse_id } = req.body;

        const updateItem = await db.query(
            "UPDATE inventory SET name = $1, quantity = $2, price = $3, warehouse_id = $4 WHERE id = $5 RETURNING *",
            [name, quantity, price, warehouse_id, id]
        );

        if (updateItem.rowCount === 0) {
            return res.status(404).json({ msg: "Item not found" });
        }

        res.json(updateItem.rows[0]);
    } catch (err) {
        console.error('[ERROR] PUT /api/inventory/:id:', err.message);
        res.status(500).send('Server Error');
    }
});


// === MOVEMENTS API ENDPOINTS ===

// GET semua pergerakan barang
app.get('/api/movements', verifyToken, async (req, res) => {
  try {
    // Query diubah untuk join dengan tabel inventory dan mendapatkan nama barang
    const { rows } = await db.query(`
      SELECT 
        m.id, 
        m.type, 
        m.quantity, 
        m.reference, 
        m.notes,
        i.name as product_name 
      FROM movements m
      JOIN inventory i ON m.inventory_id = i.id
      ORDER BY m.id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('[ERROR] GET /api/movements:', err.message);
    res.status(500).send('Server Error');
  }
});

// POST pergerakan barang baru
app.post('/api/movements', verifyToken, async (req, res) => {
  const { inventory_id, type, quantity, reference, notes } = req.body;

  if (!inventory_id || !type || !quantity) {
    return res.status(400).json({ msg: "inventory_id, type, and quantity are required" });
  }

  const client = await db.getClient();

  try {
    await client.query('BEGIN'); // Mulai transaksi

    // 1. Masukkan ke tabel movements
    const newMovement = await client.query(
      "INSERT INTO movements (inventory_id, type, quantity, reference, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [inventory_id, type, quantity, reference, notes]
    );

    // 2. Update stok di tabel inventory
    const stockChange = type === 'INBOUND' ? quantity : -quantity;
    const updateStock = await client.query(
      "UPDATE inventory SET quantity = quantity + $1 WHERE id = $2 RETURNING *",
      [stockChange, inventory_id]
    );
    
    if (updateStock.rowCount === 0) {
      throw new Error('Inventory item not found, rolling back.');
    }

    await client.query('COMMIT'); // Selesaikan transaksi

    // Menggabungkan hasil untuk respons yang lebih informatif
    const result = {
      ...newMovement.rows[0],
      product_name: updateStock.rows[0].name // Tambahkan nama produk ke respons
    };

    res.status(201).json(result);

  } catch (err) {
    await client.query('ROLLBACK'); // Batalkan transaksi jika ada error
    console.error('[ERROR] POST /api/movements:', err.message);
    res.status(500).send('Server Error');
  } finally {
    client.release(); // Kembalikan koneksi ke pool
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});