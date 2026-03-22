const db = require('../config/database');

// ✅ Matches DB ENUM exactly:
// status ENUM('Present', 'Absent', 'Morning Half', 'Afternoon Half', 'Day Off')
const VALID_STATUS = ['Present', 'Absent', 'Morning Half', 'Afternoon Half', 'Day Off'];

// ✅ Matches DB ENUM exactly:
// reason ENUM('Medical Leave', 'Function', 'Others')
const VALID_REASON = ['Medical Leave', 'Function', 'Others'];


/* ============================
   GET ALL ATTENDANCE
============================ */
exports.getAllAttendance = async (req, res) => {
  try {
    const { date, startDate, endDate, staffId } = req.query;

    let query = `
      SELECT a.*, s.name AS staff_name, s.designation
      FROM attendance a
      LEFT JOIN staff s ON a.staff_id = s.staff_id
    `;

    const params = [];
    const conditions = [];

    // date takes priority over date range
    if (date) {
      conditions.push('a.date = ?');
      params.push(date);
    } else if (startDate && endDate) {
      conditions.push('a.date BETWEEN ? AND ?');
      params.push(startDate, endDate);
    }

    // staffId can combine with any date filter
    if (staffId) {
      conditions.push('a.staff_id = ?');
      params.push(staffId);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY a.date DESC, a.created_at DESC';

    const [attendance] = await db.query(query, params);

    res.json({
      success: true,
      count: attendance.length,
      data: attendance
    });

  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ success: false, message: 'Error fetching attendance' });
  }
};


/* ============================
   CREATE ATTENDANCE
============================ */
exports.createAttendance = async (req, res) => {
  try {
    const { date, staffId, status, checkInTime, checkOutTime, reason, reasonDetails } = req.body;

    // Validate required fields
    if (!date || !staffId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Date, staffId and status are required'
      });
    }

    // ✅ Validate status against DB ENUM
    if (!VALID_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUS.join(', ')}`
      });
    }

    // ✅ Validate reason against DB ENUM (only if provided)
    if (reason && !VALID_REASON.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: `Invalid reason. Must be one of: ${VALID_REASON.join(', ')}`
      });
    }

    // Check duplicate attendance (DB has UNIQUE KEY on staff_id + date)
    const [existing] = await db.query(
      'SELECT id FROM attendance WHERE date = ? AND staff_id = ?',
      [date, staffId]
    );
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already recorded for this staff on this date'
      });
    }

    // Validate staff exists
    const [staff] = await db.query('SELECT name FROM staff WHERE staff_id = ?', [staffId]);
    if (staff.length === 0) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    const [result] = await db.query(
      `INSERT INTO attendance 
        (date, staff_id, staff_name, status, check_in_time, check_out_time, reason, reason_details, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        date,
        staffId,
        staff[0].name,
        status,
        checkInTime   || null,
        checkOutTime  || null,
        reason        || null,
        reasonDetails || null,
        req.user.username
      ]
    );

    await db.query(
      `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.username, req.user.role, 'Add Attendance', `Added attendance for ${staff[0].name} on ${date}`, req.ip, 'Attendance']
    );

    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully',
      data: { id: result.insertId }
    });

  } catch (error) {
    console.error('Create attendance error:', error);
    res.status(500).json({ success: false, message: 'Error recording attendance' });
  }
};


/* ============================
   UPDATE ATTENDANCE
============================ */
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, staffId, status, checkInTime, checkOutTime, reason, reasonDetails } = req.body;

    // ✅ Validate status against DB ENUM (only if provided)
    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUS.join(', ')}`
      });
    }

    // ✅ Validate reason against DB ENUM (only if provided)
    if (reason && !VALID_REASON.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: `Invalid reason. Must be one of: ${VALID_REASON.join(', ')}`
      });
    }

    // ✅ SELECT * to get all current values for safe fallback
    const [existing] = await db.query('SELECT * FROM attendance WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    const current = existing[0];

    // ✅ Safe fallback: use body value if sent, else keep existing DB value
    const staffIdToUse   = staffId      ?? current.staff_id;
    const dateToUse      = date         ?? current.date;
    const statusToUse    = status       ?? current.status;
    const checkInToUse   = checkInTime  !== undefined ? (checkInTime  || null) : current.check_in_time;
    const checkOutToUse  = checkOutTime !== undefined ? (checkOutTime || null) : current.check_out_time;
    const reasonToUse    = reason       !== undefined ? (reason       || null) : current.reason;
    const reasonDetToUse = reasonDetails!== undefined ? (reasonDetails|| null) : current.reason_details;

    // Validate staff
    const [staff] = await db.query('SELECT name FROM staff WHERE staff_id = ?', [staffIdToUse]);
    if (staff.length === 0) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    await db.query(
      `UPDATE attendance SET
        date           = ?,
        staff_id       = ?,
        staff_name     = ?,
        status         = ?,
        check_in_time  = ?,
        check_out_time = ?,
        reason         = ?,
        reason_details = ?
       WHERE id = ?`,
      [
        dateToUse,
        staffIdToUse,
        staff[0].name,
        statusToUse,
        checkInToUse,
        checkOutToUse,
        reasonToUse,
        reasonDetToUse,
        id
      ]
    );

    await db.query(
      `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.username, req.user.role, 'Update Attendance', `Updated attendance #${id} for ${staff[0].name}`, req.ip, 'Attendance']
    );

    res.json({ success: true, message: 'Attendance updated successfully' });

  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ success: false, message: 'Error updating attendance' });
  }
};


/* ============================
   DELETE ATTENDANCE
============================ */
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query(
      'SELECT staff_name, date FROM attendance WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    await db.query('DELETE FROM attendance WHERE id = ?', [id]);

    await db.query(
      `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.username, req.user.role, 'Delete Attendance', `Deleted attendance for ${existing[0].staff_name} on ${existing[0].date}`, req.ip, 'Attendance']
    );

    res.json({ success: true, message: 'Attendance deleted successfully' });

  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(500).json({ success: false, message: 'Error deleting attendance' });
  }
};