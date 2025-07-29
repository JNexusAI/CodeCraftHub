const express = require('express');
const router = express.Router();
const { getCourses, createCourse } = require('../controllers/course.controller');
const { protect } = require('../middleware/auth.middleware');

// This file defines the routes for the /api/courses base path.

// Route for fetching all courses and creating a new one.
// GET /api/courses - Publicly accessible.
// POST /api/courses - Private, requires a valid JWT to create a course.
router.route('/')
  .get(getCourses)
  .post(protect, createCourse);

module.exports = router;