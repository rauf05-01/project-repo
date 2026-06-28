const db = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await db.query('SELECT COUNT(*) FROM users');
    const totalProjects = await db.query('SELECT COUNT(*) FROM projects');
    const approvedProjects = await db.query("SELECT COUNT(*) FROM projects WHERE status = 'approved'");
    
    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalProjects: parseInt(totalProjects.rows[0].count),
      approvedProjects: parseInt(approvedProjects.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};