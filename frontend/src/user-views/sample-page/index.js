import {Button, ButtonGroup, Grid} from '@mui/material';
import { gridSpacing } from 'store/constant';

import AbsenceList from  './AbsenceList';
import Chart from  './PieChart';

import PersonalAbsemce from './PesonalAbsence';
const Index = ({levelId,moduleId}) => {

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                     <Chart/>
                    </Grid>

                    <Grid item lg={10} md={6} sm={6} xs={12}>
                     <Grid>
                    <ButtonGroup variant="outlined" aria-label="Basic button group">
                            <Button>Total</Button>
                            <Button>Cours</Button>
                            <Button>TD</Button>
                            <Button>TP</Button>
                        </ButtonGroup>
                     </Grid>
                        <br/>
                        <AbsenceList levelId={levelId} moduleId={moduleId}/>

                    </Grid>
                    {/* <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid> */}
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

        <Grid item lg={6} md={6} sm={6} xs={12}>
        </Grid>
      </Grid> */}
        </Grid>
    );
};

export default Index;
