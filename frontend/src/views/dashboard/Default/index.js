import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { Grid, Snackbar, Alert, Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import { gridSpacing } from 'store/constant';
import Filiere from 'views/filieres/Filiere';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';  // Icône d'ajout

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);
  const [levels, setLevels] = useState([]);
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [selectedLevelName, setSelectedLevelName] = useState(null);
  const [selectedSectorName, setSelectedSectorName] = useState(null);
  const [activeLevelId, setActiveLevelId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sectorAbbreviation, setSectorAbbreviation] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDialogFeild, setOpenDialogFeild] = useState(false);
  const [newFiliereAbbreviation, setNewFiliereAbbreviation] = useState('');

  const navigate = useNavigate();

  const fetchLevels = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/levels`);
      const formattedLevels = response.data.map(level => ({
        levelId: level.levelId,
        levelName: level.levelName,
        sectorName: level.sectorName,
      }));
      setLevels(formattedLevels);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching levels:', error);
    }
  };

  useEffect(() => {
    setLoading(false);
    const token = localStorage.getItem('token');
    if (token) {
      const tokenParts = token.split('.');
      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      setAdminInfo({
        firstName: tokenPayload.firstName,
        lastName: tokenPayload.lastName
      });
    } else {
      console.log('Aucun token trouvé dans le localStorage');
    }
    fetchLevels();
  }, []);

  const handleLevelClick = (levelId, levelName, sectorName) => {
    setSelectedLevelId(levelId);
    setSelectedLevelName(levelName);
    setSelectedSectorName(sectorName);
    setActiveLevelId(levelId);
    const path = `/filieres/${sectorName.toLowerCase()}/${levelName.toLowerCase()}`;
    navigate(path);
    setSelectedId(levelId);
  };

  const handleAddFiliere = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SPRING_BASE_URL}/api/levels/createFiliere`, newFiliereAbbreviation, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      fetchLevels();
      setNewFiliereAbbreviation('');
      setOpenDialogFeild(false);
      setSnackbarSeverity('success');
      setSnackbarMessage('Filière ajoutée avec succès.');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la filière :', error);
      let errorMessage = 'Erreur lors de l\'ajout de la filière !';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const openAddFiliereDialog = () => {
    setOpenDialogFeild(true);
  };

  const closeResetDialogFeild = () => {
    setOpenDialogFeild(false);
  };

  if (!localStorage.getItem('token')) {
    navigate('/');
    window.location.reload();
  }

  return (
    <Grid container spacing={gridSpacing} justifyContent={'center'} alignItems={'center'} style={{ minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
      <Grid item xs={12} lg={12} marginTop={'16px'}>
        <Dialog
          open={openDialogFeild}
          onClose={closeResetDialogFeild}
          PaperProps={{
            style: {
              minHeight: '150px',  // Hauteur ajustée
            },
          }}
        >
          <DialogTitle>Ajouter une filière</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Entrez l'abréviation de la nouvelle filière :
            </DialogContentText>
            <br />
            <TextField
              autoFocus
              margin="dense"
              label="Abréviation de la filière"
              type="text"
              fullWidth
              value={newFiliereAbbreviation}
              onChange={(e) => setNewFiliereAbbreviation(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeResetDialogFeild} color="primary">
              Annuler
            </Button>
            <Button onClick={handleAddFiliere} color="primary">
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>

        <Grid container spacing={gridSpacing} sx={{ marginBottom: '450px' }}>
          {levels.length === 0 ? (
            <Grid item xs={12} sx={{ marginTop: '40px' }}>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.8 }}
                  style={{
                    textAlign: 'center',
                    fontSize: '4rem',
                    fontWeight: 'bold',
                    fontFamily: '"Poppins", sans-serif',
                    color: '#4caf50',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                  }}
                >
                  <WavingHandIcon fontSize="large" style={{ color: '#3f51b5', marginBottom: '40px' }} />
                  <Typography variant="h1" component="h1" style={{ fontSize: 'inherit', fontFamily: '"Poppins", sans-serif' }}>
                    Bienvenue au <span style={{ color: '#3f51b5' }}>QRABS</span>
                  </Typography>
                  <div
                    onClick={openAddFiliereDialog}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',  // Change cursor to pointer
                      marginTop: '40px'
                    }}
                  >
                    <AddCircleOutlineIcon fontSize="large" style={{ color: '#3f51b5', fontSize: '7rem' }} />
                    <Typography variant="h6" style={{ marginTop: '8px', fontSize: '1.5rem', fontFamily: '"Poppins", sans-serif' }}>
                      Ajouter une filière
                    </Typography>
                  </div>
                </motion.div>
              </AnimatePresence>
            </Grid>
          ) : (
            levels.map((level) => (
              <Grid item lg={4} md={6} sm={6} xs={12} key={level.levelId}>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  layoutId={level.levelId}
                  onClick={() => handleLevelClick(level.levelId, level.levelName, level.sectorName)}
                  style={{ cursor: 'pointer' }} // Ajoute un curseur pointer pour indiquer la cliquabilité
                >
                  <Filiere 
                    isLoading={isLoading} 
                    levelId={level.levelId}
                    levelName={level.levelName} 
                    sectorName={level.sectorName}
                    isActive={activeLevelId === level.levelId}
                    onClick={() => handleLevelClick(level.levelId, level.levelName, level.sectorName)}
                  />
                </motion.div>
              </AnimatePresence>
            </Grid>
            ))
          )}
          <AnimatePresence>
            {selectedId && (
              <motion.div
                layoutId={selectedId}
                key={selectedId}
                exit={{ opacity: 0 }}
              >
                <Filiere 
                  isLoading={isLoading} 
                  levelId={selectedLevelId}
                  levelName={selectedLevelName} 
                  sectorName={selectedSectorName}
                  isActive={true}
                  onClick={() => setSelectedId(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>

        <Snackbar
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={openSnackbar}
          autoHideDuration={2500}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {levels.length > 0 && (
          <IconButton
            onClick={openAddFiliereDialog}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              backgroundColor: '#1976d2',
              color: 'white',
              borderRadius: '50%',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
};

export default Dashboard;



// import React, { useEffect, useState } from 'react';
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';
// import { motion, AnimatePresence } from "framer-motion";

// // material-ui
// import { Grid, Button,Snackbar,Alert, TextField } from '@mui/material';
// import { gridSpacing } from 'store/constant';
// import Filiere from 'views/filieres/Filiere';

// // ==============================|| DEFAULT DASHBOARD ||============================== //

// const Dashboard = () => {
//   const [isLoading, setLoading] = useState(true);
//   const [adminInfo, setAdminInfo] = useState(null);
//   const [levels, setLevels] = useState([]);
//   const [selectedLevelId, setSelectedLevelId] = useState(null);
//   const [selectedLevelName, setSelectedLevelName] = useState(null);
//   const [selectedSectorName, setSelectedSectorName] = useState(null);
//   const [activeLevelId, setActiveLevelId] = useState(null);
//   const [selectedId, setSelectedId] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [sectorAbbreviation, setSectorAbbreviation] = useState('');
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarSeverity, setSnackbarSeverity] = useState('success');


//   const navigate = useNavigate();

//   // Fonction pour récupérer tous les filières
//   const fetchLevels = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/levels`);
//       const formattedLevels = response.data.map(level => ({
//         levelId: level.levelId,
//         levelName: level.levelName,
//         sectorName: level.sectorName,
//       }));
//       setLevels(formattedLevels);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching levels:', error);
//     }
//   };
//   useEffect(() => {
//     setLoading(false);
//     // Récupérer le token depuis le localStorage
//     const token = localStorage.getItem('token');
    
//     // Vérifier si le token existe
//     if (token) {
//       // Extraire les informations du token (ici, nous supposons que le token est au format JWT)
//       const tokenParts = token.split('.');
//       const tokenPayload = JSON.parse(atob(tokenParts[1]));

//       setAdminInfo({
//         firstName: tokenPayload.firstName,
//         lastName: tokenPayload.lastName
//       });
//     } else {
//       console.log('Aucun token trouvé dans le localStorage');
//     }
    

//     // Appeler la fonction pour récupérer les données
//     fetchLevels();

//   }, []);

//   const handleLevelClick = (levelId, levelName,sectorName) => {
//     setSelectedLevelId(levelId);
//     setSelectedLevelName(levelName);
//     setSelectedSectorName(sectorName);
//     setActiveLevelId(levelId);

//     // Format the URL path with lowercase sectorName and levelName
//     const path = `/filieres/${sectorName.toLowerCase()}/${levelName.toLowerCase()}`;
    
//     // Redirect to the formatted URL path
//     navigate(path);
//     setSelectedId(levelId);
//   };

//   const handleAddFiliere = async () => {
//     try {
//       const response = await axios.post(`${process.env.REACT_APP_SPRING_BASE_URL}/api/levels/createFiliere`, sectorAbbreviation, {
//         headers: {
//           'Content-Type': 'text/plain'
//         }
//       });
//       fetchLevels();
//       setSectorAbbreviation('');
//       setShowForm(false);
//       setSnackbarSeverity('success');
//       setSnackbarMessage('Filière ajoutée avec succès');
//       setOpenSnackbar(true);
//     } catch (error) {
//       console.error('Error adding filiere:', error);
//       setSnackbarSeverity('error');
//       setSnackbarMessage('Erreur d\'ajout de filière');
//       setOpenSnackbar(true);
//     }
//   };
//   // const handleSnackbarOpen = (message) => {
//   //   setSnackbarMessage(message);
//   //   setOpenSnackbar(true);
//   // };
//   const handleSnackbarClose = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpenSnackbar(false);
//   };

//   // Si le token n'existe pas, ne rend pas ce composant
//   if (!localStorage.getItem('token')){
//     navigate('/') 
//     window.location.reload()
//   }

//   return (
//     <Grid container spacing={gridSpacing} justifyContent={'center'} alignItems={'center'}>
//       <Grid item xs={12} lg={12} marginTop={'16px'}>
//         {/* Bouton pour ajouter une filière */}
//         {/*<Button onClick={() => setShowForm(!showForm)}>Ajouter une filière</Button>*/}
        
//         {/* Formulaire pour ajouter une filière */}
//         {showForm && (
//   <form style={{ backgroundColor: '#f4f4f4', padding: '16px', borderRadius: '10px', marginBottom: '16px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%'}}>
//     <TextField
//       label="Abbreviation du secteur"
//       variant="outlined"
//       value={sectorAbbreviation}
//       onChange={(e) => setSectorAbbreviation(e.target.value)}
//       fullWidth
//       style={{ marginBottom: '16px' }}
//     />
//     <div style={{ display: 'flex', justifyContent: 'center' }}>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleAddFiliere}
//         style={{ borderRadius: '8px', textTransform: 'none', width: 'fit-content' }}
//       >
//         Ajouter
//       </Button>
//     </div>
//   </form>
// )}

//         <Grid container spacing={gridSpacing}>
//           {levels.map((level) => (
//             <Grid item lg={4} md={6} sm={6} xs={12} key={level.levelId}>
//               <motion.div
//                 layoutId={level.levelId}
//                 onClick={() => handleLevelClick(level.levelId, level.levelName, level.sectorName)}
//               >
//                 <Filiere 
//                   isLoading={isLoading} 
//                   levelId={level.levelId}
//                   levelName={level.levelName} 
//                   sectorName={level.sectorName}
//                   isActive={activeLevelId === level.levelId}
//                   onClick={() => handleLevelClick(level.levelId, level.levelName, level.sectorName)}
//                 />
//               </motion.div>
//             </Grid>
//           ))}
//           <AnimatePresence>
//             {selectedId && (
//               <motion.div
//                 layoutId={selectedId}
//                 key={selectedId}
//                 exit={{ opacity: 0 }}
//               >
//                 <Filiere 
//                   isLoading={isLoading} 
//                   levelId={selectedLevelId}
//                   levelName={selectedLevelName} 
//                   sectorName={selectedSectorName}
//                   isActive={true}
//                   onClick={() => setSelectedId(null)}
//                 />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </Grid>
//         <Snackbar
//               open={openSnackbar}
//               autoHideDuration={4000}
//               onClose={handleSnackbarClose}
//               anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//             >
//               <Alert 
//                 severity={snackbarSeverity}
//                 onClose={handleSnackbarClose}
//                 variant="filled"
//                 sx={{ width: '100%' }}
//               >
//               {snackbarMessage}
//               </Alert>
//             </Snackbar>
//       </Grid>
//     </Grid>
//   );
// };

// export default Dashboard;
