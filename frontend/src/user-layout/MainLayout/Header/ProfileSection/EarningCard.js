import { useState } from 'react';
import axios from 'axios';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography, Button, Snackbar, Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Import the icon

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';

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

const EarningCard = ({ abr }) => {
  const theme = useTheme();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedStudentFile, setSelectedStudentFile] = useState(null);
  const [selectedSessionFile, setSelectedSessionFile] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  // Function to handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files);
  };

  const handleStudentFileChange = (event) => {
    setSelectedStudentFile(event.target.files[0]);
  };

  const handleSessionFileChange = (event) => {
    setSelectedSessionFile(event.target.files[0]);
  };

  // Function to handle importing students from the selected file
  const handleImportStudents = () => {
    if (selectedStudentFile) {
      const formData = new FormData();
      formData.append('file', selectedStudentFile);

      axios.post(`${process.env.REACT_APP_SPRING_BASE_URL}/api/students/upload`, formData)
        .then((response) => {
          console.log('Students uploaded:');
          setSnackbarSeverity('success');
          setSnackbarMessage('Students uploaded successfully');
          setOpenSnackbar(true);
          handleClose();
        })
        .catch((error) => {
          if (error.response) {
            const errorMessage = error.response?.data?.message || 'An error occurred during file upload';
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
          } else {
            // Error not from the server
            setSnackbarMessage('Error uploading students');
          }
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        });
    }
  };

  // Function to handle importing sessions from the selected file
  const handleImportSessions = () => {
    if (selectedSessionFile) {
      const formData = new FormData();
      formData.append('file', selectedSessionFile);

      axios.post(`${process.env.REACT_APP_SPRING_BASE_URL}/api/session/upload`, formData)
        .then((response) => {
          console.log('Sessions uploaded:', response.data);
          setSnackbarSeverity('success');
          setSnackbarMessage('Sessions uploaded successfully');
          setOpenSnackbar(true);
          handleClose();
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.message || 'An error occurred during file upload';
          setSnackbarMessage(errorMessage);
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        });
    }
  };

  const handleImportPictures = () => {
    if (selectedFile) {
      const formData = new FormData();

      for (const file of selectedFile) {
        formData.append('files', file);
      }

      axios.post(`${process.env.REACT_APP_SPRING_BASE_URL}/api/import-files/upload`, formData)
        .then((response) => {
          console.log('Images uploaded:', response.data);
          setSnackbarSeverity('success');
          setSnackbarMessage('Images uploaded successfully');
          setOpenSnackbar(true);
          handleClose();
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.message || 'An error occurred during file upload';
          setSnackbarMessage(errorMessage);
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          handleClose();
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
                  <Grid item></Grid>
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
                      <MenuItem>
                        <input
                          type="file"
                          accept=".xls,.xlsx"
                          onChange={handleStudentFileChange}
                          style={{ border: `1px solid ${theme.palette.primary.main}`, padding: '8px', borderRadius: '12px' }}
                        />
                        <Button component="span" startIcon={<GetAppTwoToneIcon sx={{ mr: 1.75 }} />} onClick={handleImportStudents}>
                          Importer Etudiants
                        </Button>
                      </MenuItem>
                      <MenuItem>
                        <input
                          type="file"
                          accept=".xls,.xlsx"
                          onChange={handleSessionFileChange}
                          style={{ border: `1px solid ${theme.palette.primary.main}`, padding: '8px', borderRadius: '12px' }}
                        />
                        <Button component="span" startIcon={<GetAppTwoToneIcon sx={{ mr: 1.75 }} />} onClick={handleImportSessions}>
                          Importer Emploi
                        </Button>
                      </MenuItem>
                      <MenuItem>
                        <input
                          type="file"
                          multiple
                          accept="image/jpeg, image/png, image/gif, image/bmp"
                          onChange={handleFileChange}
                          style={{ border: `1px solid ${theme.palette.primary.main}`, padding: '8px', borderRadius: '12px' }}
                        />
                        <Button component="span" startIcon={<GetAppTwoToneIcon sx={{ mr: 1.75 }} />} onClick={handleImportPictures}>
                          Importer Pictures
                        </Button>
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
              <Grid item marginTop={'-30px'}>
                    <Typography sx={{ fontSize: '2.125rem', fontWeight: 500 }}>{abr}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              {/* Ajout des icônes et des labels */}
              <Grid container alignItems="center" justifyContent='center' spacing={2}>
                <Grid item>
                  <CheckCircleOutlineIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
                  <Typography variant="subtitle2">Emploi du temps</Typography>
                </Grid>
                <Grid item>
                  <CheckCircleOutlineIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
                  <Typography variant="subtitle2">Liste des étudiants</Typography>
                </Grid>
              </Grid>
          </Box>
        </CardWrapper>

    </>
  );
};


export default EarningCard;

