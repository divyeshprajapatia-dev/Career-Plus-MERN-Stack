const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// This is like a form that defines what user information we store
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    currentRole: {
      type: String,
      default: ''
    },
    experience: {
      type: Number,
      default: 0
    },
    location: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt
});

// This function runs before saving a user - it encrypts the password
userSchema.pre('save', async function(next) {
  // Only hash the password if it's been modified (or is new)
  if (!this.isModified('password')) return next();
  
  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// This function helps us check if a password is correct
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);