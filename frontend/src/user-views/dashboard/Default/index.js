import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import PresentCountCard from './PresentCountCard';
import Qrcode from './Qrcode';
import ModuleCard from './ModuleCard';
import SectorCard from './SectorCard';
import { gridSpacing } from 'store/constant';
import Users from './StudentList';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Countdown from './Countdown';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [dataSession, setDataSession] = useState([]);
  const [apogee, setApogee] = useState([]);
  const [count, setCount] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isNow, setIsNow] = useState(false);
  const [group, setGroup] = useState('none');
  const [professorId, setProfessorId] = useState('');
  const [showCountdown, setShowCountdown] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTokenData = () => {
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
    };

    fetchTokenData();

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

    if (professorId) {
      axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/session/currentSession/${professorId}`)
        .then((response) => {
          setDataSession(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
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
      setDay(sessionDay || '');
      setTime(startTime || '');
    }

    if (byGroup) {
      setGroup(groupName || 'none');
    }
  }, [dataSession]);

  useEffect(() => {
    if (dataSession.length > 0) {
      const countdownTimer = setTimeout(() => {
        setShowCountdown(false);
      }, 7000); // Countdown will be shown for 7 seconds

      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 12000); // Content will be shown after 12 seconds

      return () => {
        clearTimeout(countdownTimer);
        clearTimeout(contentTimer);
      };
    }
  }, [dataSession]);

  const handleSectorClick = (index) => {
    setSelectedSector(index);
    setActiveIndex(index);
  };

  if (!localStorage.getItem('token')) {
    navigate('/');
    return null;
  }

  return (
    <>
      {showCountdown && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={gridSpacing} justifyContent="center" style={{ minHeight: '100vh' ,marginTop: '4vh' }}>
            <Grid item xs={12}>
              <Grid container spacing={gridSpacing} justifyContent="center" alignItems="center">
                <Grid item>
                  <Countdown timeTillDate="08 25 2024, 12:55 pm" timeFormat="MM DD YYYY, h:mm a" />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </motion.div>
      )}
      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
                    levelId={dataSession[selectedSector]?.level?.levelId}
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
                      sessionId={dataSession[selectedSector]?.sessionId}
                      levelId={dataSession[selectedSector]?.level?.levelId}
                      level={dataSession[selectedSector]?.level?.levelName}
                      apogee={apogee}
                      group={group}
                    />
                  )}
                </Grid>
                <Grid item xs={6} md={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <br />
                  {selectedSector !== null && (
                    <Qrcode
                      sessionId={dataSession[selectedSector]?.sessionId}
                      levelId={dataSession[selectedSector]?.level?.levelId}
                      group={group}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </motion.div>
      )}
    </>
  );
};

export default Dashboard;


// import { useEffect, useState } from 'react';
// import { Button, ButtonGroup, Grid, Typography } from '@mui/material';
// import { motion } from 'framer-motion'; // Importation de motion depuis framer-motion
// import PresentCountCard from './PresentCountCard';
// import Qrcode from './Qrcode';
// import ModuleCard from './ModuleCard';
// import SectorCard from './SectorCard';
// import { gridSpacing } from 'store/constant';
// import Users from './StudentList';
// import SockJS from 'sockjs-client';
// import Stomp from 'stompjs';
// import Countdown from './Countdown';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const [day, setDay] = useState('');
//   const [time, setTime] = useState('');
//   const [dataSession, setDataSession] = useState([]);
//   const [apogee, setApogee] = useState([]);
//   const [count, setCount] = useState([]);
//   const [selectedSector, setSelectedSector] = useState(null);
//   const [activeIndex, setActiveIndex] = useState(null);
//   const [isNow, setIsNow] = useState(false);
//   const [group, setGroup] = useState('none');
//   const [professorId, setProfessorId] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchTokenData = () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (token) {
//           const tokenParts = token.split('.');
//           const tokenPayload = JSON.parse(atob(tokenParts[1]));
//           setProfessorId(parseInt(tokenPayload.id, 10));
//         } else {
//           console.log('Aucun token trouvé dans le localStorage');
//         }
//       } catch (error) {
//         console.error('Erreur lors de la récupération des données du token:', error);
//       }
//     };

//     fetchTokenData();

//     const socket = new SockJS(`${process.env.REACT_APP_SPRING_BASE_URL}/ws`);
//     const stompClient = Stomp.over(socket);

//     stompClient.connect({}, () => {
//       const presenceSubscription = stompClient.subscribe('/topic/presence', (message) => {
//         setApogee((prevApogee) => [...prevApogee, Number(message.body)]);
//       });

//       const countSubscription = stompClient.subscribe('/topic/count', (message) => {
//         setCount(message.body);
//       });

//       const absenceSubscription = stompClient.subscribe('/topic/absence', (message) => {
//         setApogee((prevApogee) => prevApogee.filter((apogee) => apogee !== Number(message.body)));
//       });

//       return () => {
//         presenceSubscription.unsubscribe();
//         countSubscription.unsubscribe();
//         absenceSubscription.unsubscribe();
//         stompClient.disconnect();
//       };
//     });

//     if (professorId) {
//       axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/session/currentSession/${professorId}`)
//         .then((response) => {
//           setDataSession(response.data);
//         })
//         .catch((error) => {
//           console.error('Error fetching data:', error);
//         });
//     }
//   }, [professorId]);

