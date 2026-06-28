const db = require('../config/db');
const upload = require('../middleware/multer');

// exports.uploadProject = async (req, res) => {
//   const { title, description } = req.body;
//   const student_id = req.user.id;
//   const file_path = req.file ? `/uploads/${req.file.filename}` : null;

//   try {
//     const result = await db.query(
//       `INSERT INTO projects (title, description, student_id, file_path) 
//        VALUES ($1, $2, $3, $4) RETURNING *`,
//       [title, description, student_id, file_path]
//     );
//     res.status(201).json({ message: 'Project uploaded successfully', project: result.rows[0] });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.getMyProjects = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM projects WHERE student_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAssignedProjects = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT p.*, u.name as student_name FROM projects p JOIN users u ON p.student_id = u.id WHERE p.lecturer_id = $1 ORDER BY p.created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPublicProjects = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, u.name as student_name 
       FROM projects p JOIN users u ON p.student_id = u.id 
       WHERE p.status = 'approved' ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, lecturer_id } = req.body;

  try {
    const result = await db.query(
      'UPDATE projects SET status = $1, lecturer_id = $2 WHERE id = $3 RETURNING *',
      [status, lecturer_id || req.user.id, id]
    );
    res.json({ message: 'Status updated', project: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const user_id = req.user.id;

  try {
    const result = await db.query(
      'INSERT INTO comments (project_id, user_id, comment) VALUES ($1, $2, $3) RETURNING *',
      [id, user_id, comment]
    );
    res.status(201).json({ message: 'Comment added', comment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadProject = async (req, res) => {
  const { title, description, lecturer_id } = req.body;
  const student_id = req.user.id;
  const file_path = req.file ? `/uploads/${req.file.filename}` : null;

  if (!lecturer_id) {
    return res.status(400).json({ message: 'Please select a lecturer' });
  }

  try {
    const result = await db.query(
      `INSERT INTO projects (title, description, student_id, lecturer_id, file_path, status) 
       VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
      [title, description, student_id, lecturer_id, file_path]
    );
    res.status(201).json({ 
      message: 'Project uploaded and assigned successfully!', 
      project: result.rows[0] 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all lecturers for student dropdown
exports.getLecturers = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name FROM users WHERE role = 'lecturer' ORDER BY name"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};