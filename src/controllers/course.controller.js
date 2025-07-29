const Course = require('../models/course.model');

/**
 * @desc    Get all courses
 * @route   GET /api/courses
 * @access  Public
 */
const getCourses = async (req, res) => {
  try {
    // Find all courses and populate the instructor field with their username and email
    const courses = await Course.find({}).populate('instructor', 'username email');
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Private (requires token)
 */
const createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Basic validation for required fields
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Create the course using data from the request body and the logged-in user's ID
    const course = await Course.create({
      title,
      description,
      category,
      instructor: req.user._id, // req.user is attached by the auth middleware
    });

    res.status(201).json(course);
  } catch (error) {
    // Check for a duplicate key error (for the unique title field)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A course with this title already exists.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getCourses,
  createCourse,
};