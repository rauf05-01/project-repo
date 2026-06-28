const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getStats, getUsers, deleteUser } = require('../controllers/adminController');

router.get('/stats', protect, authorize('admin'), getStats);
router.get('/users', protect, authorize('admin'), getUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;