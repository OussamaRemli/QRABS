import React from 'react';
import { BarChart } from '@mui/x-charts';
import { Grid, Typography, CardContent } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';

const Chart = () => {
    return (
        <MainCard content={false} sx={{ height: '200px', width: '300px' }}>
            <CardContent>
                <Typography sx={{ mt: 2, fontSize: '20px' }}>
                    Taux d'absence
                </Typography>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container alignContent="center" justifyContent="center">
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
                                series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
                                width={500}
                                height={300}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </MainCard>
    );
};

export default Chart;
