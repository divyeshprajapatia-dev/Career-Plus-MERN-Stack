const express = require('express');
const JobRole = require('../models/JobRole');

const router = express.Router();

// Function to calculate compatibility between user skills and job requirements
const calculateCompatibility = (userSkills, jobRequiredSkills) => {
  let totalPossibleScore = 0;
  let userScore = 0;
  const matchingSkills = [];
  const missingSkills = [];

  // Go through each required skill for the job
  jobRequiredSkills.forEach(requirement => {
    const skillName = requirement.skill.toLowerCase();
    const importance = requirement.importance; // 1-10 scale
    
    // Add to total possible score (weighted by importance)
    totalPossibleScore += importance;
    
    // Check if user has this skill
    const userHasSkill = userSkills.some(userSkill => 
      userSkill.toLowerCase().includes(skillName) || 
      skillName.includes(userSkill.toLowerCase())
    );
    
    if (userHasSkill) {
      // User has this skill - add to their score
      userScore += importance;
      matchingSkills.push({
        skill: requirement.skill,
        importance: importance,
        level: requirement.level
      });
    } else {
      // User doesn't have this skill - add to missing skills
      missingSkills.push({
        skill: requirement.skill,
        importance: importance,
        level: requirement.level
      });
    }
  });

  // Calculate percentage
  const compatibilityPercentage = totalPossibleScore > 0 
    ? Math.round((userScore / totalPossibleScore) * 100) 
    : 0;

  return {
    compatibilityPercentage,
    userScore,
    totalPossibleScore,
    matchingSkills,
    missingSkills
  };
};

// Function to generate learning recommendations for missing skills
const generateRecommendations = (missingSkills) => {
  const recommendations = missingSkills.map(skillObj => {
    const skill = skillObj.skill;
    
    return {
      skill: skill,
      importance: skillObj.importance,
      level: skillObj.level,
      estimatedLearningTime: getEstimatedLearningTime(skill, skillObj.level),
      resources: {
        videos: [
          `${skill} tutorial for beginners`,
          `Learn ${skill} in 2024`,
          `${skill} crash course`
        ],
        courses: [
          `Complete ${skill} Course`,
          `${skill} for ${skillObj.level}s`,
          `Master ${skill} Development`
        ]
      }
    };
  });

  // Sort by importance (most important skills first)
  return recommendations.sort((a, b) => b.importance - a.importance);
};

// Helper function to estimate learning time
const getEstimatedLearningTime = (skill, level) => {
  const timeEstimates = {
    'beginner': '2-4 weeks',
    'intermediate': '1-3 months', 
    'advanced': '3-6 months'
  };
  
  return timeEstimates[level] || '1-2 months';
};

// API endpoint to match user skills with a specific job
router.post('/analyze', async (req, res) => {
  try {
    const { userSkills, jobId } = req.body;
    
    console.log('🎯 Starting skill matching analysis...');
    console.log('📊 User skills:', userSkills);
    console.log('💼 Job ID:', jobId);

    // Validate input
    if (!userSkills || !Array.isArray(userSkills)) {
      return res.status(400).json({
        message: 'User skills are required and must be an array'
      });
    }

    if (!jobId) {
      return res.status(400).json({
        message: 'Job ID is required'
      });
    }

    // Get the job from database
    const job = await JobRole.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }

    // Calculate compatibility
    const analysis = calculateCompatibility(userSkills, job.requiredSkills);
    
    // Generate learning recommendations for missing skills
    const recommendations = generateRecommendations(analysis.missingSkills);

    // Create the complete analysis result
    const result = {
      job: {
        id: job._id,
        title: job.title,
        category: job.category,
        description: job.description
      },
      userSkills: userSkills,
      analysis: {
        compatibilityPercentage: analysis.compatibilityPercentage,
        scoreBreakdown: {
          userScore: analysis.userScore,
          totalPossibleScore: analysis.totalPossibleScore
        },
        matchingSkills: analysis.matchingSkills,
        missingSkills: analysis.missingSkills,
        skillsAnalysis: {
          totalRequiredSkills: job.requiredSkills.length,
          skillsMatched: analysis.matchingSkills.length,
          skillsMissing: analysis.missingSkills.length
        }
      },
      recommendations: recommendations,
      learningPath: {
        prioritySkills: recommendations.slice(0, 3), // Top 3 most important
        estimatedTimeToImprove: calculateTotalLearningTime(recommendations.slice(0, 3)),
        nextSteps: generateNextSteps(analysis.compatibilityPercentage, recommendations)
      }
    };

    console.log(`✅ Analysis complete! Compatibility: ${analysis.compatibilityPercentage}%`);
    console.log(`📊 Skills matched: ${analysis.matchingSkills.length}/${job.requiredSkills.length}`);

    res.json({
      message: 'Skill matching analysis completed successfully',
      result: result
    });

  } catch (error) {
    console.error('❌ Error in skill matching:', error);
    res.status(500).json({
      message: 'Failed to analyze skill matching',
      error: error.message
    });
  }
});

