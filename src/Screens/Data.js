import React from 'react';
import { Card, CardContent, Typography, Button, TextField, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CloudDownload } from '@mui/icons-material';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function Data() {
  const cardOptions = [
    {
      title: 'Cities Data',
      url: 'URL: firebaseForCities',
      uploadAction: 'uploadCities',
      downloadAction: 'downloadCities',
    },
    {
      title: 'Dance Forms Data',
      url: 'URL: firebaseDanceForms',
      uploadAction: 'uploadDanceForms',
      downloadAction: 'downloadDanceForms',
    },
  ];

  const handleButtonClick = (action) => {
    // Handle button click based on action (upload, signin, download)
    switch (action) {
      case 'uploadCities':
        // Handle upload cities data functionality
        break;
      case 'downloadCities':
        // Handle download cities data functionality
        break;
      case 'uploadDanceForms':
        // Handle upload dance forms data functionality
        break;
      case 'downloadDanceForms':
        // Handle download dance forms data functionality
        break;
      default:
        break;
    }
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      {cardOptions.map((option, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Card style={{ width: '100%', margin: '10px' }}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {option.title}
              </Typography>
              <br/>
              <TextField
                label="Upload .json File"
                type="file"
                accept="json/*"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <div style={{ marginTop: '10px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginRight: '10px' }}
                  onClick={() => handleButtonClick(option.uploadAction)}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload
                  
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleButtonClick(option.downloadAction)}
                  startIcon={<CloudDownload />}
                >
                  Download
                  
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default Data;
