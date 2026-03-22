const db = require('../config/database');

exports.getAllInventory = async (req, res) => {
    try {
        const [items] = await db.query('SELECT * FROM inventory ORDER BY product ASC');
        res.json({ success: true, count: items.length, data: items });
    } catch (error) {
        console.error('Get inventory error:', error);
        res.status(500).json({ success: false, message: 'Error fetching inventory' });
    }
};

exports.createItem = async (req, res) => {
    try {
        const { product, quantity, unit, purchaseRate, salesRate } = req.body;
        const [result] = await db.query(
            `INSERT INTO inventory (product, quantity, unit, purchase_rate, sales_rate) VALUES (?, ?, ?, ?, ?)`,
            [product, quantity, unit, purchaseRate, salesRate]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Add Inventory', `Added ${product} - ${quantity} ${unit}`, req.ip, 'Inventory']
        );

        res.status(201).json({ success: true, message: 'Item added', data: { id: result.insertId } });
    } catch (error) {
        console.error('Create inventory error:', error);
        res.status(500).json({ success: false, message: 'Error creating item' });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { product, quantity, unit, purchaseRate, salesRate } = req.body;

        const [existing] = await db.query('SELECT id FROM inventory WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        await db.query(
            `UPDATE inventory SET product=?, quantity=?, unit=?, purchase_rate=?, sales_rate=? WHERE id=?`,
            [product, quantity, unit, purchaseRate, salesRate, id]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Update Inventory', `Updated ${product}`, req.ip, 'Inventory']
        );

        res.json({ success: true, message: 'Item updated' });
    } catch (error) {
        console.error('Update inventory error:', error);
        res.status(500).json({ success: false, message: 'Error updating item' });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT product FROM inventory WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        await db.query('DELETE FROM inventory WHERE id = ?', [id]);

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Delete Inventory', `Deleted ${existing[0].product}`, req.ip, 'Inventory']
        );

        res.json({ success: true, message: 'Item deleted' });
    } catch (error) {
        console.error('Delete inventory error:', error);
        res.status(500).json({ success: false, message: 'Error deleting item' });
    }
};
