import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography, Button, Snackbar, Alert } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';

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
      right: -160,
    },
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
      right: -70,
    },
  },
}));

const EarningCard = ({ isLoading, name, abr }) => {
  const theme = useTheme();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedStudentFile, setSelectedStudentFile] = useState(null);
  const [selectedSessionFile, setSelectedSessionFile] = useState(null);
  const [hasSchedule, setHasSchedule] = useState(false);
  const [hasStudents, setHasStudents] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/levels/has-schedule?levelName=${abr}`)
      .then((response) => {
        setHasSchedule(response.data);
      })
      .catch((error) => console.error('Il y a eu une erreur!', error));

    axios
      .get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/levels/has-students?levelName=${abr}`)
      .then((response) => {
        setHasStudents(response.data);
      })
      .catch((error) => console.error('Il y a eu une erreur!', error));
  }, [abr]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files);
  };
  const handleStudentFileChange = (event) => {
    setSelectedStudentFile(event.target.files[0]);
  };
  const handleSessionFileChange = (event) => {
    setSelectedSessionFile(event.target.files[0]);
  };

  const handleImportStudents = () => {
    if (selectedStudentFile) {
      const formData = new FormData();
      formData.append('file', selectedStudentFile);

      axios
        .post(`${process.env.REACT_APP_SPRING_BASE_URL}/api/students/upload`, formData)
        .then((response) => {
          setSnackbarSeverity('success');
          setSnackbarMessage('Students uploaded successfully');
          setOpenSnackbar(true);
          setHasStudents(true); // Update hasStudents state
          handleClose();
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.message || 'Erreur d\'importation de fichier';
          setSnackbarMessage(errorMessage);
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        });
    }
  };

  const handleImportSessions = () => {
    if (selectedSessionFile) {
      const formData = new FormData();
      formData.append('file', selectedSessionFile);

      axios
        .post(`${process.env.REACT_APP_SPRING_BASE_URL}/api/session/upload`, formData)
        .then((response) => {
          setSnackbarSeverity('success');
          setSnackbarMessage('Sessions uploaded successfully');
          setOpenSnackbar(true);
          setHasSchedule(true); // Update hasSchedule state
          handleClose();
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.message || 'Erreur d\'importation de fichier';
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

      axios
        .post(`${process.env.REACT_APP_SPRING_BASE_URL}/api/import-files/upload`, formData)
        .then((response) => {
          setSnackbarSeverity('success');
          setSnackbarMessage('Images uploaded successfully');
          setOpenSnackbar(true);
          handleClose();
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.message || 'Erreur d\'importation de fichier';
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
              <Alert severity={snackbarSeverity} onClose={handleSnackbarClose} variant="filled" sx={{ width: '100%' }}>
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
                        zIndex: 1,
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
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
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
                <Grid container alignItems="center" justifyContent="center">
                  <Grid item marginTop={'-30px'}>
                    <Typography sx={{ fontSize: '2.125rem', fontWeight: 500 }}>{abr}</Typography>
                  </Grid>
                  <Grid item></Grid>
                </Grid>
              </Grid>
              <Grid container alignItems="center" justifyContent="center">
                <Grid item sx={{ mb: 1 }}></Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
              <Grid item container alignItems="center" xs={6}>
                <IconButton size="small">
                  {hasSchedule ? (
                    <CheckCircleIcon style={{ color: '#08A045', fontSize: 'small' }} />
                  ) : (
                    <CancelIcon style={{ color: 'red', fontSize: 'small' }} />
                  )}
                </IconButton>
                <Typography variant="subtitle1" style={{ color: '#FFF', marginLeft: '5px', fontSize: '0.7rem' }}>
                  Emploi du temps
                </Typography>
              </Grid>
              <Grid item container alignItems="center" xs={6}>
                <IconButton size="small">
                  {hasStudents ? (
                    <CheckCircleIcon style={{ color: '#08A045', fontSize: 'small' }} />
                  ) : (
                    <CancelIcon style={{ color: 'red', fontSize: 'small' }} />
                  )}
                </IconButton>
                <Typography variant="subtitle1" style={{ color: '#FFF', marginLeft: '5px', fontSize: '0.7rem' }}>
                  Liste des étudiants
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default EarningCard;
