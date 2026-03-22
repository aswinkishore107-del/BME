const db = require('../config/database');

// ==================== PIGMY R (Retrieval) ====================

exports.getAllPigmyR = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = 'SELECT * FROM pigmy_r';
        const params = [];

        if (startDate && endDate) {
            query += ' WHERE date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        query += ' ORDER BY date DESC, created_at DESC';

        const [records] = await db.query(query, params);
        res.json({ success: true, count: records.length, data: records });
    } catch (error) {
        console.error('Get pigmy R error:', error);
        res.status(500).json({ success: false, message: 'Error fetching pigmy records' });
    }
};

exports.createPigmyR = async (req, res) => {
    try {
        const { date, valueDate, amount, paymentMode, paidBy } = req.body;
        const [result] = await db.query(
            `INSERT INTO pigmy_r (date, value_date, amount, payment_mode, paid_by, created_by) VALUES (?, ?, ?, ?, ?, ?)`,
            [date, valueDate, amount, paymentMode, paidBy, req.user.username]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Add Pigmy R', `Added pigmy retrieval ₹${amount} by ${paidBy}`, req.ip, 'Pigmy']
        );

        res.status(201).json({ success: true, message: 'Pigmy record added', data: { id: result.insertId } });
    } catch (error) {
        console.error('Create pigmy R error:', error);
        res.status(500).json({ success: false, message: 'Error creating pigmy record' });
    }
};

exports.updatePigmyR = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, valueDate, amount, paymentMode, paidBy } = req.body;

        const [existing] = await db.query('SELECT id FROM pigmy_r WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Pigmy record not found' });
        }

        await db.query(
            `UPDATE pigmy_r SET date=?, value_date=?, amount=?, payment_mode=?, paid_by=? WHERE id=?`,
            [date, valueDate, amount, paymentMode, paidBy, id]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Update Pigmy R', `Updated pigmy record #${id}`, req.ip, 'Pigmy']
        );

        res.json({ success: true, message: 'Pigmy record updated' });
    } catch (error) {
        console.error('Update pigmy R error:', error);
        res.status(500).json({ success: false, message: 'Error updating pigmy record' });
    }
};

exports.deletePigmyR = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT amount, paid_by FROM pigmy_r WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Pigmy record not found' });
        }

        await db.query('DELETE FROM pigmy_r WHERE id = ?', [id]);

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Delete Pigmy R', `Deleted pigmy ₹${existing[0].amount} by ${existing[0].paid_by}`, req.ip, 'Pigmy']
        );

        res.json({ success: true, message: 'Pigmy record deleted' });
    } catch (error) {
        console.error('Delete pigmy R error:', error);
        res.status(500).json({ success: false, message: 'Error deleting pigmy record' });
    }
};

// ==================== PIGMY S (from entries view) ====================

exports.getPigmyS = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = 'SELECT * FROM pigmy_s_view';
        const params = [];

        if (startDate && endDate) {
            query += ' WHERE date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        query += ' ORDER BY date DESC';

        const [records] = await db.query(query, params);
        const total = records.reduce((sum, r) => sum + parseFloat(r.amount), 0);
        res.json({ success: true, count: records.length, total, data: records });
    } catch (error) {
        console.error('Get pigmy S error:', error);
        res.status(500).json({ success: false, message: 'Error fetching pigmy S data' });
    }
};
