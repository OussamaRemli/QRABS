import PropTypes from 'prop-types';

// material-ui
import {styled} from '@mui/material/styles';
import {Box, List, ListItem, ListItemText, Typography} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
// import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import {useEffect, useState} from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {gridPaginationRowCountSelector} from "@mui/x-data-grid";

// assets
// import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

// styles
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

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

const PresentCountCard = ({levelId}) => {
    const [count, setCount] = useState({});

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            const countSubscription = stompClient.subscribe(`/topic/count/${levelId}`, function (message) {
                const parsedMessage = JSON.parse(message.body);
                console.log("Parsed message:", parsedMessage);
                setCount(prevCount => ({
                    ...prevCount,
                    [levelId]: parsedMessage // Stocker le compteur sous levelId
                }));
            });
        });
        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, [levelId]);// Include presentCardcount here if it's used inside this component


    return (
        <>
            <CardWrapper border={false} content={false}>
                <Box sx={{p: 2}}>
                    <List sx={{py: 0}}>
                        <ListItem alignItems="center" disableGutters sx={{py: 0}}>
                            <PeopleAltIcon/>
                            <ListItemText
                                sx={{
                                    py: 0,
                                    mt: 0.45,
                                    mb: 0.45
                                }}
                                primary={
                                    <Typography variant="h4" sx={{color: '#fff'}}>
                                        {count[levelId]}                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="subtitle2" sx={{color: 'primary.light', mt: 0.25}}>
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


export default PresentCountCard;
