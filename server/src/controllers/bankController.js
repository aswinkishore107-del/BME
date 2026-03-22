const db = require('../config/database');

// ==================== BANK ACCOUNTS ====================

exports.getAllAccounts = async (req, res) => {
    try {
        const [accounts] = await db.query('SELECT * FROM bank_accounts ORDER BY created_at DESC');
        res.json({ success: true, count: accounts.length, data: accounts });
    } catch (error) {
        console.error('Get bank accounts error:', error);
        res.status(500).json({ success: false, message: 'Error fetching bank accounts' });
    }
};

exports.getAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        const [accounts] = await db.query('SELECT * FROM bank_accounts WHERE id = ?', [id]);
        if (accounts.length === 0) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }
        const [transactions] = await db.query(
            'SELECT * FROM bank_transactions WHERE account_id = ? ORDER BY date DESC, created_at DESC',
            [id]
        );
        res.json({ success: true, data: { ...accounts[0], transactions } });
    } catch (error) {
        console.error('Get bank account error:', error);
        res.status(500).json({ success: false, message: 'Error fetching bank account' });
    }
};

exports.createAccount = async (req, res) => {
    try {
        const { name, bankName, ifsc, branch, accountNumber, openingBalance } = req.body;
        const [result] = await db.query(
            `INSERT INTO bank_accounts (name, bank_name, ifsc, branch, account_number, opening_balance, current_balance)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, bankName, ifsc, branch, accountNumber, openingBalance, openingBalance]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Add Bank Account', `Added bank account ${name} (${bankName})`, req.ip, 'Bank']
        );

        res.status(201).json({ success: true, message: 'Bank account created', data: { id: result.insertId } });
    } catch (error) {
        console.error('Create bank account error:', error);
        res.status(500).json({ success: false, message: 'Error creating bank account' });
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, bankName, ifsc, branch, accountNumber, openingBalance } = req.body;

        const [existing] = await db.query('SELECT * FROM bank_accounts WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        // Recalculate current balance based on new opening balance + all transactions
        const [txns] = await db.query(
            'SELECT SUM(credit) as totalCredit, SUM(debit) as totalDebit FROM bank_transactions WHERE account_id = ?',
            [id]
        );
        const netChange = (txns[0].totalCredit || 0) - (txns[0].totalDebit || 0);
        const newBalance = openingBalance + netChange;

        await db.query(
            `UPDATE bank_accounts SET name=?, bank_name=?, ifsc=?, branch=?, account_number=?, opening_balance=?, current_balance=? WHERE id=?`,
            [name, bankName, ifsc, branch, accountNumber, openingBalance, newBalance, id]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Update Bank Account', `Updated bank account ${name}`, req.ip, 'Bank']
        );

        res.json({ success: true, message: 'Bank account updated' });
    } catch (error) {
        console.error('Update bank account error:', error);
        res.status(500).json({ success: false, message: 'Error updating bank account' });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT name FROM bank_accounts WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        await db.query('DELETE FROM bank_accounts WHERE id = ?', [id]);

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Delete Bank Account', `Deleted bank account ${existing[0].name}`, req.ip, 'Bank']
        );

        res.json({ success: true, message: 'Bank account deleted' });
    } catch (error) {
        console.error('Delete bank account error:', error);
        res.status(500).json({ success: false, message: 'Error deleting bank account' });
    }
};

// ==================== BANK TRANSACTIONS ====================

exports.addTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, particulars, debit, credit, category } = req.body;

        const [accounts] = await db.query('SELECT * FROM bank_accounts WHERE id = ?', [id]);
        if (accounts.length === 0) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        // ✅ FIXED CALCULATION
        const currentBalance = parseFloat(accounts[0].current_balance);
        const creditAmount = parseFloat(credit || 0);
        const debitAmount = parseFloat(debit || 0);

        const closingBalance = parseFloat(
            (currentBalance + creditAmount - debitAmount).toFixed(2)
        );

        const [result] = await db.query(
            `INSERT INTO bank_transactions 
            (account_id, date, particulars, debit, credit, closing_balance, category)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, date, particulars, debitAmount, creditAmount, closingBalance, category || null]
        );

        await db.query(
            'UPDATE bank_accounts SET current_balance = ? WHERE id = ?',
            [closingBalance, id]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Add Bank Transaction',
             `Added transaction to ${accounts[0].name}: ${particulars}`, req.ip, 'Bank']
        );

        res.status(201).json({
            success: true,
            message: 'Transaction added',
            data: { id: result.insertId, closingBalance }
        });

    } catch (error) {
        console.error('Add transaction error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id, txnId } = req.params;

        // ✅ Convert params to numbers
        const accountId = parseInt(id);
        const transactionId = parseInt(txnId);

        // ✅ Check transaction exists for that account
        const [txn] = await db.query(
            'SELECT * FROM bank_transactions WHERE id = ? AND account_id = ?',
            [transactionId, accountId]
        );

        if (txn.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found for this account'
            });
        }

        // ✅ Delete transaction
        await db.query(
            'DELETE FROM bank_transactions WHERE id = ?',
            [transactionId]
        );

        // ✅ Get opening balance
        const [accounts] = await db.query(
            'SELECT opening_balance FROM bank_accounts WHERE id = ?',
            [accountId]
        );

        const openingBalance = parseFloat(accounts[0].opening_balance || 0);

        // ✅ Get total credit & debit
        const [txns] = await db.query(
            'SELECT SUM(credit) as totalCredit, SUM(debit) as totalDebit FROM bank_transactions WHERE account_id = ?',
            [accountId]
        );

        const totalCredit = parseFloat(txns[0].totalCredit || 0);
        const totalDebit = parseFloat(txns[0].totalDebit || 0);

        // ✅ Calculate new balance
        const newBalance = parseFloat(
            (openingBalance + totalCredit - totalDebit).toFixed(2)
        );

        // ✅ Update account balance
        await db.query(
            'UPDATE bank_accounts SET current_balance = ? WHERE id = ?',
            [newBalance, accountId]
        );

        // ✅ Get all remaining transactions (ordered)
        const [allTxns] = await db.query(
            `SELECT id, debit, credit 
             FROM bank_transactions 
             WHERE account_id = ? 
             ORDER BY date ASC, created_at ASC`,
            [accountId]
        );

        // ✅ Recalculate closing balances safely
        let runningBalance = openingBalance;

        for (const t of allTxns) {
            const credit = parseFloat(t.credit || 0);
            const debit = parseFloat(t.debit || 0);

            runningBalance = parseFloat(
                (runningBalance + credit - debit).toFixed(2)
            );

            await db.query(
                'UPDATE bank_transactions SET closing_balance = ? WHERE id = ?',
                [runningBalance, t.id]
            );
        }

        // ✅ Safe logging (no crash if user missing)
        if (req.user && req.user.username) {
            await db.query(
                `INSERT INTO logs (user, user_role, action, details, ip_address, module)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    req.user.username,
                    req.user.role,
                    'Delete Bank Transaction',
                    `Deleted transaction #${transactionId}`,
                    req.ip,
                    'Bank'
                ]
            );
        }

        // ✅ Final response
        res.json({
            success: true,
            message: 'Transaction deleted successfully',
            newBalance
        });

    } catch (error) {
        console.error('Delete transaction error:', error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== TRANSACTION CATEGORIES ====================

exports.getCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM transaction_categories ORDER BY name ASC');
        res.json({ success: true, data: categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ success: false, message: 'Error fetching categories' });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const [result] = await db.query('INSERT INTO transaction_categories (name) VALUES (?)', [name]);
        res.status(201).json({ success: true, message: 'Category created', data: { id: result.insertId, name } });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Category already exists' });
        }
        console.error('Create category error:', error);
        res.status(500).json({ success: false, message: 'Error creating category' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        await db.query('UPDATE transaction_categories SET name = ? WHERE id = ?', [name, id]);
        res.json({ success: true, message: 'Category updated' });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ success: false, message: 'Error updating category' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM transaction_categories WHERE id = ?', [id]);
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ success: false, message: 'Error deleting category' });
    }
};
