
import {styled} from '@mui/material/styles';
import {Box, List, ListItem, ListItemText, Typography} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import {useEffect, useState} from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

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



    const PresentCountCard = ({ levelId, group }) => {
        const [count, setCount] = useState(() => {
            const savedCount = localStorage.getItem('countQrabs');
            return savedCount ? JSON.parse(savedCount) : {};
        });
    
        useEffect(() => {
            // Sauvegarder la valeur de count dans localStorage chaque fois que count change
            localStorage.setItem('countQrabs', JSON.stringify(count));
        }, [count]);
    
        useEffect(() => {
            const socket = new SockJS(`${process.env.REACT_APP_SPRING_BASE_URL}/ws`);
            const stompClient = Stomp.over(socket);
    
            stompClient.connect({}, () => {
                const topic = group === 'none' ? `/topic/count/${levelId}` : `/topic/count/${levelId}/${group}`;
                
                const countSubscription = stompClient.subscribe(topic, (message) => {
                    const parsedMessage = JSON.parse(message.body);
                    console.log("Parsed message:", parsedMessage);
                    setCount(prevCount => ({
                        ...prevCount,
                        [levelId]: parsedMessage // Store the count under levelId
                    }));
                });
            });
    
            return () => {
                if (stompClient && stompClient.connected) {
                    stompClient.disconnect();
                }
            };
        }, [levelId, group]);

    return (
        <CardWrapper border={false} content={false}>
            <Box sx={{ p: 2 }}>
                <List sx={{ py: 0 }}>
                    <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                    <PeopleAltIcon sx={{ mr: 1 }} />
                    <ListItemText
                            sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                            primary={
                                <Typography variant="h4" sx={{ color: '#fff', ml: 1 }}>
                                     {count[levelId]}
                                 </Typography>

                            }
                            secondary={
                                <Typography variant="subtitle2" sx={{ color: 'primary.light', mt: 0.25 }}>
                                </Typography>
                            }
                        />
                    </ListItem>
                </List>
            </Box>
        </CardWrapper>
    );
};

export default PresentCountCard;