import React, { useState } from 'react';
import {
  Box, Button, Typography, Paper, Alert, LinearProgress,
  Card, CardContent, Chip, Grid, Divider
} from '@mui/material';
import { CloudUpload, Description, CheckCircle } from '@mui/icons-material';
import axios from 'axios';

function ResumeUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please select a PDF or Word document');
        return;
      }
      
      // Check file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
      setError('');
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');

    try {
      console.log('📄 Uploading resume:', file.name);
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post(
        'http://localhost:5000/api/resume/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('✅ Upload successful:', response.data);
      setResult(response.data);
      
      // Call parent callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

    } catch (error) {
      console.error('❌ Upload failed:', error);
      setError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResult(null);
    setError('');
    // Reset file input
    const fileInput = document.getElementById('resume-file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        📄 Upload Your Resume
      </Typography>
      
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Upload your resume in PDF or Word format and we'll extract your skills automatically
      </Typography>

      {/* Upload Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        {!result ? (
          <>
            {/* File Selection */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <input
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                id="resume-file-input"
                type="file"
                onChange={handleFileSelect}
              />
              <label htmlFor="resume-file-input">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<Description />}
                  sx={{ mb: 2 }}
                >
                  Choose Resume File
                </Button>
              </label>
              
              {file && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Upload Button */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<CloudUpload />}
                onClick={handleUpload}
                disabled={!file || uploading}
                sx={{ px: 4 }}
              >
                {uploading ? '🔄 Processing...' : '🚀 Upload & Analyze'}
              </Button>
            </Box>

            {/* Progress Bar */}
            {uploading && (
              <Box sx={{ mt: 3 }}>
                <LinearProgress />
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                  Extracting text and analyzing skills...
                </Typography>
              </Box>
            )}
          </>
        ) : (
          /* Success Results */
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CheckCircle color="success" sx={{ mr: 1 }} />
              <Typography variant="h6" color="success.main">
                Resume Processed Successfully!
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>File:</strong> {result.fileName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Size:</strong> {(result.fileSize / 1024).toFixed(1)} KB
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Text Length:</strong> {result.textLength} characters
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              🎯 Extracted Skills ({result.skills.length})
            </Typography>
            
            {result.skills.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {result.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            ) : (
              <Alert severity="warning" sx={{ mb: 3 }}>
                No skills detected. Try uploading a more detailed resume.
              </Alert>
            )}

            {/* Text Preview */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📝 Text Preview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {result.preview}
                </Typography>
              </CardContent>
            </Card>

            <Box sx={{ textAlign: 'center' }}>
              <Button variant="outlined" onClick={resetUpload}>
                📄 Upload Another Resume
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tips */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            💡 Tips for Better Results
          </Typography>
          <ul>
            <li>Use a detailed resume with clear skill mentions</li>
            <li>Include technical skills, programming languages, and tools</li>
            <li>PDF format usually gives better text extraction results</li>
            <li>Make sure your resume is not image-based (scanned documents won't work well)</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ResumeUpload;