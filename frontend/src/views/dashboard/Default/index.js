import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";

// material-ui
import { Grid, Button,Snackbar,Alert, TextField } from '@mui/material';
import { gridSpacing } from 'store/constant';
import Filiere from 'views/filieres/Filiere';

// ==============================|| DEFAULT DASHBOARD ||============================== //

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


  const navigate = useNavigate();

  // Fonction pour récupérer tous les filières
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
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');
    
    // Vérifier si le token existe
    if (token) {
      // Extraire les informations du token (ici, nous supposons que le token est au format JWT)
      const tokenParts = token.split('.');
      const tokenPayload = JSON.parse(atob(tokenParts[1]));

      setAdminInfo({
        firstName: tokenPayload.firstName,
        lastName: tokenPayload.lastName
      });
    } else {
      console.log('Aucun token trouvé dans le localStorage');
    }
    

    // Appeler la fonction pour récupérer les données
    fetchLevels();

  }, []);

  const handleLevelClick = (levelId, levelName,sectorName) => {
    setSelectedLevelId(levelId);
    setSelectedLevelName(levelName);
    setSelectedSectorName(sectorName);
    setActiveLevelId(levelId);

    // Format the URL path with lowercase sectorName and levelName
    const path = `/filieres/${sectorName.toLowerCase()}/${levelName.toLowerCase()}`;
    
    // Redirect to the formatted URL path
    navigate(path);
    setSelectedId(levelId);
  };

  const handleAddFiliere = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SPRING_BASE_URL}/api/levels/createFiliere`, sectorAbbreviation, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      fetchLevels();
      setSectorAbbreviation('');
      setShowForm(false);
      setSnackbarSeverity('success');
      setSnackbarMessage('Filière ajoutée avec succès');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error adding filiere:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Erreur d\'ajout de filière');
      setOpenSnackbar(true);
    }
  };
  // const handleSnackbarOpen = (message) => {
  //   setSnackbarMessage(message);
  //   setOpenSnackbar(true);
  // };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Si le token n'existe pas, ne rend pas ce composant
  if (!localStorage.getItem('token')){
    navigate('/') 
    window.location.reload()
  }

  return (
    <Grid container spacing={gridSpacing} justifyContent={'center'} alignItems={'center'}>
      <Grid item xs={12} lg={12} marginTop={'16px'}>
        {/* Bouton pour ajouter une filière */}
        <Button onClick={() => setShowForm(!showForm)}>Ajouter une filière</Button>
        
        {/* Formulaire pour ajouter une filière */}
        {showForm && (
  <form style={{ backgroundColor: '#f4f4f4', padding: '16px', borderRadius: '10px', marginBottom: '16px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%'}}>
    <TextField
      label="Abbreviation du secteur"
      variant="outlined"
      value={sectorAbbreviation}
      onChange={(e) => setSectorAbbreviation(e.target.value)}
      fullWidth
      style={{ marginBottom: '16px' }}
    />
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddFiliere}
        style={{ borderRadius: '8px', textTransform: 'none', width: 'fit-content' }}
      >
        Ajouter
      </Button>
    </div>
  </form>
)}

        <Grid container spacing={gridSpacing}>
          {levels.map((level) => (
            <Grid item lg={4} md={6} sm={6} xs={12} key={level.levelId}>
              <motion.div
                layoutId={level.levelId}
                onClick={() => handleLevelClick(level.levelId, level.levelName, level.sectorName)}
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
            </Grid>
          ))}
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
              open={openSnackbar}
              autoHideDuration={4000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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
      </Grid>
    </Grid>
  );
};

export default Dashboard;
