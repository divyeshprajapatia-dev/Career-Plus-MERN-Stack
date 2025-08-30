import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, 
  CircularProgress, Alert, Chip, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Accordion, AccordionSummary, AccordionDetails,
  Divider, List, ListItem, ListItemText
} from '@mui/material';
import {
  Work, TrendingUp, School, ExpandMore, 
  CheckCircle, Cancel, PlayCircleOutline
} from '@mui/icons-material';
import axios from 'axios';

function JobMatching({ userSkills }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Load all jobs when component mounts
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('📋 Loading available jobs...');
      const response = await axios.get('http://localhost:5000/api/jobs');
      
      setJobs(response.data.jobs);
      console.log(`✅ Loaded ${response.data.jobs.length} jobs`);
      
    } catch (error) {
      console.error('❌ Error loading jobs:', error);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeJobMatch = async (job) => {
    if (!userSkills || userSkills.length === 0) {
      setError('Please upload your resume first to extract skills');
      return;
    }

    setAnalyzing(true);
    setSelectedJob(job);
    setError('');

    try {
      console.log(`🎯 Analyzing match for: ${job.title}`);
      console.log('👤 User skills:', userSkills);

      const response = await axios.post('http://localhost:5000/api/matching/analyze', {
        userSkills: userSkills,
        jobId: job._id
      });

      setAnalysisResult(response.data.result);
      setDialogOpen(true);
      
      console.log('✅ Analysis complete:', response.data.result.analysis.compatibilityPercentage + '%');

    } catch (error) {
      console.error('❌ Error analyzing job match:', error);
      setError('Failed to analyze job match. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getCompatibilityColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'info';
    if (percentage >= 40) return 'warning';
    return 'error';
  };

  const getCompatibilityText = (percentage) => {
    if (percentage >= 80) return 'Excellent Match!';
    if (percentage >= 60) return 'Good Match';
    if (percentage >= 40) return 'Partial Match';
    return 'Needs Development';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading available jobs...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        💼 Job Matching
      </Typography>
      
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Find jobs that match your skills and see what you need to learn
      </Typography>

      {/* Skills Summary */}
      {userSkills && userSkills.length > 0 && (
        <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🎯 Your Skills ({userSkills.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {userSkills.map((skill, index) => (
                <Chip 
                  key={index} 
                  label={skill} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Job Cards */}
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} md={6} key={job._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Work color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    {job.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  📂 {job.category}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {job.description.substring(0, 100)}...
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" gutterBottom>
                  <strong>Required Skills ({job.requiredSkills.length}):</strong>
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {job.requiredSkills.slice(0, 6).map((skillObj, index) => (
                    <Chip 
                      key={index}
                      label={skillObj.skill}
                      size="small"
                      color={userSkills && userSkills.some(userSkill => 
                        userSkill.toLowerCase().includes(skillObj.skill.toLowerCase())
                      ) ? 'success' : 'default'}
                      variant="outlined"
                    />
                  ))}
                  {job.requiredSkills.length > 6 && (
                    <Chip 
                      label={`+${job.requiredSkills.length - 6} more`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary">
                  💼 Experience: {job.experienceRange.min}-{job.experienceRange.max} years
                </Typography>
                
                {job.salaryRange.min > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    💰 Salary: ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
                  </Typography>
                )}
              </CardContent>
              
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={analyzing && selectedJob?._id === job._id ? <CircularProgress size={20} /> : <TrendingUp />}
                  onClick={() => analyzeJobMatch(job)}
                  disabled={analyzing || !userSkills || userSkills.length === 0}
                >
                  {analyzing && selectedJob?._id === job._id ? 'Analyzing...' : 'Analyze Match'}
                </Button>
                
                {!userSkills || userSkills.length === 0 ? (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                    Upload resume first
                  </Typography>
                ) : null}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Analysis Results Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {analysisResult && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Work sx={{ mr: 1 }} />
                {analysisResult.job.title} - Match Analysis
              </Box>
            </DialogTitle>
            
            <DialogContent dividers>
              {/* Compatibility Score */}
              <Card sx={{ mb: 3, bgcolor: `${getCompatibilityColor(analysisResult.analysis.compatibilityPercentage)}.50` }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color={`${getCompatibilityColor(analysisResult.analysis.compatibilityPercentage)}.main`}>
                    {analysisResult.analysis.compatibilityPercentage}%
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {getCompatibilityText(analysisResult.analysis.compatibilityPercentage)}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={analysisResult.analysis.compatibilityPercentage}
                    color={getCompatibilityColor(analysisResult.analysis.compatibilityPercentage)}
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  />
                </CardContent>
              </Card>

              {/* Skills Analysis */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="success.main">
                        {analysisResult.analysis.matchingSkills.length}
                      </Typography>
                      <Typography variant="body2">Skills Matched</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Cancel color="error" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="error.main">
                        {analysisResult.analysis.missingSkills.length}
                      </Typography>
                      <Typography variant="body2">Skills Missing</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Matching Skills */}
              {analysisResult.analysis.matchingSkills.length > 0 && (
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">
                      ✅ Your Matching Skills ({analysisResult.analysis.matchingSkills.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {analysisResult.analysis.matchingSkills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={`${skill.skill} (${skill.importance}/10)`}
                          color="success"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Missing Skills */}
              {analysisResult.analysis.missingSkills.length > 0 && (
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">
                      📚 Skills to Learn ({analysisResult.analysis.missingSkills.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {analysisResult.analysis.missingSkills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={`${skill.skill} (${skill.importance}/10)`}
                          color="error"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Learning Recommendations */}
              {analysisResult.recommendations.length > 0 && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">
                      🎯 Priority Learning Path
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {analysisResult.learningPath.prioritySkills.map((skill, index) => (
                        <ListItem key={index} divider>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <School color="primary" />
                                <Typography variant="subtitle1">
                                  {skill.skill}
                                </Typography>
                                <Chip 
                                  label={`Priority: ${skill.importance}/10`} 
                                  size="small" 
                                  color="primary"
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  ⏱️ Estimated learning time: {skill.estimatedLearningTime}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  📊 Level required: {skill.level}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Card sx={{ mt: 2, bgcolor: 'info.50' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          📅 Learning Plan Summary
                        </Typography>
                        <Typography variant="body2">
                          <strong>Total estimated time:</strong> {analysisResult.learningPath.estimatedTimeToImprove}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Next steps:</strong>
                        </Typography>
                        <List dense>
                          {analysisResult.learningPath.nextSteps.map((step, index) => (
                            <ListItem key={index}>
                              <ListItemText primary={step} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </AccordionDetails>
                </Accordion>
              )}
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>
                Close
              </Button>
              <Button variant="contained" disabled>
                Start Learning (Coming Soon)
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default JobMatching;