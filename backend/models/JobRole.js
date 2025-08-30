const mongoose = require('mongoose');

// This defines what information we store for each job role
const jobRoleSchema = new mongoose.Schema({
  // Basic job information
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Skills required for this job
  requiredSkills: [{
    skill: {
      type: String,
      required: true
    },
    importance: {
      type: Number,
      required: true,
      min: 1,
      max: 10  // 1 = nice to have, 10 = absolutely essential
    },
    level: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced']
    }
  }],
  
  // Experience requirements
  experienceRange: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 10
    }
  },
  
  // Salary range (optional)
  salaryRange: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

// Export the model so we can use it in other files
module.exports = mongoose.model('JobRole', jobRoleSchema);