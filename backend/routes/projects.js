
const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/multer');
const { protect, authorize } = require('../middleware/auth');
const { 
  uploadProject, 
  getMyProjects, 
  getAssignedProjects, 
  getPublicProjects, 
  updateStatus, 
  addComment,
  getLecturers 
} = require('../controllers/projectController');

router.post('/upload', protect, authorize('student'), uploadMiddleware.single('project'), uploadProject);
router.get('/my/list', protect, authorize('student'), getMyProjects);
router.get('/assigned/list', protect, authorize('lecturer'), getAssignedProjects);
router.get('/public', getPublicProjects);
router.patch('/:id/status', protect, authorize('lecturer'), updateStatus);
router.post('/:id/comments', protect, addComment);
router.get('/lecturers', getLecturers);

module.exports = router;