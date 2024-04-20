import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);
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
  }, []);

  // Si le token n'existe pas, ne rend pas ce composant
  if (!localStorage.getItem('token')) return null;

  return (
    <Grid container spacing={gridSpacing} justifyContent={'center'} alignItems={'center'}>
      <Grid item lg={2} >
      <h2>Hi {adminInfo && adminInfo.firstName && adminInfo.lastName ? `${adminInfo.firstName} ${adminInfo.lastName}` : 'Admin :)'}!</h2>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

{/* <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid> */}
      
    </Grid>
  );
};

export default Dashboard;
