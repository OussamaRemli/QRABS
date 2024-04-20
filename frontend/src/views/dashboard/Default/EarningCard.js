import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';



// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography,Button,Snackbar,Alert  } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: '#0B6E4F',
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: '#08A045',
    borderRadius: '50%',
    top: -120,
    right: -125,
    opacity: 0.8,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -160
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: '#08A045',
    borderRadius: '50%',
    top: -155,
    right: -60,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCard = ({ isLoading,name,abr }) => {
  const theme = useTheme();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  // Function to handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  // Function to handle importing students from the selected file
  const handleImportStudents = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      axios.post('http://localhost:8011/api/students/upload', formData)
        .then((response) => {
          console.log('Students uploaded:');
          setSnackbarSeverity('success');
          setSnackbarMessage('Students uploaded successfully');
          setOpenSnackbar(true);
          handleClose();
        })
        .catch((error) => {
          console.error('Error uploading students:', error);
          setSnackbarSeverity('error');
          setSnackbarMessage('Error uploading students');
          setOpenSnackbar(true);
        });
    }
  };
  // Function to handle importing sessions from the selected file
  const handleImportSessions = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      axios.post('http://localhost:8011/api/session/upload', formData)
        .then((response) => {
          console.log('Sessions uploaded:', response.data);
          setSnackbarSeverity('success');
          setSnackbarMessage('Sessions uploaded successfully');
          setOpenSnackbar(true);
          handleClose();
        })
        .catch((error) => {
          console.error('Error uploading sessions:', error);
          setSnackbarSeverity('error');
          setSnackbarMessage('Error uploading sessions');
          setOpenSnackbar(true);
        });
    }
  };
  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };   
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 1.25 }}>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={4000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert 
                severity={snackbarSeverity}
                onClose={handleSnackbarClose}
                variant="filled"
                sx={{ width: '100%' }}
              >
              {snackbarMessage}
              </Alert>
            </Snackbar>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    
                  </Grid>
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        backgroundColor: '#0B6E4F',
                        color: theme.palette.secondary[200],
                        zIndex: 1
                      }}
                      aria-controls="menu-earning-card"
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      <MoreHorizIcon fontSize="inherit" />
                    </Avatar>
                    <Menu
                      id="menu-earning-card"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      variant="selectedMenu"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                    >
                      <MenuItem onClick={handleImportStudents}>
                        {/* <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Import Liste Etudiants */}
                        <input
                          type="file"
                          accept=".xls,.xlsx"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                          id="file-upload"
                        />
                        <label htmlFor="file-upload">
                          <Button component="span" startIcon={<GetAppTwoToneIcon sx={{ mr: 1.75 }} />}>
                            Import Liste Etudiants
                          </Button>
                        </label>
                      </MenuItem>
                      {/* <MenuItem onClick={handleClose}>
                        <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Import Emploi Du Temps
                      </MenuItem> */}
                      <MenuItem onClick={handleImportSessions}>
                        {/* <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Import Liste Etudiants */}
                        <input
                          type="file"
                          accept=".xls,.xlsx"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                          id="file-upload"
                        />
                        <label htmlFor="file-upload">
                          <Button component="span" startIcon={<GetAppTwoToneIcon sx={{ mr: 1.75 }} />}>
                            Import Emploi Du Temps
                          </Button>
                        </label>
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center" justifyContent='center'>
                  <Grid item marginTop={'-30px'}>
                    <Typography sx={{ fontSize: '2.125rem', fontWeight: 500}}>{abr}</Typography>
                  </Grid>
                  <Grid item>
                    {/* <Avatar
                      sx={{
                        cursor: 'pointer',
                        ...theme.typography.smallAvatar,
                        backgroundColor: theme.palette.secondary[200],
                        color: theme.palette.secondary.dark
                      }}
                    >
                      <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                    </Avatar> */}
                  </Grid>
                </Grid>
              </Grid>
              <Grid container alignItems="center" justifyContent='center'>
                <Grid item sx={{ mb: 1 }}>
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'primary.light'
                    }}
                  >
                    {name}
                  </Typography>
                </Grid>
                </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool
};

export default EarningCard;