// Helper function to calculate total learning time
const calculateTotalLearningTime = (prioritySkills) => {
  const timeMap = {
    '2-4 weeks': 3,
    '1-3 months': 8,
    '3-6 months': 18
  };
  
  const totalWeeks = prioritySkills.reduce((total, skill) => {
    return total + (timeMap[skill.estimatedLearningTime] || 8);
  }, 0);
  
  if (totalWeeks < 8) return `${totalWeeks} weeks`;
  return `${Math.round(totalWeeks / 4)} months`;
};

// Helper function to generate next steps
const generateNextSteps = (compatibilityPercentage, recommendations) => {
  if (compatibilityPercentage >= 80) {
    return [
      "🎉 Great match! You're ready to apply for this role",
      "Focus on the few missing skills to become an even stronger candidate",
      "Consider preparing for technical interviews"
    ];
  } else if (compatibilityPercentage >= 60) {
    return [
      "👍 Good foundation! Focus on the missing high-importance skills",
      "Start with the top 2-3 priority skills",
      "You could apply while learning these skills"
    ];
  } else if (compatibilityPercentage >= 40) {
    return [
      "📚 You have potential! Focus on learning the core skills",
      "Start with the most important missing skills",
      "Consider entry-level positions in this field first"
    ];
  } else {
    return [
      "🌱 This role requires significant skill development",
      "Focus on building foundational skills first",
      "Consider taking a comprehensive course in this field"
    ];
  }
};

// API endpoint to get quick compatibility scores for multiple jobs
router.post('/quick-match', async (req, res) => {
  try {
    const { userSkills } = req.body;
    
    console.log('⚡ Running quick match for all jobs...');

    if (!userSkills || !Array.isArray(userSkills)) {
      return res.status(400).json({
        message: 'User skills are required and must be an array'
      });
    }

    // Get all jobs
    const jobs = await JobRole.find({});
    
    // Calculate quick compatibility for each job
    const quickMatches = jobs.map(job => {
      const analysis = calculateCompatibility(userSkills, job.requiredSkills);
      
      return {
        jobId: job._id,
        title: job.title,
        category: job.category,
        compatibilityPercentage: analysis.compatibilityPercentage,
        skillsMatched: analysis.matchingSkills.length,
        totalSkillsRequired: job.requiredSkills.length
      };
    });

    // Sort by compatibility (best matches first)
    quickMatches.sort((a, b) => b.compatibilityPercentage - a.compatibilityPercentage);

    console.log(`✅ Quick match complete for ${jobs.length} jobs`);

    res.json({
      message: 'Quick matching completed successfully',
      userSkills: userSkills,
      totalJobsAnalyzed: jobs.length,
      matches: quickMatches
    });

  } catch (error) {
    console.error('❌ Error in quick matching:', error);
    res.status(500).json({
      message: 'Failed to perform quick matching',
      error: error.message
    });
  }
});

module.exports = router;