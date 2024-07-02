import { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  // Avatar,
  Box,
  // Card,
  // CardContent,
  Chip,
  ClickAwayListener,
  Divider,
  // Grid,
  // InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  // OutlinedInput,
  Paper,
  Popper,
  Stack,
  // Switch,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';

import PerfectScrollbar from 'react-perfect-scrollbar';

import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';

import { IconLogout, IconSettings } from '@tabler/icons-react';


// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const navigate = useNavigate();
  const [professorInfo, setProfessorInfo] = useState(null);
  useEffect(() => {
      // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');
    
    // Vérifier si le token existe
    if (token) {
      // Extraire les informations du token (ici, nous supposons que le token est au format JWT)
      const tokenParts = token.split('.');
      const tokenPayload = JSON.parse(atob(tokenParts[1]));

      setProfessorInfo({
        firstName: tokenPayload.firstName,
        lastName: tokenPayload.lastName
      });
    } else {
      console.log('Aucun token trouvé dans le localStorage');
    }
      }, []);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleLogout = () => {
    setOpenLogoutDialog(true); // Ouvrir la boîte de dialogue de déconnexion
  };
  const confirmLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };
  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false); // Fermer la boîte de dialogue de déconnexion
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== '') {
      navigate(route);
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  const handleAccountSettingsClick = () => {
    navigate('/setting');
  };



  if (!localStorage.getItem('token')){
    navigate('/')
    window.location.reload();
  }
  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Dialog open={openLogoutDialog} onClose={handleCloseLogoutDialog}>
        <DialogTitle sx={{fontSize: '1.25rem', fontWeight: 'bold' }}>Êtes-vous sûr de vouloir vous déconnecter ?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '1rem', color: 'text.secondary' }}>
            En vous déconnectant, vous serez redirigé vers la page de connexion.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{padding: '8px 24px' }}>
          <Button onClick={handleCloseLogoutDialog} color="primary" variant="outlined" sx={{ marginRight: '16px', borderRadius: '8px', textTransform: 'none' }}>Annuler</Button>
          <Button onClick={confirmLogout} color="primary" variant="contained" autoFocus sx={{ borderRadius: '8px', textTransform: 'none' }}>Se déconnecter</Button>
        </DialogActions>
      </Dialog>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">Bonjour,</Typography>
                        <Typography component="span" variant="h3" sx={{ fontWeight: 400 }}>
                        {professorInfo && professorInfo.firstName && professorInfo.lastName ? `${professorInfo.firstName} ${professorInfo.lastName}` : 'Professeur :)'}!
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                  <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                    <Box sx={{ p: 2 }}>
                      <Divider />
                      <Divider />
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0.5
                          }
                        }}
                      >
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          selected={selectedIndex === 0}
                          onClick={handleAccountSettingsClick}
                        >
                          <ListItemIcon>
                            <IconSettings stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Paramètres</Typography>} />
                        </ListItemButton>
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          selected={selectedIndex === 4}
                          onClick={handleLogout}
                        >
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Se déconnecter</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
