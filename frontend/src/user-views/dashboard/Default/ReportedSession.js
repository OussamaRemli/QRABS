import {useEffect, useState} from 'react';
import {Button, ButtonGroup, Grid} from '@mui/material';
import PresentCountCard from './PresentCountCard';
import Qrcode from './Qrcode';
import ModuleCard from './ModuleCard';
import SectorCard from './SectorCard';
import {gridSpacing} from 'store/constant';
import Users from './StudentList';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useLocation } from 'react-router-dom';


const ReportedSession = () => {
    const location = useLocation();
    const { Session } = location.state || {};
    const [apogee, setApogee] = useState([]);
    const [professorId, setProfessorId] = useState('');
    const [loading, setLoading] = useState(true); // Nouvel état pour gérer le chargement
    const [group,setGroup]=useState("none");
    useEffect(() => {
        console.log(Session);
        if(Session.byGroup===true){
            setGroup(Session.groupName);
        }
        const token = localStorage.getItem('token');
        if (token) {
            const tokenParts = token.split('.');
            const tokenPayload = JSON.parse(atob(tokenParts[1]));
            setProfessorId(parseInt(tokenPayload.id, 10));
            console.log(professorId);
        } else {
            console.log('Aucun token trouvé dans le localStorage');
        }
    }, []);

    useEffect(() => {
        if (professorId !== '') { // Vérifie si l'id du professeur a été extrait
            setLoading(false); // Si l'id a été extrait, le chargement est terminé
            const socket = new SockJS(`${process.env.REACT_APP_SPRING_BASE_URL}/ws`);
            const stompClient = Stomp.over(socket);

            stompClient.connect({}, function () {
                const presenceSubscription = stompClient.subscribe('/topic/presence', function (message) {
                    setApogee((apogee) => [...apogee, Number(message.body)]);
                });

                const absenceSubscription = stompClient.subscribe('/topic/absence', function (message) {
                    setApogee((apogee) => apogee.filter((apogeeItem) => apogeeItem !== Number(message.body)));
                });
                return () => {
                    presenceSubscription.unsubscribe();
                    absenceSubscription.unsubscribe();
                    stompClient.disconnect();
                };
            });
        }
    }, [professorId]);


    if (loading) {
        return (
            <>
           <h1>loading
        </h1></>);
    } else {
        return (
            <>
                    <Grid container spacing={gridSpacing} mt={0.1}>
                        <Grid item xs={12}>
                            <Grid container spacing={gridSpacing}>
                                <Grid item style={{flexBasis: '350px', flexGrow: 0, flexShrink: 0}}>
                                    <ModuleCard
                                        moduleName={Session.module.moduleName}
                                        levelNames={Session.level.levelName}
                                        sessionType={Session.sessionType}
                                        startTime={0}
                                        endTime={0}
                                    />
                                </Grid>

                                <Grid item style={{flexBasis: '250px', flexGrow: 0, flexShrink: 0}}>
                                    <SectorCard levelNames={Session.level.levelName} group={group}/>
                                </Grid>

                                <Grid item style={{flexBasis: '150px', flexGrow: 0, flexShrink: 0}}>
                                     <PresentCountCard levelId={Session.level.levelId} group={group}/>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12} md={8}>
                                    <ButtonGroup aria-label="Basic button group">
                                            <Button
                                                size="large"
                                                variant={ 'contained' }
                                            >
                                                {Session.level.levelName}
                                            </Button>
                                    </ButtonGroup>
                                </Grid>

                                <Grid item xs={12} md={8}>
                                        <Users
                                            sessionId={Session.sessionId}
                                            levelId={Session.level.levelId}
                                            level={Session.level.levelName}
                                            apogee={apogee}
                                            group={group}
                                        />
                                </Grid>

                                <Grid item xs={6} md={4}
                                      style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <br/>
                                        <Qrcode
                                            url={`${process.env.REACT_APP_SPRING_BASE_URL}/Qr/scan/${Session.sessionId}/${Session.level.levelId}/${group}`}
                                            sessionId={Session.sessionId}
                                            levelId={Session.level.levelId}
                                            group={group}
                                        />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

            </>
        );
    }
};

export default ReportedSession;
