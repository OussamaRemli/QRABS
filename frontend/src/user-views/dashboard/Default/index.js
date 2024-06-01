import {useEffect, useState} from 'react';
import {Button, ButtonGroup, Grid} from '@mui/material';
import PresentCountCard from './PresentCountCard';
import Qrcode from './Qrcode';
import ModuleCard from './ModuleCard';
import SectorCard from './SectorCard';
import {gridSpacing} from 'store/constant';
import Users from './StudentList';
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import Countdown from "./Countdown";

const Dashboard = () => {

    const [day,setDay]=useState();
    const [time,setTime]=useState();

    const [dataSession, setDataSession] = useState([]);
    const [apogee, setApogee] = useState([]);
    const [count, setCount] = useState([]);
    const [selectedSector, setSelectedSector] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [isNow, setIsNow] = useState();
    const [group, setGroup] = useState("none");

    useEffect(() => {
            const socket = new SockJS('http://localhost:8080/ws');
            const stompClient = Stomp.over(socket);

            // Subscribe to WebSocket topic
            stompClient.connect({}, function () {
                const presenceSubscription = stompClient.subscribe('/topic/presence', function (message) {
                    setApogee(apogee => [...apogee, Number(message.body)]);
                });

                const countSubscription = stompClient.subscribe('/topic/count', function (message) {
                    setCount(message.body);
                });
                const absenceSubscription = stompClient.subscribe('/topic/absence', function (message) {
                    setApogee(apogee => [...apogee].filter(apogee => apogee !== Number(message.body)));
                });
                return () => {
                    presenceSubscription.unsubscribe();
                    absenceSubscription.unsubscribe();
                    countSubscription.unsubscribe();
                    stompClient.disconnect();
                };
            });

            fetch("http://localhost:8080/api/session/currentSession/1")
                .then(response => response.json())
                .then(dataSession => {
                    setDataSession(dataSession);
                })
        }
        , []);
    useEffect(() => {
        if (dataSession.length > 0) {
            setSelectedSector(0);
            setActiveIndex(0);
        }
        const currentDate = new Date();
        const dayOfWeek = currentDate.getDay();
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let formattedDay = daysOfWeek[dayOfWeek];
        let hours = currentDate.getHours();
        let minutes = currentDate.getMinutes();
        let seconds = currentDate.getSeconds();
        let formattedTime = `${hours}:${minutes}:${seconds}`;
        const sessionDay = dataSession.map(item => item.sessionDay);
        const startTime = dataSession.map(item => item.startTime);
        const endTime = dataSession.map(item => item.endTime);
        const groups = dataSession.map(item => item.groupName);
        const Bygroups = dataSession.map(item => item.byGroup);


        if (sessionDay[0] === formattedDay && startTime[0] < formattedTime && formattedTime < endTime[0]) {
            setIsNow(true);
        }else{
            setDay(sessionDay[0]);
            setTime(startTime[0]);
        }
        if(Bygroups[0]){
            setGroup(groups[0]);
        }
    }, [dataSession]);

    const sessions = dataSession.map(item => item);
    const levelNames = dataSession.map(item => item.level.levelName);
    const modules = dataSession.map(item => item.module.moduleName);
    const startTime = dataSession.map(item => item.startTime);
    const endTime = dataSession.map(item => item.endTime);
    const sessionType = dataSession.map(item => item.sessionType);


    const handleSectorClick = (index) => {
        setSelectedSector(index);
        setActiveIndex(index);
    }

    // Si le token n'existe pas, ne rend pas ce composant
    if (!localStorage.getItem('token')){
        navigate('/') 
        window.location.reload()
    }
    return (
        <>
            {!isNow && (
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing} justifyContent="center" alignItems="flex-start">
                            <Grid item>
                                {!isNow && <Countdown day={day} time={time}/>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}

            {isNow && (
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item style={{flexBasis: '350px', flexGrow: 0, flexShrink: 0}}>
                                <ModuleCard
                                    moduleName={modules[0]}
                                    levelNames={levelNames}
                                    sessionType={sessionType[0]}
                                    startTime={startTime[0]}
                                    endTime={endTime[0]}
                                />
                            </Grid>

                            <Grid item style={{flexBasis: '250px', flexGrow: 0, flexShrink: 0}}>
                                <SectorCard levelNames={levelNames} group={group}/>
                            </Grid>

                            <Grid item style={{flexBasis: '150px', flexGrow: 0, flexShrink: 0}}>
                                <PresentCountCard count={count}/>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={8}>
                                <ButtonGroup aria-label="Basic button group">
                                    {levelNames.map((name, index) => (
                                        <Button
                                            key={index}
                                            size="large"
                                            variant={activeIndex === index ? "contained" : "outlined"}
                                            onClick={() => handleSectorClick(index)}
                                        >
                                            {name}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                            </Grid>

                            <Grid item xs={12} md={8}>
                                {selectedSector !== null && (
                                    <Users
                                        sessionId={sessions[selectedSector].sessionId}
                                        levelId={sessions[selectedSector].level.levelId}
                                        level={levelNames[selectedSector]}
                                        apogee={apogee}
                                        group={group}
                                    />
                                )}
                            </Grid>

                            <Grid item xs={6} md={4}
                                  style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <br/>
                                {selectedSector !== null && (
                                    <Qrcode
                                        url={`http://192.168.1.109:8080/Qr/scan/${sessions[selectedSector].sessionId}/${sessions[selectedSector].level.levelId}/${group}`}
                                        sessionId={sessions[selectedSector].sessionId}
                                        levelId={sessions[selectedSector].level.levelId}
                                        group={group}
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </>
    );
}

export default Dashboard;


