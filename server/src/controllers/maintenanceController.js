const db = require('../config/database');

// ==================== MAINTENANCE TICKETS ====================

exports.getAllTickets = async (req, res) => {
    try {
        const { status, priority } = req.query;
        let query = 'SELECT * FROM maintenance_tickets';
        const params = [];
        const conditions = [];

        if (status) { conditions.push('status = ?'); params.push(status); }
        if (priority) { conditions.push('priority = ?'); params.push(priority); }

        if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
        query += ' ORDER BY created_at DESC';

        const [tickets] = await db.query(query, params);
        res.json({ success: true, count: tickets.length, data: tickets });
    } catch (error) {
        console.error('Get tickets error:', error);
        res.status(500).json({ success: false, message: 'Error fetching tickets' });
    }
};

exports.createTicket = async (req, res) => {
    try {
        const { date, issue, details, priority } = req.body;
        const [result] = await db.query(
            `INSERT INTO maintenance_tickets (date, issue, details, priority, submitted_by) VALUES (?, ?, ?, ?, ?)`,
            [date, issue, details, priority || 'medium', req.user.username]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Create Ticket', `Created ticket: ${issue}`, req.ip, 'Maintenance']
        );

        res.status(201).json({ success: true, message: 'Ticket created', data: { id: result.insertId } });
    } catch (error) {
        console.error('Create ticket error:', error);
        res.status(500).json({ success: false, message: 'Error creating ticket' });
    }
};

exports.updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, issue, details, priority, status } = req.body;

        const [existing] = await db.query('SELECT id FROM maintenance_tickets WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        await db.query(
            `UPDATE maintenance_tickets SET date=?, issue=?, details=?, priority=?, status=? WHERE id=?`,
            [date, issue, details, priority, status, id]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Update Ticket', `Updated ticket #${id}: ${issue}`, req.ip, 'Maintenance']
        );

        res.json({ success: true, message: 'Ticket updated' });
    } catch (error) {
        console.error('Update ticket error:', error);
        res.status(500).json({ success: false, message: 'Error updating ticket' });
    }
};

exports.deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT issue FROM maintenance_tickets WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        await db.query('DELETE FROM maintenance_tickets WHERE id = ?', [id]);

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Delete Ticket', `Deleted ticket: ${existing[0].issue}`, req.ip, 'Maintenance']
        );

        res.json({ success: true, message: 'Ticket deleted' });
    } catch (error) {
        console.error('Delete ticket error:', error);
        res.status(500).json({ success: false, message: 'Error deleting ticket' });
    }
};

// ==================== MAINTENANCE ENTRIES ====================

exports.getAllEntries = async (req, res) => {
    try {
        const { startDate, endDate, category } = req.query;
        let query = 'SELECT * FROM maintenance_entries';
        const params = [];
        const conditions = [];

        if (startDate && endDate) {
            conditions.push('date BETWEEN ? AND ?');
            params.push(startDate, endDate);
        }
        if (category) {
            conditions.push('category = ?');
            params.push(category);
        }

        if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
        query += ' ORDER BY date DESC, created_at DESC';

        const [entries] = await db.query(query, params);
        const total = entries.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        res.json({ success: true, count: entries.length, total, data: entries });
    } catch (error) {
        console.error('Get maintenance entries error:', error);
        res.status(500).json({ success: false, message: 'Error fetching entries' });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const { date, issue, workDoneDetails, doneBy, amount, category } = req.body;
        const [result] = await db.query(
            `INSERT INTO maintenance_entries (date, issue, work_done_details, done_by, amount, category, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [date, issue, workDoneDetails, doneBy, amount, category, req.user.username]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Add Maintenance Entry', `Added maintenance: ${issue} - ₹${amount}`, req.ip, 'Maintenance']
        );

        res.status(201).json({ success: true, message: 'Entry created', data: { id: result.insertId } });
    } catch (error) {
        console.error('Create maintenance entry error:', error);
        res.status(500).json({ success: false, message: 'Error creating entry' });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, issue, workDoneDetails, doneBy, amount, category } = req.body;

        const [existing] = await db.query('SELECT id FROM maintenance_entries WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }

        await db.query(
            `UPDATE maintenance_entries SET date=?, issue=?, work_done_details=?, done_by=?, amount=?, category=? WHERE id=?`,
            [date, issue, workDoneDetails, doneBy, amount, category, id]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Update Maintenance Entry', `Updated entry #${id}`, req.ip, 'Maintenance']
        );

        res.json({ success: true, message: 'Entry updated' });
    } catch (error) {
        console.error('Update maintenance entry error:', error);
        res.status(500).json({ success: false, message: 'Error updating entry' });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT issue FROM maintenance_entries WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }

        await db.query('DELETE FROM maintenance_entries WHERE id = ?', [id]);

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Delete Maintenance Entry', `Deleted entry: ${existing[0].issue}`, req.ip, 'Maintenance']
        );

        res.json({ success: true, message: 'Entry deleted' });
    } catch (error) {
        console.error('Delete maintenance entry error:', error);
        res.status(500).json({ success: false, message: 'Error deleting entry' });
    }
};

// ==================== MAINTENANCE CATEGORIES ====================

exports.getCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM maintenance_categories ORDER BY name ASC');
        res.json({ success: true, data: categories });
    } catch (error) {
        console.error('Get maintenance categories error:', error);
        res.status(500).json({ success: false, message: 'Error fetching categories' });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name, icon } = req.body;
        const [result] = await db.query(
            'INSERT INTO maintenance_categories (name, icon) VALUES (?, ?)',
            [name, icon || null]
        );
        res.status(201).json({ success: true, message: 'Category created', data: { id: result.insertId, name, icon } });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Category already exists' });
        }
        console.error('Create maintenance category error:', error);
        res.status(500).json({ success: false, message: 'Error creating category' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, icon } = req.body;
        await db.query('UPDATE maintenance_categories SET name = ?, icon = ? WHERE id = ?', [name, icon || null, id]);
        res.json({ success: true, message: 'Category updated' });
    } catch (error) {
        console.error('Update maintenance category error:', error);
        res.status(500).json({ success: false, message: 'Error updating category' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM maintenance_categories WHERE id = ?', [id]);
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        console.error('Delete maintenance category error:', error);
        res.status(500).json({ success: false, message: 'Error deleting category' });
    }
};
