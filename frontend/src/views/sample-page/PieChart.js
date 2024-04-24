import React from 'react';
import { PieChart } from '@mui/x-charts';
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
                            <PieChart
                                series={[
                                    {
                                        data: [
                                            { id: 0, value: 10, label: 'Cours' },
                                            { id: 1, value: 15, label: 'TD' },
                                            { id: 2, value: 20, label: 'TP' },
                                        ],
                                        highlightScope: { faded: 'global', highlighted: 'item' },
                                        faded: {
                                            innerRadius: 30,
                                            additionalRadius: -30,
                                            color: 'gray',
                                        },

                                    },
                                ]}
                                height={120}
                                width={300}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </MainCard>
    );
};

export default Chart;
