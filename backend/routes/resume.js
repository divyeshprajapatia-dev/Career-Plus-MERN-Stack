const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp_originalname
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName);
  }
});

// File filter - only allow PDF and DOC files
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Function to extract text from PDF
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to extract text from PDF: ' + error.message);
  }
};

// Function to extract text from Word document
const extractTextFromWord = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    throw new Error('Failed to extract text from Word document: ' + error.message);
  }
};

// Function to extract skills from text
const extractSkillsFromText = (text) => {
  // Common skills database - we'll expand this
  const skillsDatabase = [
    // Programming Languages
    'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'swift', 'kotlin',
    'typescript', 'scala', 'rust', 'dart', 'r', 'matlab', 'sql', 'html', 'css',
    
    // Frontend Technologies
    'react', 'angular', 'vue', 'svelte', 'jquery', 'bootstrap', 'tailwind', 'sass', 'less',
    'webpack', 'vite', 'parcel', 'redux', 'mobx', 'next.js', 'nuxt.js', 'gatsby',
    
    // Backend Technologies
    'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'asp.net',
    'fastapi', 'nestjs', 'koa', 'hapi', 'meteor',
    
    // Databases
    'mongodb', 'mysql', 'postgresql', 'sqlite', 'redis', 'cassandra', 'dynamodb',
    'firebase', 'supabase', 'prisma', 'sequelize', 'mongoose',
    
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github',
    'terraform', 'ansible', 'chef', 'puppet', 'nginx', 'apache',
    
    // Tools & Others
    'git', 'linux', 'bash', 'powershell', 'vim', 'vscode', 'intellij', 'eclipse',
    'figma', 'adobe', 'photoshop', 'illustrator', 'sketch', 'canva',
    
    // Soft Skills
    'leadership', 'teamwork', 'communication', 'problem solving', 'project management',
    'agile', 'scrum', 'kanban', 'analytical thinking', 'creativity'
  ];

  const foundSkills = [];
  const lowerText = text.toLowerCase();

  skillsDatabase.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      // Avoid duplicates
      if (!foundSkills.includes(skill)) {
        foundSkills.push(skill);
      }
    }
  });

  return foundSkills;
};

// Upload and process resume
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    console.log('📄 Resume upload attempt...');
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    let extractedText = '';

    console.log('📄 Processing file:', req.file.originalname);

    // Extract text based on file type
    if (fileType === 'application/pdf') {
      extractedText = await extractTextFromPDF(filePath);
    } else if (fileType.includes('word')) {
      extractedText = await extractTextFromWord(filePath);
    }

    // Extract skills from the text
    const extractedSkills = extractSkillsFromText(extractedText);

    console.log('✅ Extracted', extractedSkills.length, 'skills');

    // Return the results
    res.json({
      message: 'Resume processed successfully!',
      fileName: req.file.originalname,
      fileSize: req.file.size,
      skills: extractedSkills,
      textLength: extractedText.length,
      // Don't send full text in response for privacy
      preview: extractedText.substring(0, 200) + '...'
    });

  } catch (error) {
    console.error('❌ Resume processing error:', error);
    res.status(500).json({ 
      message: 'Failed to process resume', 
      error: error.message 
    });
  }
});

// Get list of common skills (for reference)
router.get('/skills', (req, res) => {
  const skillCategories = {
    'Programming Languages': ['JavaScript', 'Python', 'Java', 'C++', 'PHP'],
    'Frontend': ['React', 'Angular', 'Vue', 'HTML', 'CSS'],
    'Backend': ['Node.js', 'Django', 'Express', 'Spring', 'Laravel'],
    'Databases': ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis'],
    'Cloud': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes'],
    'Tools': ['Git', 'Linux', 'VS Code', 'Figma']
  };

  res.json({
    message: 'Available skill categories',
    categories: skillCategories
  });
});

module.exports = router;