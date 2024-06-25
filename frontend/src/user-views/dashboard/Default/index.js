import {useEffect, useState} from 'react';
import {Button, ButtonGroup, Grid, Typography} from '@mui/material';
import PresentCountCard from './PresentCountCard';
import Qrcode from './Qrcode';
import ModuleCard from './ModuleCard';
import SectorCard from './SectorCard';
import {gridSpacing} from 'store/constant';
import Users from './StudentList';
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import Countdown from "./Countdown";
import axios from 'axios';

const Dashboard = () => {
    const [day, setDay] = useState();
    const [time, setTime] = useState();
    const [dataSession, setDataSession] = useState([]);
    const [apogee, setApogee] = useState([]);
    const [count, setCount] = useState([]);
    const [selectedSector, setSelectedSector] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [isNow, setIsNow] = useState(false);
    const [group, setGroup] = useState("none");
    const [professorId, setProfessorId] = useState('');

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const tokenParts = token.split('.');
                const tokenPayload = JSON.parse(atob(tokenParts[1]));
                setProfessorId(parseInt(tokenPayload.id, 10));
            } else {
                console.log('Aucun token trouvé dans le localStorage');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données du token:', error);
        }

        const socket = new SockJS(`${process.env.REACT_APP_SPRING_BASE_URL}/ws`);
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            const presenceSubscription = stompClient.subscribe('/topic/presence', (message) => {
                setApogee((prevApogee) => [...prevApogee, Number(message.body)]);
            });

            const countSubscription = stompClient.subscribe('/topic/count', (message) => {
                setCount(message.body);
            });

            const absenceSubscription = stompClient.subscribe('/topic/absence', (message) => {
                setApogee((prevApogee) => prevApogee.filter((apogee) => apogee !== Number(message.body)));
            });

         

            return () => {
                presenceSubscription.unsubscribe();
                countSubscription.unsubscribe();
                absenceSubscription.unsubscribe();
                stompClient.disconnect();
            };
        });

        axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/session/currentSession/${professorId}`)
        .then((response) => {
            setDataSession(response.data);
        })
        .catch((error) => {
            // Handle error
            console.error('Error fetching data:', error);
        });

        
}, [professorId]);


    useEffect(() => {
        if (dataSession.length > 0) {
            setSelectedSector(0);
            setActiveIndex(0);
        }

        const currentDate = new Date();
        const dayOfWeek = currentDate.getDay();
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const formattedDay = daysOfWeek[dayOfWeek];
        const formattedTime = currentDate.toTimeString().split(' ')[0];
        const sessionDay = dataSession[0]?.sessionDay;
        const startTime = dataSession[0]?.startTime;
        const endTime = dataSession[0]?.endTime;
        const groupName = dataSession[0]?.groupName;
        const byGroup = dataSession[0]?.byGroup;

        if (sessionDay === formattedDay && startTime < formattedTime && formattedTime < endTime) {
            setIsNow(true);
        } else {
            setDay(sessionDay);
            setTime(startTime);
        }

        if (byGroup) {
            setGroup(groupName);
        }
    }, [dataSession]);

    const handleSectorClick = (index) => {
        setSelectedSector(index);
        setActiveIndex(index);
    };

    if (!localStorage.getItem('token')) {
        navigate('/');
        window.location.reload();
        return null;
    }

    return (
        <>
            {!isNow && (
                <Grid container spacing={gridSpacing} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
                    {/* Container principal */}
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing} justifyContent="center" alignItems="center">
                            {/* Contenu */}
                            <Grid item>
                                {/* Titre du module */}
                                <Typography variant="h2" gutterBottom align="center">
                                    {dataSession[0]?.module?.moduleName}
                                </Typography>
                                <Typography variant="h2" gutterBottom align="center">
                                    {dataSession[0]?.level?.levelName}
                                </Typography>
                                {/* Compte à rebours */}
                                <Countdown day={day} time={time} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
            {isNow && (
                <Grid container spacing={gridSpacing} mt={0.5}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item style={{ flexBasis: '350px', flexGrow: 0, flexShrink: 0 }}>
                                <ModuleCard
                                    moduleName={dataSession[0]?.module?.moduleName}
                                    levelNames={dataSession.map(item => item.level.levelName)}
                                    sessionType={dataSession[0]?.sessionType}
                                    startTime={dataSession[0]?.startTime}
                                    endTime={dataSession[0]?.endTime}
                                />
                            </Grid>
                            <Grid item style={{ flexBasis: '250px', flexGrow: 0, flexShrink: 0 }}>
                                <SectorCard levelNames={dataSession.map(item => item.level.levelName)} group={group} />
                            </Grid>
                            <Grid item style={{ flexBasis: '150px', flexGrow: 0, flexShrink: 0 }}>
                                    <PresentCountCard
                                        levelId={dataSession[selectedSector].level.levelId}
                                        group={group}
                                    />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={8}>
                                <ButtonGroup aria-label="Basic button group">
                                    {dataSession.map((session, index) => (
                                        <Button
                                            key={index}
                                            size="large"
                                            variant={activeIndex === index ? "contained" : "outlined"}
                                            onClick={() => handleSectorClick(index)}
                                        >
                                            {session.level.levelName}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                {selectedSector !== null && (
                                    <Users
                                        sessionId={dataSession[selectedSector].sessionId}
                                        levelId={dataSession[selectedSector].level.levelId}
                                        level={dataSession[selectedSector].level.levelName}
                                        apogee={apogee}
                                        group={group}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={6} md={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <br />
                                {selectedSector !== null && (
                                    <Qrcode
                                        sessionId={dataSession[selectedSector].sessionId}
                                        levelId={dataSession[selectedSector].level.levelId}
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
};

export default Dashboard;
// const Dashboard = () => {
//
//     const [day,setDay]=useState();
//     const [time,setTime]=useState();
//
//     const [dataSession, setDataSession] = useState([]);
//     const [apogee, setApogee] = useState([]);
//     const [count, setCount] = useState([]);
//     const [selectedSector, setSelectedSector] = useState(null);
//     const [activeIndex, setActiveIndex] = useState(null);
//     const [isNow, setIsNow] = useState();
//     const [group, setGroup] = useState("none");
//     const [professorId,setProfessorId]=useState('')
//
//     useEffect(() => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (token) {
//                     const tokenParts = token.split('.');
//                     const tokenPayload = JSON.parse(atob(tokenParts[1]));
//                     setProfessorId(parseInt(tokenPayload.id, 10));
//
//                 } else {
//                     console.log('Aucun token trouvé dans le localStorage');
//                 }
//             } catch (error) {
//                 console.error('Erreur lors de la récupération des données du token:', error);
//             }
//             const socket = new SockJS('`${process.env.REACT_APP_SPRING_BASE_URL}/ws');
//             const stompClient = Stomp.over(socket);
//
//             // Subscribe to WebSocket topic
//             stompClient.connect({}, function () {
//                 const presenceSubscription = stompClient.subscribe('/topic/presence', function (message) {
//                     setApogee(apogee => [...apogee, Number(message.body)]);
//                 });
//
//                 const countSubscription = stompClient.subscribe('/topic/count', function (message) {
//                     setCount(message.body);
//                 });
//                 const absenceSubscription = stompClient.subscribe('/topic/absence', function (message) {
//                     setApogee(apogee => [...apogee].filter(apogee => apogee !== Number(message.body)));
//                 });
//                 return () => {
//                     presenceSubscription.unsubscribe();
//                     absenceSubscription.unsubscribe();
//                     countSubscription.unsubscribe();
//                     stompClient.disconnect();
//                 };
//             });
//
//             fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/session/currentSession/${professorId}`)
//                 .then(response => response.json())
//                 .then(dataSession => {
//                     setDataSession(dataSession);
//                 })
//         }
//         , []);
//     useEffect(() => {
//         if (dataSession.length > 0) {
//             setSelectedSector(0);
//             setActiveIndex(0);
//         }
//         const currentDate = new Date();
//         const dayOfWeek = currentDate.getDay();
//         const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//         let formattedDay = daysOfWeek[dayOfWeek];
//         let hours = currentDate.getHours();
//         let minutes = currentDate.getMinutes();
//         let seconds = currentDate.getSeconds();
//         let formattedTime = `${hours}:${minutes}:${seconds}`;
//         const sessionDay = dataSession.map(item => item.sessionDay);
//         const startTime = dataSession.map(item => item.startTime);
//         const endTime = dataSession.map(item => item.endTime);
//         const groups = dataSession.map(item => item.groupName);
//         const Bygroups = dataSession.map(item => item.byGroup);
//
//
//         if (sessionDay[0] === formattedDay && startTime[0] < formattedTime && formattedTime < endTime[0]) {
//             setIsNow(true);
//         }else{
//             setDay(sessionDay[0]);
//             setTime(startTime[0]);
//         }
//         if(Bygroups[0]){
//             setGroup(groups[0]);
//         }
//     }, [dataSession]);
//
//     const sessions = dataSession.map(item => item);
//     const levelNames = dataSession.map(item => item.level.levelName);
//     const modules = dataSession.map(item => item.module.moduleName);
//     const startTime = dataSession.map(item => item.startTime);
//     const endTime = dataSession.map(item => item.endTime);
//     const sessionType = dataSession.map(item => item.sessionType);
//
//
//     const handleSectorClick = (index) => {
//         setSelectedSector(index);
//         setActiveIndex(index);
//     }
//
//     // Si le token n'existe pas, ne rend pas ce composant
//     if (!localStorage.getItem('token')){
//         navigate('/')
//         window.location.reload()
//     }
//     return (
//         <>
//             {!isNow && (
//                 <Grid container spacing={gridSpacing}>
//                     <Grid item xs={12}>
//                         <Grid container spacing={gridSpacing} justifyContent="center" alignItems="flex-start">
//                             <Grid item>
//                                 {!isNow && (
//                                     <>
//                                         <Typography variant="h4" gutterBottom>
//                                             Next Cours
//                                         </Typography>
//                                         <Typography variant="h5" gutterBottom>
//                                             {modules[0]}
//                                         </Typography>
//                                         <Countdown day={day} time={time} />
//                                     </>
//                                 )}
//                             </Grid>
//                         </Grid>
//                     </Grid>
//                 </Grid>
//             )}
//
//             {isNow && (
//                 <Grid container spacing={gridSpacing}>
//                     <Grid item xs={12}>
//                         <Grid container spacing={gridSpacing}>
//                             <Grid item style={{flexBasis: '350px', flexGrow: 0, flexShrink: 0}}>
//                                 <ModuleCard
//                                     moduleName={modules[0]}
//                                     levelNames={levelNames}
//                                     sessionType={sessionType[0]}
//                                     startTime={startTime[0]}
//                                     endTime={endTime[0]}
//                                 />
//                             </Grid>
//
//                             <Grid item style={{flexBasis: '250px', flexGrow: 0, flexShrink: 0}}>
//                                 <SectorCard levelNames={levelNames} group={group}/>
//                             </Grid>
//
//                             <Grid item style={{flexBasis: '150px', flexGrow: 0, flexShrink: 0}}>
//                                 <PresentCountCard count={count}/>
//                             </Grid>
//                         </Grid>
//                     </Grid>
//
//                     <Grid item xs={12}>
//                         <Grid container spacing={gridSpacing}>
//                             <Grid item xs={12} md={8}>
//                                 <ButtonGroup aria-label="Basic button group">
//                                     {levelNames.map((name, index) => (
//                                         <Button
//                                             key={index}
//                                             size="large"
//                                             variant={activeIndex === index ? "contained" : "outlined"}
//                                             onClick={() => handleSectorClick(index)}
//                                         >
//                                             {name}
//                                         </Button>
//                                     ))}
//                                 </ButtonGroup>
//                             </Grid>
//
//                             <Grid item xs={12} md={8}>
//                                 {selectedSector !== null && (
//                                     <Users
//                                         sessionId={sessions[selectedSector].sessionId}
//                                         levelId={sessions[selectedSector].level.levelId}
//                                         level={levelNames[selectedSector]}
//                                         apogee={apogee}
//                                         group={group}
//                                     />
//                                 )}
//                             </Grid>
//
//                             <Grid item xs={6} md={4}
//                                   style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
//                                 <br/>
//                                 {selectedSector !== null && (
//                                     <Qrcode
//                                         url={`http://192.168.1.109:8080/Qr/scan/${sessions[selectedSector].sessionId}/${sessions[selectedSector].level.levelId}/${group}`}
//                                         sessionId={sessions[selectedSector].sessionId}
//                                         levelId={sessions[selectedSector].level.levelId}
//                                         group={group}
//                                     />
//                                 )}
//                             </Grid>
//                         </Grid>
//                     </Grid>
//                 </Grid>
//             )}
//         </>
//     );
// }
//
// export default Dashboard;
//
//
