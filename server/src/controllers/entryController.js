// server/src/controllers/entryController.js

const db = require('../config/database');

/* ============================
   GET ALL ENTRIES
============================ */
exports.getAllEntries = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = 'SELECT * FROM entries';
    const params = [];

    if (startDate && endDate) {
      query += ' WHERE date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY date DESC';

    const [entries] = await db.query(query, params);

    res.json({
      success: true,
      count: entries.length,
      data: entries
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch entries'
    });
  }
};


/* ============================
   GET ENTRY BY DATE
============================ */
exports.getEntryByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const [rows] = await db.query(
      `SELECT id,
              DATE_FORMAT(date, '%Y-%m-%d') AS date,
              cash, bank, sales,
              mutton, chicken, grocery,
              flower, leaf, gas, misc,
              pigmy_s, salary,
              expenses, profit,
              created_by, created_at, updated_at
       FROM entries
       WHERE date = ?`,
      [date]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: 'No entry found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch entry'
    });
  }
};



/* ============================
   CREATE ENTRY
============================ */
exports.createEntry = async (req, res) => {
  try {
    const {
      date,
      cash,
      bank,
      sales,
      mutton,
      chicken,
      grocery,
      flower,
      leaf,
      gas,
      misc,
      pigmyS,
      salary
    } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    const [exist] = await db.query(
      'SELECT id FROM entries WHERE date=?',
      [date]
    );

    if (exist.length) {
      return res.status(400).json({
        success: false,
        message: 'Entry already exists'
      });
    }

    const [result] = await db.query(
      `INSERT INTO entries
      (date,cash,bank,sales,mutton,chicken,grocery,
       flower,leaf,gas,misc,pigmy_s,salary,created_by)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        date,
        cash ?? 0,
        bank ?? 0,
        sales ?? 0,
        mutton ?? 0,
        chicken ?? 0,
        grocery ?? 0,
        flower ?? 0,
        leaf ?? 0,
        gas ?? 0,
        misc ?? 0,
        pigmyS ?? 0,
        salary ?? 0,
        req.user.username
      ]
    );

    const [newEntry] = await db.query(
      'SELECT * FROM entries WHERE id=?',
      [result.insertId]
    );

    await db.query(
      `INSERT INTO logs
      (user,user_role,action,details,ip_address,module)
      VALUES (?,?,?,?,?,?)`,
      [
        req.user.username,
        req.user.role,
        'Create Entry',
        `Created entry: ${date}`,
        req.ip,
        'Entries'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Entry created',
      data: newEntry[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to create entry'
    });
  }
};


/* ============================
   UPDATE ENTRY
============================ */
exports.updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const [rows] = await db.query(
      'SELECT * FROM entries WHERE id=?',
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found'
      });
    }

    const fields = [];
    const values = [];

    const fieldMap = {
      date: 'date',
      cash: 'cash',
      bank: 'bank',
      sales: 'sales',
      mutton: 'mutton',
      chicken: 'chicken',
      grocery: 'grocery',
      flower: 'flower',
      leaf: 'leaf',
      gas: 'gas',
      misc: 'misc',
      pigmyS: 'pigmy_s',
      salary: 'salary'
    };

    for (const key in body) {
      if (fieldMap[key]) {
        fields.push(`${fieldMap[key]} = ?`);
        values.push(body[key]);
      }
    }

    if (!fields.length) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    values.push(id);

    await db.query(
      `UPDATE entries SET ${fields.join(', ')} WHERE id=?`,
      values
    );

    const [updated] = await db.query(
      'SELECT * FROM entries WHERE id=?',
      [id]
    );

    await db.query(
      `INSERT INTO logs
      (user,user_role,action,details,ip_address,module)
      VALUES (?,?,?,?,?,?)`,
      [
        req.user.username,
        req.user.role,
        'Update Entry',
        `Updated entry ID ${id}`,
        req.ip,
        'Entries'
      ]
    );

    res.json({
      success: true,
      message: 'Entry updated',
      data: updated[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


/* ============================
   DELETE ENTRY
============================ */
exports.deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM entries WHERE id=?',
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found'
      });
    }

    await db.query('DELETE FROM entries WHERE id=?', [id]);

    await db.query(
      `INSERT INTO logs
      (user,user_role,action,details,ip_address,module)
      VALUES (?,?,?,?,?,?)`,
      [
        req.user.username,
        req.user.role,
        'Delete Entry',
        `Deleted entry ID ${id}`,
        req.ip,
        'Entries'
      ]
    );

    res.json({
      success: true,
      message: 'Entry deleted'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete entry'
    });
  }
};
