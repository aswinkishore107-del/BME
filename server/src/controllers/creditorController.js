const db = require('../config/database');

exports.getAllCreditors = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        let query = 'SELECT * FROM creditors';
        const params = [];
        const conditions = [];

        if (status) {
            conditions.push('status = ?');
            params.push(status);
        }
        if (startDate && endDate) {
            conditions.push('bill_date BETWEEN ? AND ?');
            params.push(startDate, endDate);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ' ORDER BY bill_date DESC, created_at DESC';

        const [creditors] = await db.query(query, params);
        res.json({ success: true, count: creditors.length, data: creditors });
    } catch (error) {
        console.error('Get creditors error:', error);
        res.status(500).json({ success: false, message: 'Error fetching creditors' });
    }
};

exports.createCreditor = async (req, res) => {
    try {
        const { billDate, entityName, particulars, billAmount } = req.body;
        const [result] = await db.query(
            `INSERT INTO creditors (bill_date, entity_name, particulars, bill_amount, status, created_by)
       VALUES (?, ?, ?, ?, 'pending', ?)`,
            [billDate, entityName, particulars, billAmount, req.user.username]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Add Creditor', `Added creditor ${entityName} - ₹${billAmount}`, req.ip, 'Creditors']
        );

        res.status(201).json({ success: true, message: 'Creditor added', data: { id: result.insertId } });
    } catch (error) {
        console.error('Create creditor error:', error);
        res.status(500).json({ success: false, message: 'Error creating creditor' });
    }
};

exports.updateCreditor = async (req, res) => {
    try {
        const { id } = req.params;
        const { billDate, settledDate, entityName, particulars, billAmount,
            paymentMethod1, amount1, paidBy1, paymentMethod2, amount2, paidBy2, status } = req.body;

        const [existing] = await db.query('SELECT id FROM creditors WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Creditor not found' });
        }

        await db.query(
            `UPDATE creditors SET bill_date=?, settled_date=?, entity_name=?, particulars=?, bill_amount=?,
       payment_method_1=?, amount_1=?, paid_by_1=?, payment_method_2=?, amount_2=?, paid_by_2=?, status=?
       WHERE id=?`,
            [billDate, settledDate || null, entityName, particulars, billAmount,
                paymentMethod1 || null, amount1 || null, paidBy1 || null,
                paymentMethod2 || null, amount2 || null, paidBy2 || null,
                status || 'pending', id]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Update Creditor', `Updated creditor ${entityName}`, req.ip, 'Creditors']
        );

        res.json({ success: true, message: 'Creditor updated' });
    } catch (error) {
        console.error('Update creditor error:', error);
        res.status(500).json({ success: false, message: 'Error updating creditor' });
    }
};

exports.settleCreditor = async (req, res) => {
    try {
        const { id } = req.params;
        const { settledDate, paymentMethod1, amount1, paidBy1, paymentMethod2, amount2, paidBy2 } = req.body;

        const [existing] = await db.query('SELECT entity_name, bill_amount FROM creditors WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Creditor not found' });
        }

        await db.query(
            `UPDATE creditors SET settled_date=?, payment_method_1=?, amount_1=?, paid_by_1=?,
       payment_method_2=?, amount_2=?, paid_by_2=?, status='settled' WHERE id=?`,
            [settledDate || new Date().toISOString().split('T')[0],
            paymentMethod1 || null, amount1 || null, paidBy1 || null,
            paymentMethod2 || null, amount2 || null, paidBy2 || null, id]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Settle Creditor', `Settled creditor ${existing[0].entity_name} - ₹${existing[0].bill_amount}`, req.ip, 'Creditors']
        );

        res.json({ success: true, message: 'Creditor settled' });
    } catch (error) {
        console.error('Settle creditor error:', error);
        res.status(500).json({ success: false, message: 'Error settling creditor' });
    }
};

exports.deleteCreditor = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT entity_name FROM creditors WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Creditor not found' });
        }

        await db.query('DELETE FROM creditors WHERE id = ?', [id]);

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Delete Creditor', `Deleted creditor ${existing[0].entity_name}`, req.ip, 'Creditors']
        );

        res.json({ success: true, message: 'Creditor deleted' });
    } catch (error) {
        console.error('Delete creditor error:', error);
        res.status(500).json({ success: false, message: 'Error deleting creditor' });
    }
};
