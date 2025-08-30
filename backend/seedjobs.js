const mongoose = require('mongoose');
const JobRole = require('./models/JobRole');
require('dotenv').config();

// Sample job data - these are real jobs with real skill requirements
const sampleJobs = [
  {
    title: "Frontend Developer",
    category: "Web Development",
    description: "Build user interfaces and web applications using modern frontend technologies.",
    requiredSkills: [
      { skill: "javascript", importance: 10, level: "intermediate" },
      { skill: "react", importance: 9, level: "intermediate" },
      { skill: "html", importance: 8, level: "intermediate" },
      { skill: "css", importance: 8, level: "intermediate" },
      { skill: "git", importance: 7, level: "beginner" },
      { skill: "typescript", importance: 6, level: "beginner" },
      { skill: "redux", importance: 5, level: "beginner" }
    ],
    experienceRange: { min: 1, max: 3 },
    salaryRange: { min: 60000, max: 90000, currency: "USD" }
  },
  
  {
    title: "Backend Developer",
    category: "Web Development", 
    description: "Develop server-side applications, APIs, and database systems.",
    requiredSkills: [
      { skill: "node.js", importance: 10, level: "intermediate" },
      { skill: "javascript", importance: 9, level: "intermediate" },
      { skill: "mongodb", importance: 8, level: "intermediate" },
      { skill: "express", importance: 8, level: "intermediate" },
      { skill: "sql", importance: 7, level: "beginner" },
      { skill: "git", importance: 7, level: "beginner" },
      { skill: "aws", importance: 6, level: "beginner" }
    ],
    experienceRange: { min: 1, max: 4 },
    salaryRange: { min: 65000, max: 95000, currency: "USD" }
  },

  {
    title: "Full Stack Developer",
    category: "Web Development",
    description: "Work on both frontend and backend development of web applications.",
    requiredSkills: [
      { skill: "javascript", importance: 10, level: "intermediate" },
      { skill: "react", importance: 9, level: "intermediate" },
      { skill: "node.js", importance: 9, level: "intermediate" },
      { skill: "mongodb", importance: 8, level: "intermediate" },
      { skill: "express", importance: 8, level: "intermediate" },
      { skill: "html", importance: 7, level: "intermediate" },
      { skill: "css", importance: 7, level: "intermediate" },
      { skill: "git", importance: 7, level: "beginner" }
    ],
    experienceRange: { min: 2, max: 5 },
    salaryRange: { min: 70000, max: 110000, currency: "USD" }
  },

  {
    title: "Python Developer",
    category: "Software Development",
    description: "Develop applications and systems using Python programming language.",
    requiredSkills: [
      { skill: "python", importance: 10, level: "intermediate" },
      { skill: "django", importance: 8, level: "intermediate" },
      { skill: "flask", importance: 7, level: "beginner" },
      { skill: "postgresql", importance: 7, level: "beginner" },
      { skill: "git", importance: 6, level: "beginner" },
      { skill: "linux", importance: 6, level: "beginner" }
    ],
    experienceRange: { min: 1, max: 4 },
    salaryRange: { min: 60000, max: 85000, currency: "USD" }
  },

  {
    title: "Data Scientist",
    category: "Data Science",
    description: "Analyze complex data to help companies make better decisions.",
    requiredSkills: [
      { skill: "python", importance: 10, level: "advanced" },
      { skill: "machine learning", importance: 9, level: "intermediate" },
      { skill: "sql", importance: 8, level: "intermediate" },
      { skill: "r", importance: 7, level: "beginner" },
      { skill: "statistics", importance: 8, level: "intermediate" },
      { skill: "pandas", importance: 8, level: "intermediate" },
      { skill: "numpy", importance: 7, level: "intermediate" }
    ],
    experienceRange: { min: 2, max: 6 },
    salaryRange: { min: 80000, max: 130000, currency: "USD" }
  },

  {
    title: "DevOps Engineer",
    category: "Infrastructure",
    description: "Manage deployment pipelines and cloud infrastructure.",
    requiredSkills: [
      { skill: "aws", importance: 10, level: "intermediate" },
      { skill: "docker", importance: 9, level: "intermediate" },
      { skill: "kubernetes", importance: 8, level: "intermediate" },
      { skill: "linux", importance: 8, level: "intermediate" },
      { skill: "jenkins", importance: 7, level: "beginner" },
      { skill: "terraform", importance: 6, level: "beginner" },
      { skill: "git", importance: 7, level: "beginner" }
    ],
    experienceRange: { min: 2, max: 5 },
    salaryRange: { min: 75000, max: 120000, currency: "USD" }
  }
];

// Function to add jobs to database
async function seedJobs() {
  try {
    console.log('🌱 Starting to seed job data...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing jobs (so we don't have duplicates)
    await JobRole.deleteMany({});
    console.log('🗑️  Cleared existing job data');

    // Add new jobs
    const createdJobs = await JobRole.insertMany(sampleJobs);
    console.log(`✅ Successfully added ${createdJobs.length} jobs:`);
    
    createdJobs.forEach(job => {
      console.log(`   - ${job.title} (${job.requiredSkills.length} skills)`);
    });

    console.log('');
    console.log('🎉 Job seeding completed successfully!');
    console.log('You can now test the job matching features.');
    
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
  }
}

// Run the seeding function
seedJobs();