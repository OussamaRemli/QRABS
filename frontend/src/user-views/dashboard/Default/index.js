import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import PresentCountCard from './PresentCountCard';
import Qrcode from './Qrcode';
// import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import ModuleCard from './ModuleCard';
import SectorCard from './SectorCard';
// import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import Users from './StudentList';
import SockJS from "sockjs-client";
import Stomp from "stompjs";


const Dashboard = () => {
    const [dataSession, setDataSession] = useState([]);
    const [selectedSector, setSelectedSector] = useState(null);
    const [apogee, setApogee] = useState([]);
    const [count,setCount]=useState([]);

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
            return () => {
                presenceSubscription.unsubscribe();
                countSubscription.unsubscribe();
                stompClient.disconnect();
            };
        });

        // Fetch data after WebSocket subscription is established
        fetch("http://localhost:8080/api/session/currentSession/1")
            .then(response => response.json())
            .then(dataSession => setDataSession(dataSession));

        // Clean up WebSocket connection on component unmount
        return () => {
            stompClient.disconnect();
        };
    }, []);

    const levelNames = dataSession.map(item=>item.level.levelName);
    const modules = dataSession.map(item=>item.module.moduleName);
    const sessions = dataSession.map(item=>item);
    const startTime = dataSession.map(item=>item.startTime);
    const endTime = dataSession.map(item=>item.endTime);
    const sessionType = dataSession.map(item=>item.sessionType);




    const handleSectorClick = (index) => {
        setSelectedSector(index);
    }

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item sx={{flexBasis: '300px',flexGrow : 0, flexShrink : 0 }}>
                        <ModuleCard moduleName={modules[0]} sessionType={sessionType[0]} startTime={startTime[0]} endTime={endTime[0]} />
                    </Grid>
                    {levelNames.map((name, index) => (
                        <SectorCard key={index} sectorName={name} onClick={() => {handleSectorClick(index)}} />
                    ))}
                    <Grid item  sx={{flexBasis: '250px' ,flexGrow : 0, flexShrink : 0 }}>
                        <PresentCountCard  count={count}/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        {selectedSector !== null && <Users level={levelNames[selectedSector]} apogee={apogee}/>}
                    </Grid>
                    <Grid item xs={6} md={4}>
                        {selectedSector !== null && <Qrcode url={`http://192.168.1.59:8080/Qr/scan/${sessions[selectedSector].sessionId}/${sessions[selectedSector].level.levelId}`}/>}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;


// const Dashboard = () => {
//   // const [data, setData] = useState([]);
//   // const [dataLevel, setDataLevel] = useState([]);
//   const [dataSession, setDataSession] = useState([]);
//
//   useEffect(() => {
//     // fetch("http://localhost:8080/api/modules/currentModule/1")
//     //     .then(response => response.json())
//     //     .then(data => setData(data));
//     // fetch("http://localhost:8080/api/levels/curentlevel/1")
//     //     .then(response => response.json())
//     //     .then(dataLevel => setDataLevel(dataLevel));
//     fetch("http://localhost:8080/api/session/currentSession/1")
//         .then(response => response.json())
//         .then(dataSession => setDataSession(dataSession));
//
//   }, []);
//
//    const levelNames = dataSession.map(item=>item.level.levelName);
//    const modules = dataSession.map(item=>item.module.moduleName);
//    const sessions = dataSession.map(item=>item);
//
//
//
//
//   return (
//     <Grid container spacing={gridSpacing}>
//       <Grid item xs={12}>
//         <Grid container spacing={gridSpacing}>
//           <Grid item sx={{flexBasis: '300px',flexGrow : 0, flexShrink : 0 }}>
//             <ModuleCard moduleName={modules[0]} startTime={"8:30"} endTime={"10:00"} />
//           </Grid>
//             {levelNames.map((name, index) => (
//                 <SectorCard key={index} sectorName={name} />
//             ))}
//           <Grid item  sx={{flexBasis: '250px' ,flexGrow : 0, flexShrink : 0 }}>
//             <PresentCountCard  presentCount={"45"}/>
//           </Grid>
//           {/*<Grid item lg={4} md={12} sm={12} xs={12}>*/}
//           {/*  <Grid container spacing={gridSpacing}>*/}
//           {/*    <Grid item sm={6} xs={12} md={6} lg={12}>*/}
//
//           {/*    </Grid>*/}
//           {/*    <Grid item sm={6} xs={12} md={6} lg={12}>*/}
//           {/*    </Grid>*/}
//           {/*  </Grid>*/}
//           {/*</Grid>*/}
//         </Grid>
//       </Grid>
//       <Grid item xs={12}>
//         <Grid container spacing={gridSpacing}>
//           <Grid item xs={12} md={8}>
//               {levelNames.map((item,index)=> <Users key={index} level={item}/>)}
//           </Grid>
//           <Grid item xs={6} md={4}>
//               {sessions.map((item,index)=><Qrcode key={index} url={`http://.1.103:8080/Qr/scan/${item.sessionId}/${item.level.levelId}`}/>)}
//           </Grid>
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };
//
// export default Dashboard;