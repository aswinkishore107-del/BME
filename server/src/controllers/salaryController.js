const db = require('../config/database');

exports.getMonthlySalaries = async (req, res) => {
  try {
    const { startDate, endDate, staffId } = req.query;
    let query = `
      SELECT s.*, st.name as staff_name, st.designation, st.status as staff_status
      FROM salaries s
      LEFT JOIN staff st ON s.staff_id = st.staff_id
      WHERE s.date BETWEEN ? AND ?
    `;
    const params = [startDate, endDate];

    if (staffId) {
      query += ' AND s.staff_id = ?';
      params.push(staffId);
    }

    query += ' ORDER BY s.date DESC, s.created_at DESC';

    const [salaries] = await db.query(query, params);
    const total = salaries.reduce((sum, s) => sum + s.salary, 0);

    res.json({
      success: true,
      count: salaries.length,
      total,
      data: salaries
    });
  } catch (error) {
    console.error('Get salaries error:', error);
    res.status(500).json({ success: false, message: 'Error fetching salaries' });
  }
};

exports.createSalaryPayment = async (req, res) => {
  try {
    const { date, staffId, salary, paymentMode } = req.body;

    // Get staff details
    const [staff] = await db.query('SELECT name, designation FROM staff WHERE staff_id = ?', [staffId]);
    if (staff.length === 0) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    const [result] = await db.query(
      `INSERT INTO salaries (date, staff_id, staff_name, designation, salary, payment_mode, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [date, staffId, staff[0].name, staff[0].designation, salary, paymentMode, req.user.username]
    );

    // Log action
    await db.query(
      `INSERT INTO logs (user, user_role, action, details, ip_address, module) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.username, req.user.role, 'Pay Salary', `Paid salary of ₹${salary} to ${staff[0].name} (${paymentMode})`, req.ip, 'Salary']
    );

    res.status(201).json({ success: true, message: 'Salary payment recorded successfully', data: { id: result.insertId } });
  } catch (error) {
    console.error('Create salary error:', error);
    res.status(500).json({ success: false, message: 'Error recording salary payment' });
  }
};

exports.updateSalaryPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, staffId, salary, paymentMode } = req.body;

    const [existing] = await db.query('SELECT id FROM salaries WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Salary record not found' });
    }

    const [staff] = await db.query('SELECT name, designation FROM staff WHERE staff_id = ?', [staffId]);
    if (staff.length === 0) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    await db.query(
      `UPDATE salaries SET date=?, staff_id=?, staff_name=?, designation=?, salary=?, payment_mode=? WHERE id=?`,
      [date, staffId, staff[0].name, staff[0].designation, salary, paymentMode, id]
    );

    await db.query(
      `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.username, req.user.role, 'Update Salary', `Updated salary #${id} for ${staff[0].name}`, req.ip, 'Salary']
    );

    res.json({ success: true, message: 'Salary payment updated successfully' });
  } catch (error) {
    console.error('Update salary error:', error);
    res.status(500).json({ success: false, message: 'Error updating salary payment' });
  }
};

exports.deleteSalaryPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT id, staff_name, salary, date FROM salaries WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Salary record not found' });
    }

    await db.query('DELETE FROM salaries WHERE id = ?', [id]);

    await db.query(
      `INSERT INTO logs (user, user_role, action, details, ip_address, module) VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.username, req.user.role, 'Delete Salary', `Deleted salary ₹${existing[0].salary} for ${existing[0].staff_name} on ${existing[0].date}`, req.ip, 'Salary']
    );

    res.json({ success: true, message: 'Salary payment deleted successfully' });
  } catch (error) {
    console.error('Delete salary error:', error);
    res.status(500).json({ success: false, message: 'Error deleting salary payment' });
  }
};