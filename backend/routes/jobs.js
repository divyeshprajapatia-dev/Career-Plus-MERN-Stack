const express = require('express');
const JobRole = require('../models/JobRole');

const router = express.Router();

// Get all job roles
router.get('/', async (req, res) => {
  try {
    console.log('📋 Getting all job roles...');
    
    const jobs = await JobRole.find({});
    
    console.log(`✅ Found ${jobs.length} job roles`);
    
    res.json({
      message: 'Jobs retrieved successfully',
      count: jobs.length,
      jobs: jobs
    });

  } catch (error) {
    console.error('❌ Error getting jobs:', error);
    res.status(500).json({
      message: 'Failed to get job roles',
      error: error.message
    });
  }
});

// Get jobs by category
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    console.log(`📋 Getting jobs for category: ${category}`);
    
    const jobs = await JobRole.find({ 
      category: { $regex: category, $options: 'i' } // Case insensitive search
    });
    
    console.log(`✅ Found ${jobs.length} jobs in ${category} category`);
    
    res.json({
      message: `Jobs in ${category} category`,
      category: category,
      count: jobs.length,
      jobs: jobs
    });

  } catch (error) {
    console.error('❌ Error getting jobs by category:', error);
    res.status(500).json({
      message: 'Failed to get jobs by category',
      error: error.message
    });
  }
});

// Get a specific job by ID
router.get('/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    console.log(`📋 Getting job with ID: ${jobId}`);
    
    const job = await JobRole.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }
    
    console.log(`✅ Found job: ${job.title}`);
    
    res.json({
      message: 'Job retrieved successfully',
      job: job
    });

  } catch (error) {
    console.error('❌ Error getting job by ID:', error);
    res.status(500).json({
      message: 'Failed to get job',
      error: error.message
    });
  }
});

// Get all unique job categories
router.get('/meta/categories', async (req, res) => {
  try {
    console.log('📊 Getting job categories...');
    
    const categories = await JobRole.distinct('category');
    
    console.log(`✅ Found ${categories.length} categories:`, categories);
    
    res.json({
      message: 'Categories retrieved successfully',
      count: categories.length,
      categories: categories
    });

  } catch (error) {
    console.error('❌ Error getting categories:', error);
    res.status(500).json({
      message: 'Failed to get categories',
      error: error.message
    });
  }
});

// Search jobs by title or skills
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    console.log(`🔍 Searching jobs for: ${query}`);
    
    const jobs = await JobRole.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'requiredSkills.skill': { $regex: query, $options: 'i' } }
      ]
    });
    
    console.log(`✅ Found ${jobs.length} jobs matching "${query}"`);
    
    res.json({
      message: `Search results for "${query}"`,
      query: query,
      count: jobs.length,
      jobs: jobs
    });

  } catch (error) {
    console.error('❌ Error searching jobs:', error);
    res.status(500).json({
      message: 'Failed to search jobs',
      error: error.message
    });
  }
});

module.exports = router;