import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import PresentCountCard from './PresentCountCard';
import Qrcode from './Qrcode';
// import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import ModuleCard from './ModuleCard';
import SectorCard from './SectorCard';
// import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import Users from './StudentList';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item sx={{flexBasis: '300px',flexGrow : 0, flexShrink : 0 }}>
            <ModuleCard moduleName={"Réseaux informatique"} startTime={"8:30"} endTime={"10:00"} />
          </Grid>
          <Grid item  sx={{flexBasis: '150px',flexGrow : 0, flexShrink : 0 }}>
            <SectorCard  sectorName={"Gi 4"} />
          </Grid>
          <Grid item  sx={{flexBasis: '150px' ,flexGrow : 0, flexShrink : 0 }}>
            <SectorCard  sectorName={"Gsier 4"}/>
          </Grid>
          <Grid item  sx={{flexBasis: '250px' ,flexGrow : 0, flexShrink : 0 }}>
            <PresentCountCard  presentCount={"45"}/>
          </Grid>
          {/*<Grid item lg={4} md={12} sm={12} xs={12}>*/}
          {/*  <Grid container spacing={gridSpacing}>*/}
          {/*    <Grid item sm={6} xs={12} md={6} lg={12}>*/}

          {/*    </Grid>*/}
          {/*    <Grid item sm={6} xs={12} md={6} lg={12}>*/}
          {/*    </Grid>*/}
          {/*  </Grid>*/}
          {/*</Grid>*/}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <Users/>
          </Grid>
          <Grid item xs={6} md={4}>
            <Qrcode isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
