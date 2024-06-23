import PropTypes from 'prop-types';
import {styled} from '@mui/material/styles';
import {Box, List, ListItem, ListItemText, Typography} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';


const CardWrapper = styled(MainCard)(({theme}) => ({
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));


const ModuleCard = ({moduleName, sessionType,levelNames,startTime, endTime}) => {

    console.log(levelNames);



    return (
        <>
            <CardWrapper border={false} content={false}>
                <Box sx={{p: 2}}>
                    <List sx={{py: 0}}>
                        <ListItem alignItems="center" disableGutters sx={{py: 0}}>
                            <ListItemText
                                sx={{
                                    py: 0,
                                    mt: 0.45,
                                    mb: 0.45
                                }}
                                primary={
                                    <Typography variant="h4" sx={{color: '#fff'}}>
                                        {moduleName}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="subtitle2" sx={{ color: 'primary.light', mt: 0.25 }}>
                                    {sessionType}
                                    {startTime !== 0 && endTime !== 0 ? (
                                        ` : de ${startTime} á ${endTime}`
                                    ) : null}
                                </Typography>
                                
                                }

                            />
                        </ListItem>
                    </List>
                </Box>
            </CardWrapper>
        </>
    );
};

ModuleCard.propTypes = {
    moduleName: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    levelNames : PropTypes.array
};

export default ModuleCard;
