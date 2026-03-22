const db = require('../config/database');

// ==================== SAVINGS ACCOUNTS ====================

exports.getAllAccounts = async (req, res) => {
    try {
        const [accounts] = await db.query('SELECT * FROM savings_accounts ORDER BY created_at DESC');
        res.json({ success: true, count: accounts.length, data: accounts });
    } catch (error) {
        console.error('Get savings accounts error:', error);
        res.status(500).json({ success: false, message: 'Error fetching savings accounts' });
    }
};

exports.getAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        const [accounts] = await db.query('SELECT * FROM savings_accounts WHERE id = ?', [id]);
        if (accounts.length === 0) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }
        const [transactions] = await db.query(
            'SELECT * FROM savings_transactions WHERE account_id = ? ORDER BY date DESC, created_at DESC',
            [id]
        );
        res.json({ success: true, data: { ...accounts[0], transactions } });
    } catch (error) {
        console.error('Get savings account error:', error);
        res.status(500).json({ success: false, message: 'Error fetching savings account' });
    }
};

exports.createAccount = async (req, res) => {
    try {
        const { bankName, branch, accountNo, scheme, principal, interest, startDate, maturityDate } = req.body;
        const [result] = await db.query(
            `INSERT INTO savings_accounts (bank_name, branch, account_no, scheme, principal, interest, start_date, maturity_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [bankName, branch, accountNo, scheme, principal, interest, startDate, maturityDate]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Add Savings Account', `Added savings account ${accountNo} (${bankName})`, req.ip, 'Savings']
        );

        res.status(201).json({ success: true, message: 'Savings account created', data: { id: result.insertId } });
    } catch (error) {
        console.error('Create savings account error:', error);
        res.status(500).json({ success: false, message: 'Error creating savings account' });
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { bankName, branch, accountNo, scheme, principal, interest, startDate, maturityDate } = req.body;

        const [existing] = await db.query('SELECT id FROM savings_accounts WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        await db.query(
            `UPDATE savings_accounts SET bank_name=?, branch=?, account_no=?, scheme=?, principal=?, interest=?, start_date=?, maturity_date=? WHERE id=?`,
            [bankName, branch, accountNo, scheme, principal, interest, startDate, maturityDate, id]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Update Savings Account', `Updated savings account ${accountNo}`, req.ip, 'Savings']
        );

        res.json({ success: true, message: 'Savings account updated' });
    } catch (error) {
        console.error('Update savings account error:', error);
        res.status(500).json({ success: false, message: 'Error updating savings account' });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT account_no, bank_name FROM savings_accounts WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        await db.query('DELETE FROM savings_accounts WHERE id = ?', [id]);

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Delete Savings Account', `Deleted savings account ${existing[0].account_no}`, req.ip, 'Savings']
        );

        res.json({ success: true, message: 'Savings account deleted' });
    } catch (error) {
        console.error('Delete savings account error:', error);
        res.status(500).json({ success: false, message: 'Error deleting savings account' });
    }
};

// ==================== SAVINGS TRANSACTIONS ====================

exports.addTransaction = async (req, res) => {
    try {
        const { id } = req.params; // account_id
        const { date, particulars, debit, credit } = req.body;

        // Get last transaction balance or principal as starting point
        const [lastTxn] = await db.query(
            'SELECT closing_balance FROM savings_transactions WHERE account_id = ? ORDER BY date DESC, created_at DESC LIMIT 1',
            [id]
        );

        let prevBalance;
        if (lastTxn.length > 0) {
            prevBalance = parseFloat(lastTxn[0].closing_balance);
        } else {
            const [account] = await db.query('SELECT principal FROM savings_accounts WHERE id = ?', [id]);
            if (account.length === 0) {
                return res.status(404).json({ success: false, message: 'Account not found' });
            }
            prevBalance = parseFloat(account[0].principal);
        }

        const closingBalance = prevBalance + (credit || 0) - (debit || 0);

        const [result] = await db.query(
            `INSERT INTO savings_transactions (account_id, date, particulars, debit, credit, closing_balance)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [id, date, particulars, debit || 0, credit || 0, closingBalance]
        );

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Add Savings Transaction', `Transaction on savings account #${id}: ${particulars}`, req.ip, 'Savings']
        );

        res.status(201).json({ success: true, message: 'Transaction added', data: { id: result.insertId, closingBalance } });
    } catch (error) {
        console.error('Add savings transaction error:', error);
        res.status(500).json({ success: false, message: 'Error adding transaction' });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id, txnId } = req.params;

        const [txn] = await db.query('SELECT * FROM savings_transactions WHERE id = ? AND account_id = ?', [txnId, id]);
        if (txn.length === 0) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        await db.query('DELETE FROM savings_transactions WHERE id = ?', [txnId]);

        // Recalculate closing balances for remaining transactions
        const [account] = await db.query('SELECT principal FROM savings_accounts WHERE id = ?', [id]);
        const [allTxns] = await db.query(
            'SELECT id, debit, credit FROM savings_transactions WHERE account_id = ? ORDER BY date ASC, created_at ASC',
            [id]
        );

        let runningBalance = parseFloat(account[0].principal);
        for (const t of allTxns) {
            runningBalance = runningBalance + parseFloat(t.credit) - parseFloat(t.debit);
            await db.query('UPDATE savings_transactions SET closing_balance = ? WHERE id = ?', [runningBalance, t.id]);
        }

        await db.query(
            `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.username, req.user.role, 'Delete Savings Transaction', `Deleted transaction #${txnId}`, req.ip, 'Savings']
        );

        res.json({ success: true, message: 'Transaction deleted' });
    } catch (error) {
        console.error('Delete savings transaction error:', error);
        res.status(500).json({ success: false, message: 'Error deleting transaction' });
    }
};
