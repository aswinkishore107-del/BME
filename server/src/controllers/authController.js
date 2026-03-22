const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/database');

/* ===========================
   Generate JWT
=========================== */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

/* ===========================
   LOGIN
=========================== */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password required'
      });
    }

    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = rows[0];

    if (user.status !== 'Active') {
      return res.status(401).json({
        success: false,
        message: 'Account inactive'
      });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user);

    await db.query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          username: user.username,
          role: user.role
        }
      }
    });

  } catch (err) {
    console.error('Login error:', err);

    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

/* ===========================
   REGISTER
=========================== */
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields required'
      });
    }

    const [exists] = await db.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (exists.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const userRole = ['Admin','Manager','User'].includes(role)
      ? role
      : 'User';

    const permissions = {};
    const editAccess = {};
    const deleteAccess = {};

    await db.query(
      `INSERT INTO users
      (username,email,password_hash,role,status,
       permissions,edit_access,delete_access,created_date,approval_status)
      VALUES (?,?,?,?,?,?,?,?,CURDATE(),'Approved')`,
      [
        username,
        email,
        hash,
        userRole,
        'Active',
        JSON.stringify(permissions),
        JSON.stringify(editAccess),
        JSON.stringify(deleteAccess)
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful'
    });

  } catch (err) {
    console.error('Register error:', err);

    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

/* ===========================
   GET CURRENT USER
=========================== */
exports.getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT username, role FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (err) {
    console.error('GetMe error:', err);

    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
};

/* ===========================
   LOGOUT
=========================== */
exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out'
  });
};

/* ===========================
   FORGOT PASSWORD
=========================== */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const [rows] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        message: 'If email exists, reset token generated'
      });
    }

    const token = crypto.randomBytes(32).toString('hex');

    const expire = new Date(Date.now() + 3600000);

    await db.query(
      `UPDATE users
       SET password_reset_token=?,
           password_reset_expires=?
       WHERE email=?`,
      [token, expire, email]
    );

    res.json({
      success: true,
      message: 'Reset token generated',
      token
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Error'
    });
  }
};

/* ===========================
   RESET PASSWORD
=========================== */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const [rows] = await db.query(
      `SELECT id,password_reset_expires
       FROM users WHERE password_reset_token=?`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (new Date(rows[0].password_reset_expires) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Token expired'
      });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await db.query(
      `UPDATE users SET
       password_hash=?,
       password_reset_token=NULL,
       password_reset_expires=NULL
       WHERE id=?`,
      [hash, rows[0].id]
    );

    res.json({
      success: true,
      message: 'Password updated'
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Reset failed'
    });
  }
};
