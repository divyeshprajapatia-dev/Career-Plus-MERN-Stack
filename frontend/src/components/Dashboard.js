import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Card, CardContent, Tab, Tabs } from '@mui/material';
import ResumeUpload from './ResumeUpload';
import JobMatching from './JobMatching';  // 👈 ADD THIS IMPORT

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState(0);
  const [uploadedResume, setUploadedResume] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUploadSuccess = (resumeData) => {
    setUploadedResume(resumeData);
    console.log('✅ Resume uploaded successfully:', resumeData);
  };

  // Extract skills from uploaded resume for job matching
  const userSkills = uploadedResume ? uploadedResume.skills : [];

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, p: 2 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4">
              🎯Career+ Dashboard
            </Typography>
            <Typography variant="h6" color="primary">
              Welcome back, {user.name}! 👋
            </Typography>
          </Box>
          <Button variant="outlined" color="secondary" onClick={onLogout}>
            🚪 Logout
          </Button>
        </Box>
      </Paper>

      {/* Navigation Tabs */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="📊 Overview" />
          <Tab label="📄 Upload Resume" />
          <Tab label="💼 Job Matching" />
          <Tab label="📚 Learning Path" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          {/* User Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                👤 Your Profile
              </Typography>
              <Typography><strong>Name:</strong> {user.name}</Typography>
              <Typography><strong>Email:</strong> {user.email}</Typography>
              <Typography><strong>Member since:</strong> {new Date().toLocaleDateString()}</Typography>
              
              {uploadedResume && (
                <Box sx={{ mt: 2 }}>
                  <Typography color="success.main">
                    <strong>✅ Resume Status:</strong> Uploaded and analyzed
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {uploadedResume.skills.length} skills detected from {uploadedResume.fileName}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          {uploadedResume && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📈 Quick Stats
                </Typography>
                <Box display="flex" gap={4} flexWrap="wrap">
                  <Box>
                    <Typography variant="h4" color="primary.main">
                      {uploadedResume.skills.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Skills Detected
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" color="secondary.main">
                      6
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Jobs Available
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" color="info.main">
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Courses Completed
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🚀 Next Steps
              </Typography>
              {!uploadedResume ? (
                <Box>
                  <Typography gutterBottom>
                    Get started by uploading your resume:
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => setActiveTab(1)}
                    sx={{ mt: 1 }}
                  >
                    📄 Upload Resume
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography gutterBottom>
                    Great! Your resume is uploaded. What's next?
                  </Typography>
                  <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
                    <Button 
                      variant="contained" 
                      onClick={() => setActiveTab(2)}
                      color="primary"
                    >
                      💼 Find Job Matches
                    </Button>
                    <Button variant="contained" disabled>
                      📚 Get Learning Recommendations (Coming Soon)
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {activeTab === 1 && (
        <ResumeUpload onUploadSuccess={handleUploadSuccess} />
      )}

      {activeTab === 2 && (
        <JobMatching userSkills={userSkills} />  // 👈 ADD THIS
      )}

      {activeTab === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📚 Learning Path
            </Typography>
            <Typography color="text.secondary">
              Coming soon! This will recommend courses to improve your skills.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default Dashboard;