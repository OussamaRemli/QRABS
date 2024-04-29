import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// material-ui
import { Grid } from '@mui/material';
import { gridSpacing } from 'store/constant';
import Filiere from 'views/filieres/Filiere';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);
  const [levels,setLevels]=useState([]);
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [selectedLevelName, setSelectedLevelName] = useState(null);
  const [selectedSectorName, setSelectedSectorName] = useState(null);
  const [activeLevelId, setActiveLevelId] = useState(null);
  
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(false);
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');
    
    // Vérifier si le token existe
    if (token) {
      // Extraire les informations du token (ici, nous supposons que le token est au format JWT)
      const tokenParts = token.split('.');
      const tokenPayload = JSON.parse(atob(tokenParts[1]));

      // Afficher les informations dans la console
      // console.log('Informations de l\'admin :', tokenPayload);
      setAdminInfo({
        firstName: tokenPayload.firstName,
        lastName: tokenPayload.lastName
      });
    } else {
      console.log('Aucun token trouvé dans le localStorage');
    }
    // Fonction pour récupérer tous les filières
    const fetchLevels = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/levels');
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

    // Appeler la fonction pour récupérer les données
    fetchLevels();

  }, []);
  const handleLevelClick = (levelId, levelName,sectorName) => {
    setSelectedLevelId(levelId);
    setSelectedLevelName(levelName);
    setSelectedSectorName(sectorName);
    setActiveLevelId(levelId);
  };

  // Si le token n'existe pas, ne rend pas ce composant
  if (!localStorage.getItem('token')){
    navigate('/') 
    window.location.reload()
  }

  return (
    <Grid container spacing={gridSpacing} justifyContent={'center'} alignItems={'center'}>
      <Grid item xs={12} lg={12} marginTop={'16px'}>
        <Grid container spacing={gridSpacing}>
        {levels.map((level) => (
          <Grid item lg={4} md={6} sm={6} xs={12}>
                <Filiere 
                  key={level.levelId} 
                  isLoading={isLoading} 
                  levelId={level.levelId}
                  levelName={level.levelName} 
                  sectorName={level.sectorName}
                  isActive={activeLevelId === level.levelId}
                  onClick={() => handleLevelClick(level.levelId, level.levelName,level.sectorName)}
                />
          </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
