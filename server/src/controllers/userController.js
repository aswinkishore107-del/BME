const bcrypt = require('bcryptjs');
const db = require('../config/database');

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, role, status, permissions, edit_access, delete_access, created_date, last_login FROM users ORDER BY created_date DESC'
    );

    const safeParse = (val) => {
      if (!val) return {};
      try { return JSON.parse(val); } catch { return {}; }
    };

    res.json({
      success: true,
      count: users.length,
      data: users.map(u => ({
        ...u,
        permissions: safeParse(u.permissions),
        editAccess: safeParse(u.edit_access),
        deleteAccess: safeParse(u.delete_access)
      }))
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, role, status, permissions, editAccess, deleteAccess } = req.body;

    // Check if user exists
    const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await db.query(
      `INSERT INTO users (username, password_hash, role, status, permissions, edit_access, delete_access, created_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())`,
      [username, passwordHash, role, status || 'Active',
        JSON.stringify(permissions),
        JSON.stringify(editAccess),
        JSON.stringify(deleteAccess)]
    );

    // Log action
    await db.query(
      `INSERT INTO logs (user, user_role, action, details, ip_address, module) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.username, req.user.role, 'Add User', `Created new user: ${username} (${role})`, req.ip, 'Users']
    );

    res.status(201).json({ success: true, message: 'User created successfully', data: { id: result.insertId } });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, message: 'Error creating user' });
  }
};

// Add updateUser, deleteUser, changeUserStatus functions similarly

exports.getPendingUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, username, email, created_date, approval_status FROM users WHERE approval_status = 'Pending' ORDER BY created_date DESC"
    );

    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ success: false, message: 'Error fetching pending users' });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Update approval status and activate account
    await db.query(
      "UPDATE users SET approval_status = 'Approved', status = 'Active' WHERE id = ?",
      [id]
    );

    // Log action
    await db.query(
      `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.username, req.user.role, 'Approve User', `Approved user ID: ${id}`, req.ip, 'Users']
    );

    // Notify user if email present
    const [rows] = await db.query('SELECT username, email FROM users WHERE id = ?', [id]);
    const user = rows[0];
    if (user && user.email) {
      try {
        const { sendEmail } = require('../utils/email');
        const subject = 'Your account has been approved';
        const html = `<p>Hello ${user.username},</p><p>Your account has been approved by the administrator. You can now log in.</p>`;
        await sendEmail({ to: user.email, subject, html });
      } catch (err) {
        console.error('Failed to send approval email:', err);
      }
    }

    res.json({ success: true, message: 'User approved' });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ success: false, message: 'Error approving user' });
  }
};

exports.rejectUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "UPDATE users SET approval_status = 'Rejected', status = 'Inactive' WHERE id = ?",
      [id]
    );

    await db.query(
      `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.username, req.user.role, 'Reject User', `Rejected user ID: ${id}`, req.ip, 'Users']
    );

    const [rows] = await db.query('SELECT username, email FROM users WHERE id = ?', [id]);
    const user = rows[0];
    if (user && user.email) {
      try {
        const { sendEmail } = require('../utils/email');
        const subject = 'Your account registration was rejected';
        const html = `<p>Hello ${user.username},</p><p>We are sorry to inform you that your account registration was rejected by the administrator. For more information, contact support.</p>`;
        await sendEmail({ to: user.email, subject, html });
      } catch (err) {
        console.error('Failed to send rejection email:', err);
      }
    }

    res.json({ success: true, message: 'User rejected' });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ success: false, message: 'Error rejecting user' });
  }
};