// BME/server/src/controllers/staffController.js

const db = require('../config/database');

// @desc    Get all staff
// @route   GET /api/staff
// @access  Private
exports.getAllStaff = async (req, res) => {
  try {
    const { status } = req.query; // 'active', 'all'

    let query = 'SELECT * FROM staff';
    const params = [];

    if (status === 'active') {
      query += ' WHERE status = ?';
      params.push('Active');
    }

    query += ' ORDER BY created_at DESC';

    const [staff] = await db.query(query, params);

    // Parse address JSON for each staff member
    const staffWithParsedAddress = staff.map(member => ({
  ...member,
  address: typeof member.address === 'string'
    ? JSON.parse(member.address)
    : member.address
}));

    res.json({
      success: true,
      count: staff.length,
      data: staffWithParsedAddress
    });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff data'
    });
  }
};

// @desc    Get single staff member
// @route   GET /api/staff/:id
// @access  Private
exports.getStaffById = async (req, res) => {
  try {
    const [staff] = await db.query(
      'SELECT * FROM staff WHERE id = ?',
      [req.params.id]
    );

    if (staff.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    const member = staff[0];

    const parsedAddress =
      typeof member.address === 'string'
        ? JSON.parse(member.address)
        : member.address;

    res.json({
      success: true,
      data: {
        ...member,
        address: parsedAddress
      }
    });

  } catch (error) {
    console.error('Get staff by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff member'
    });
  }
};


// @desc    Create new staff
// @route   POST /api/staff
// @access  Private (Admin, Manager)
exports.createStaff = async (req, res) => {
  try {
    const {
      staffId,
      name,
      age,
      gender,
      designation,
      mobileNo,
      introducer,
      introducerId,
      status,
      joiningDate,
      resignedDate,
      joiningDate2,
      resignedDate2,
      joiningDate3,
      resignedDate3,
      joiningDate4,
      resignedDate4,
      joiningDate5,
      resignedDate5,
      joiningDate6,
      resignedDate6,
      joiningDate7,
      resignedDate7,
      joiningDate8,
      resignedDate8,
      address
    } = req.body;

    // Validation
    if (!staffId || !name || !age || !gender || !designation || !joiningDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if staff ID already exists
    const [existing] = await db.query(
      'SELECT id FROM staff WHERE staff_id = ?',
      [staffId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Staff ID already exists'
      });
    }

    // Insert new staff
    const [result] = await db.query(
      `INSERT INTO staff (
        staff_id, name, age, gender, designation, mobile_no,
        introducer, introducer_id, status,
        joining_date, resigned_date,
        joining_date_2, resigned_date_2,
        joining_date_3, resigned_date_3,
        joining_date_4, resigned_date_4,
        joining_date_5, resigned_date_5,
        joining_date_6, resigned_date_6,
        joining_date_7, resigned_date_7,
        joining_date_8, resigned_date_8,
        address, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        staffId, name, age, gender, designation, mobileNo,
        introducer, introducerId, status || 'Active',
        joiningDate, resignedDate || null,
        joiningDate2 || null, resignedDate2 || null,
        joiningDate3 || null, resignedDate3 || null,
        joiningDate4 || null, resignedDate4 || null,
        joiningDate5 || null, resignedDate5 || null,
        joiningDate6 || null, resignedDate6 || null,
        joiningDate7 || null, resignedDate7 || null,
        joiningDate8 || null, resignedDate8 || null,
        JSON.stringify(address), req.user.username
      ]
    );

    // Log action
    await db.query(
      `INSERT INTO logs (user, user_role, action, details, ip_address, module) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.username,
        req.user.role,
        'Add Staff',
        `Added new staff member: ${name} (${staffId})`,
        req.ip,
        'Staff'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating staff member'
    });
  }
};

// @desc    Update staff
// @route   PUT /api/staff/:id
// @access  Private (Admin, Manager)
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const [existingRows] = await db.query(
      'SELECT * FROM staff WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    const fields = [];
    const values = [];

    // Map body keys to DB columns
    const fieldMap = {
      staffId: 'staff_id',
      name: 'name',
      age: 'age',
      gender: 'gender',
      designation: 'designation',
      mobileNo: 'mobile_no',
      introducer: 'introducer',
      introducerId: 'introducer_id',
      status: 'status',
      joiningDate: 'joining_date',
      resignedDate: 'resigned_date',
      joiningDate2: 'joining_date_2',
      resignedDate2: 'resigned_date_2',
      joiningDate3: 'joining_date_3',
      resignedDate3: 'resigned_date_3',
      joiningDate4: 'joining_date_4',
      resignedDate4: 'resigned_date_4',
      joiningDate5: 'joining_date_5',
      resignedDate5: 'resigned_date_5',
      joiningDate6: 'joining_date_6',
      resignedDate6: 'resigned_date_6',
      joiningDate7: 'joining_date_7',
      resignedDate7: 'resigned_date_7',
      joiningDate8: 'joining_date_8',
      resignedDate8: 'resigned_date_8'
    };

    for (const key in body) {
      if (key === 'address') {
        fields.push('address = ?');
        values.push(JSON.stringify(body.address));
      } else if (fieldMap[key]) {
        fields.push(`${fieldMap[key]} = ?`);
        values.push(body[key]);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    values.push(id);

    await db.query(
      `UPDATE staff SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Staff member updated successfully'
    });

  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// @desc    Delete staff
// @route   DELETE /api/staff/:id
// @access  Private (Admin only)
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    // Get staff details before deletion
    const [staff] = await db.query('SELECT * FROM staff WHERE id = ?', [id]);
    
    if (staff.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // Delete staff (cascade will handle related records)
    await db.query('DELETE FROM staff WHERE id = ?', [id]);

    // Log action
    await db.query(
      `INSERT INTO logs (user, user_role, action, details, ip_address, module) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.username,
        req.user.role,
        'Delete Staff',
        `Deleted staff member: ${staff[0].name} (${staff[0].staff_id})`,
        req.ip,
        'Staff'
      ]
    );

    res.json({
      success: true,
      message: 'Staff member deleted successfully'
    });
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting staff member'
    });
  }
};

// @desc    Change staff status
// @route   PATCH /api/staff/:id/status
// @access  Private (Admin, Manager)
exports.changeStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Active', 'Resigned'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Active or Resigned'
      });
    }

    // Get current staff data
    const [staff] = await db.query('SELECT * FROM staff WHERE id = ?', [id]);
    
    if (staff.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // Update status
    const updateData = {
      status,
      resigned_date: status === 'Resigned' ? new Date().toISOString().split('T')[0] : null
    };

    await db.query(
      'UPDATE staff SET status = ?, resigned_date = ? WHERE id = ?',
      [updateData.status, updateData.resigned_date, id]
    );

    // Log action
    await db.query(
      `INSERT INTO logs (user, user_role, action, details, ip_address, module) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.username,
        req.user.role,
        'Change Staff Status',
        `Changed ${staff[0].name} status to ${status}`,
        req.ip,
        'Staff'
      ]
    );

    res.json({
      success: true,
      message: `Staff status changed to ${status} successfully`
    });
  } catch (error) {
    console.error('Change status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing staff status'
    });
  }
};