//   useEffect(() => {
//     if (dataSession.length > 0) {
//       setSelectedSector(0);
//       setActiveIndex(0);
//     }

//     const currentDate = new Date();
//     const dayOfWeek = currentDate.getDay();
//     const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     const formattedDay = daysOfWeek[dayOfWeek];
//     const formattedTime = currentDate.toTimeString().split(' ')[0];
//     const sessionDay = dataSession[0]?.sessionDay;
//     const startTime = dataSession[0]?.startTime;
//     const endTime = dataSession[0]?.endTime;
//     const groupName = dataSession[0]?.groupName;
//     const byGroup = dataSession[0]?.byGroup;

//     if (sessionDay === formattedDay && startTime < formattedTime && formattedTime < endTime) {
//       setIsNow(true);
//     } else {
//       setDay(sessionDay || '');
//       setTime(startTime || '');
//     }

//     if (byGroup) {
//       setGroup(groupName || 'none');
//     }
//   }, [dataSession]);

//   const handleSectorClick = (index) => {
//     setSelectedSector(index);
//     setActiveIndex(index);
//   };

//   if (!localStorage.getItem('token')) {
//     navigate('/');
//     return null;
//   }

//   return (
//     <>
//       {!isNow && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Grid container spacing={gridSpacing} justifyContent="center" style={{ minHeight: '100vh' ,marginTop: '4vh' }}>
//             <Grid item xs={12}>
//               <Grid container spacing={gridSpacing} justifyContent="center" alignItems="center">
//                 <Grid item>
//                   {/* <Typography variant="h2" gutterBottom align="center">
//                     {dataSession[0]?.module?.moduleName}
//                   </Typography>
//                   <Typography variant="h2" gutterBottom align="center">
//                     {dataSession[0]?.level?.levelName}
//                   </Typography> */}
//                   {/* <Countdown day={day} time={time} /> */}
//                   <Countdown timeTillDate="08 26 2024, 6:00 am" timeFormat="MM DD YYYY, h:mm a" />

//                 </Grid>
//               </Grid>
//             </Grid>
//           </Grid>
//         </motion.div>
//       )}
//       {isNow && (
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Grid container spacing={gridSpacing} mt={0.5}>
//             <Grid item xs={12}>
//               <Grid container spacing={gridSpacing}>
//                 <Grid item style={{ flexBasis: '350px', flexGrow: 0, flexShrink: 0 }}>
//                   <ModuleCard
//                     moduleName={dataSession[0]?.module?.moduleName}
//                     levelNames={dataSession.map(item => item.level.levelName)}
//                     sessionType={dataSession[0]?.sessionType}
//                     startTime={dataSession[0]?.startTime}
//                     endTime={dataSession[0]?.endTime}
//                   />
//                 </Grid>
//                 <Grid item style={{ flexBasis: '250px', flexGrow: 0, flexShrink: 0 }}>
//                   <SectorCard levelNames={dataSession.map(item => item.level.levelName)} group={group} />
//                 </Grid>
//                 <Grid item style={{ flexBasis: '150px', flexGrow: 0, flexShrink: 0 }}>
//                   <PresentCountCard
//                     levelId={dataSession[selectedSector]?.level?.levelId}
//                     group={group}
//                   />
//                 </Grid>
//               </Grid>
//             </Grid>
//             <Grid item xs={12}>
//               <Grid container spacing={gridSpacing}>
//                 <Grid item xs={12} md={8}>
//                   <ButtonGroup aria-label="Basic button group">
//                     {dataSession.map((session, index) => (
//                       <Button
//                         key={index}
//                         size="large"
//                         variant={activeIndex === index ? "contained" : "outlined"}
//                         onClick={() => handleSectorClick(index)}
//                       >
//                         {session.level.levelName}
//                       </Button>
//                     ))}
//                   </ButtonGroup>
//                 </Grid>
//                 <Grid item xs={12} md={8}>
//                   {selectedSector !== null && (
//                     <Users
//                       sessionId={dataSession[selectedSector]?.sessionId}
//                       levelId={dataSession[selectedSector]?.level?.levelId}
//                       level={dataSession[selectedSector]?.level?.levelName}
//                       apogee={apogee}
//                       group={group}
//                     />
//                   )}
//                 </Grid>
//                 <Grid item xs={6} md={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                   <br />
//                   {selectedSector !== null && (
//                     <Qrcode
//                       sessionId={dataSession[selectedSector]?.sessionId}
//                       levelId={dataSession[selectedSector]?.level?.levelId}
//                       group={group}
//                     />
//                   )}
//                 </Grid>
//               </Grid>
//             </Grid>
//           </Grid>
//         </motion.div>
//       )}
//     </>
//   );
// };

// export default Dashboard;



