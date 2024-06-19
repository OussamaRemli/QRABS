import PropTypes from 'prop-types';

// material-ui
import {styled} from '@mui/material/styles';
import {Box, List, ListItem, ListItemText, Typography} from '@mui/material';
import { Grid } from '@mui/material';


// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets

// styles
const CardWrapper = styled(MainCard)(({theme}) => ({
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


const SectorCard = ({levelNames,group}) => {
    return (
        <>
            <Grid item  sx={{flexBasis: '135px',flexGrow : 0, flexShrink : 0 }}>
            <CardWrapper border={false} content={false} >
                <Box  sx={{p: 2}}>
                    <List sx={{py: 0}}>
                        <ListItem alignItems="center" disableGutters sx={{py: 0}}>
                            <ListItemText
                                sx={{
                                    py: 0,
                                    mt: 0.45,
                                    mb: 0.45
                                }}
                                primary={<Typography variant="h4">
                                    Niveau: {Array.isArray(levelNames) ? levelNames.join(', ') : levelNames
                                }{group !== 'none' ? `- ${group}` : ''}
                                </Typography>
                                }
                            />
                        </ListItem>
                    </List>
                </Box>
            </CardWrapper>
            </Grid>
        </>
    );
};

SectorCard.propTypes = {
    levelsNames: PropTypes.string
};

export default SectorCard;