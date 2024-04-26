import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

import { styled } from '@mui/material/styles';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

const MeanAbsence = ({ moduleId }) => {
    const [mean, setMean] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/modules/${moduleId}/stats`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setMean(  data.totalAbsences/data.totalSessions);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError(error);
            });
    }, [moduleId]);

    return (
        <CardWrapper border={false} content={false} >
            <Box sx={{ p: 2 }}>
                <List sx={{ py: 0 }}>
                    <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                        <ListItemText
                            sx={{
                                py: 0,
                                mt: 0.45,
                                mb: 0.45
                            }}
                            primary={<Typography variant="h5">Moyenne d'absence</Typography>}
                            secondary={
                                <Typography variant="h4">
                                    {error ? 'Error fetching data' : `${mean.toFixed(2)}`}
                                </Typography>
                            } />
                    </ListItem>
                </List>
            </Box>
        </CardWrapper>
    );
};

MeanAbsence.propTypes = {
    moduleId: PropTypes.number.isRequired
};

export default MeanAbsence;
