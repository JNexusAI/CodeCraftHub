/**
 * Mongoose schema and model for the Course resource.
 */
const mongoose = require('mongoose');

// Define the schema for the Course model
const courseSchema = new mongoose.Schema(
  {
    // The title of the course, which must be unique.
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // A detailed description of the course content.
    description: {
      type: String,
      required: true,
    },
    // The category or subject of the course (e.g., 'JavaScript', 'Docker').
    category: {
      type: String,
      required: true,
      trim: true,
    },
    // A reference to the User who created the course.
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Establishes a relationship with the User model
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields to the document.
    timestamps: true,
  }
);

// Create the Course model from the schema
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;