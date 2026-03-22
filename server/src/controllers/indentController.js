const db = require('../config/database');

exports.getAllIndents = async (req, res) => {
    try {
        const { date, startDate, endDate } = req.query;
        let query = 'SELECT * FROM indents';
        const params = [];

        if (date) {
            query += ' WHERE date = ?';
            params.push(date);
        } else if (startDate && endDate) {
            query += ' WHERE date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        query += ' ORDER BY date DESC, created_at DESC';

        const [indents] = await db.query(query, params);
        res.json({ success: true, count: indents.length, data: indents });
    } catch (error) {
        console.error('Get indents error:', error);
        res.status(500).json({ success: false, message: 'Error fetching indents' });
    }
};

exports.createIndent = async (req, res) => {
    try {
        const { date, item, quantity, salesRate, totalPrice } = req.body;
        const [result] = await db.query(
            `INSERT INTO indents (date, item, quantity, sales_rate, total_price, created_by) VALUES (?, ?, ?, ?, ?, ?)`,
            [date, item, quantity, salesRate, totalPrice, req.user.username]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Add Indent', `Added indent: ${item} x${quantity}`, req.ip, 'Indent']
        );

        res.status(201).json({ success: true, message: 'Indent created', data: { id: result.insertId } });
    } catch (error) {
        console.error('Create indent error:', error);
        res.status(500).json({ success: false, message: 'Error creating indent' });
    }
};

exports.updateIndent = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, item, quantity, salesRate, totalPrice } = req.body;

        const [existing] = await db.query('SELECT id FROM indents WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Indent not found' });
        }

        await db.query(
            `UPDATE indents SET date=?, item=?, quantity=?, sales_rate=?, total_price=? WHERE id=?`,
            [date, item, quantity, salesRate, totalPrice, id]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Update Indent', `Updated indent #${id}: ${item}`, req.ip, 'Indent']
        );

        res.json({ success: true, message: 'Indent updated' });
    } catch (error) {
        console.error('Update indent error:', error);
        res.status(500).json({ success: false, message: 'Error updating indent' });
    }
};

exports.deleteIndent = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT item FROM indents WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Indent not found' });
        }

        await db.query('DELETE FROM indents WHERE id = ?', [id]);

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Delete Indent', `Deleted indent: ${existing[0].item}`, req.ip, 'Indent']
        );

        res.json({ success: true, message: 'Indent deleted' });
    } catch (error) {
        console.error('Delete indent error:', error);
        res.status(500).json({ success: false, message: 'Error deleting indent' });
    }
};

exports.saveIndent = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('UPDATE indents SET saved = TRUE WHERE id = ?', [id]);
        res.json({ success: true, message: 'Indent saved' });
    } catch (error) {
        console.error('Save indent error:', error);
        res.status(500).json({ success: false, message: 'Error saving indent' });
    }
};
