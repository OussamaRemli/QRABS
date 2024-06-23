import React, { useEffect, useState } from 'react';
import { Avatar, Box } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { green, grey, red } from '@mui/material/colors';
import { v4 as uuidv4 } from 'uuid';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import HowToRegIcon from '@mui/icons-material/HowToReg';

function Users({ sessionId, levelId, level, group, apogee }) {
    const [users, setUsers] = useState([]);

    // Load initial users and presence data from localStorage on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/students/${level}/${group}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch student data');
                }
                const data = await response.json();

                // Load presence data from localStorage
                const storedPresence = JSON.parse(localStorage.getItem('presentQrabs')) || [];

                // Create initial users with placeholder photoURL
                const initialUsers = data.map(student => ({
                    _id: uuidv4(),
                    apogee: student.apogee,
                    name: `${student.firstName} ${student.lastName}`,
                    present: storedPresence.includes(student.apogee),
                    photoURL: null,
                }));

                // Set initial users state
                setUsers(initialUsers);

                // Fetch photos for each student
                await Promise.all(data.map(async student => {
                    try {
                        const imageResponse = await fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/import-files/image/${student.apogee}`);
                        if (!imageResponse.ok) {
                            throw new Error('Image not found');
                        }
                        const imageBlob = await imageResponse.blob();
                        const imageUrl = URL.createObjectURL(imageBlob);

                        // Update the user with the retrieved photoURL
                        setUsers(prevUsers => prevUsers.map(user => {
                            if (user.apogee === student.apogee) {
                                return { ...user, photoURL: imageUrl };
                            }
                            return user;
                        }));
                    } catch (error) {
                        console.error('Error fetching image data:', error);
                    }
                }));
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };

        fetchData();
    }, [level, group]); // Only depend on level and group for fetching initial data

    // Update presence based on apogee
    useEffect(() => {
        if (apogee.length > 0) {
            setUsers(prevUsers => {
                const updatedUsers = prevUsers.map(user => ({
                    ...user,
                    present: apogee.includes(user.apogee) || user.present,
                }));

                // Update localStorage with new presence data
                const currentPresence = JSON.parse(localStorage.getItem('presentQrabs')) || [];
                const newPresence = [...new Set([...currentPresence, ...apogee])];
                localStorage.setItem('presentQrabs', JSON.stringify(newPresence));

                return updatedUsers;
            });
        }
    }, [apogee]);

    // Handle presence change
    const handlePresenceChange = (apogee, isPresent) => async () => {
        try {
            const url = isPresent
                ? `${process.env.REACT_APP_SPRING_BASE_URL}/api/absence/forprofesseur/${sessionId}/${levelId}/${group}?Apogee=${apogee}`
                : `${process.env.REACT_APP_SPRING_BASE_URL}/api/absence/isnotpresent/${levelId}/${apogee}/${group}`;
            const method = 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('La requête a échoué');
            }

            setUsers(prevUsers => {
                const updatedUsers = prevUsers.map(user => {
                    if (user.apogee === apogee) {
                        return { ...user, present: isPresent };
                    }
                    return user;
                });

                // Récupérer l'état actuel de `presentQrabs` ou initialiser un tableau vide
                let presentQrabs = JSON.parse(localStorage.getItem('presentQrabs')) || [];

                // Mettre à jour `presentQrabs` selon la présence
                if (isPresent) {
                    presentQrabs = [...new Set([...presentQrabs, apogee])];
                } else {
                    presentQrabs = presentQrabs.filter(id => id !== apogee);
                }

                // Sauvegarder la liste mise à jour dans `localStorage`
                localStorage.setItem('presentQrabs', JSON.stringify(presentQrabs));

                return updatedUsers;
            });
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la requête:', error);
        }
    };


    const columns = [
        {
            field: 'photoURL',
            headerName: 'Avatar',
            width: 100,
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Avatar sx={{ width: 60, height: 60 }} src={params.row.photoURL} />
                </div>
            ),
            sortable: false,
            filterable: false,
        },
        {
            field: 'apogee',
            headerName: 'Apogee',
            width: 100
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 170
        },
        {
            field: 'present',
            headerName: 'Present',
            width: 100,
            type: 'boolean',
        },
        {
            field: 'notpresent',
            headerName: '',
            width: 80,
            renderCell: (params) => (
                <IconButton onClick={handlePresenceChange(params.row.apogee, false)}>
                    <CancelIcon sx={{ color: red[500] }} />
                </IconButton>
            ),
            sortable: false,
            filterable: false,
        },
        {
            field: 'ispresent',
            headerName: '',
            width: 80,
            renderCell: (params) => (
                <IconButton onClick={handlePresenceChange(params.row.apogee, true)}>
                    <HowToRegIcon sx={{ color: green[500] }} />
                </IconButton>
            ),
            sortable: false,
            filterable: false,
        },
    ];

    return (
        <Box
            sx={{
                height: 800,
                width: '100%',
            }}
        >
            <DataGrid
                columns={columns}
                rows={users}
                getRowId={(row) => row._id}
                rowsPerPageOptions={[5, 10, 20]}
                pageSize={20}
                rowHeight={70}
                getRowSpacing={(params) => ({
                    top: params.isFirstVisible ? 0 : 5,
                    bottom: params.isLastVisible ? 0 : 5,
                })}
                sx={{
                    [`& .${gridClasses.row}`]: {
                        bgcolor: (theme) =>
                            theme.palette.mode === 'light' ? grey[200] : grey[900],
                    },
                }}
            />
        </Box>
    );
}

export default Users;






// import React, { useEffect, useState } from 'react';
// import { Avatar, Box } from '@mui/material';
// import { DataGrid, gridClasses } from '@mui/x-data-grid';
// import { green, grey, red } from '@mui/material/colors';
// import { v4 as uuidv4 } from 'uuid';
// import IconButton from '@mui/material/IconButton';
// import CancelIcon from '@mui/icons-material/Cancel';
// import HowToRegIcon from '@mui/icons-material/HowToReg';

// function Users({ sessionId, levelId, level, group, apogee }) {
//     const [users, setUsers] = useState([]);

//     // Load initial users and presence data from localStorage on component mount
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Fetch initial student data
//                 const response = await fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/students/${level}/${group}`);
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch student data');
//                 }
//                 const data = await response.json();

//                 // Create initial users with placeholder photoURL
//                 const initialUsers = data.map(student => ({
//                     _id: uuidv4(),
//                     apogee: student.apogee,
//                     name: `${student.firstName} ${student.lastName}`,
//                     present: false, // Initially set to false, will be updated later
//                     photoURL: null, // Placeholder for photo URL
//                 }));

//                 // Set initial users state
//                 setUsers(initialUsers);

//                 // Fetch photos for each student
//                 await Promise.all(data.map(async student => {
//                     try {
//                         const imageResponse = await fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/import-files/image/${student.apogee}`);
//                         if (!imageResponse.ok) {
//                             throw new Error('Image not found');
//                         }
//                         const imageBlob = await imageResponse.blob();
//                         const imageUrl = URL.createObjectURL(imageBlob);

//                         // Update the user with the retrieved photoURL
//                         setUsers(prevUsers => prevUsers.map(user => {
//                             if (user.apogee === student.apogee) {
//                                 return { ...user, photoURL: imageUrl };
//                             }
//                             return user;
//                         }));
//                     } catch (error) {
//                         console.error('Error fetching image data:', error);
//                     }
//                 }));

//                 // Load presence data from localStorage
//                 const storedPresence = localStorage.getItem('presentQrabs');
//                 if (storedPresence) {
//                     const parsedPresence = JSON.parse(storedPresence);
//                     // Update users state based on stored presence data
//                     setUsers(prevUsers => prevUsers.map(user => ({
//                         ...user,
//                         present: parsedPresence.includes(user.apogee),
//                     })));
//                 }
//             } catch (error) {
//                 console.error('Error fetching student data:', error);
//             }
//         };

//         fetchData();
//     }, [level, group]); // Only depend on level and group for fetching initial data

//     // useEffect for updating presence based on apogee
//     useEffect(() => {
//         const updatePresence = async () => {
//             try {
//                 // Fetch updated presence data based on apogee
//                 const response = await fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/absence/presence/${sessionId}/${levelId}/${group}`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ apogeeList: apogee }),
//                 });
    
//                 if (!response.ok) {
//                     throw new Error('Failed to update presence data');
//                 }
    
//                 const updatedPresenceData = await response.json();
    
//                 // Extract apogees of present students
//                 const presentApogees = updatedPresenceData
//                     .filter(updated => updated.present)
//                     .map(updated => updated.apogee);
    
//                 // Calculate new apogees to add
//                 const newApogees = apogee.filter(item => !presentApogees.includes(item));
    
//                 // Concatenate presentApogees with newApogees
//                 const updatedPresentApogees = presentApogees.concat(newApogees);
    
//                 // Update users state with updated presence information
//                 setUsers(prevUsers => prevUsers.map(user => ({
//                     ...user,
//                     present: updatedPresentApogees.includes(user.apogee),
//                 })));
    
//                 // Save updated presence data to localStorage (if needed)
//                 localStorage.setItem('presentQrabs', JSON.stringify(updatedPresentApogees));
//             } catch (error) {
//                 console.error('Error updating presence data:', error);
//             }
//         };
    
//         if (apogee.length > 0) {
//             updatePresence();
//         }
//     }, [sessionId, levelId, group, apogee, setUsers]);
    
    
   
  


//     const isNotPresent = (levelId, Apogee) => async () => {
//         try {
//             const response = await fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/absence/isnotpresent/${levelId}/${Apogee}/${group}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
//             if (!response.ok) {
//                 throw new Error('La requête a échoué');
//             }

//             // Update the user's present status in state and localStorage
//             setUsers(prevUsers => prevUsers.map(user => {
//                 if (user.apogee === Apogee) {
//                     return { ...user, present: false };
//                 }
//                 return user;
//             }));

//             // Update localStorage with new presence data
//             const updatedPresence = users.filter(user => user.apogee !== Apogee && user.present).map(user => user.apogee);
//             localStorage.setItem('presentQrabs', JSON.stringify(updatedPresence));
//         } catch (error) {
//             console.error('Erreur lors de l\'envoi de la requête:', error);
//         }
//     };

//     const isPresent = (sessionId, levelId, Apogee) => async () => {
//         try {
//             const response = await fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/absence/forprofesseur/${sessionId}/${levelId}/${group}?Apogee=${Apogee}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
//             if (!response.ok) {
//                 throw new Error('La requête a échoué');
//             }

//             // Update the user's present status in state and localStorage
//             setUsers(prevUsers => prevUsers.map(user => {
//                 if (user.apogee === Apogee) {
//                     return { ...user, present: true };
//                 }
//                 return user;
//             }));

//             // Update localStorage with new presence data
//             const updatedPresence = [...users.filter(user => user.present).map(user => user.apogee), Apogee];
//             localStorage.setItem('presentQrabs', JSON.stringify(updatedPresence));
//         } catch (error) {
//             console.error('Erreur lors de l\'envoi de la requête:', error);
//         }
//     };

//     const columns = [
//         {
//             field: 'photoURL',
//             headerName: 'Avatar',
//             width: 100,
//             renderCell: (params) => (
//                 <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
//                     <Avatar sx={{ width: 60, height: 60}} src={params.row.photoURL} />
//                 </div>
//             ),
//             sortable: false,
//             filterable: false,
//         },
//         {
//             field: 'apogee',
//             headerName: 'Apogee',
//             width: 100
//         },
//         {
//             field: 'name',
//             headerName: 'Name',
//             width: 170
//         },
//         {
//             field: 'present',
//             headerName: 'Present',
//             width: 100,
//             type: 'boolean',
//         },
//         {
//             field: 'notpresent',
//             headerName: '',
//             width: 80,
//             renderCell: (params) => (
//                 <IconButton onClick={isNotPresent(levelId, params.row.apogee)}>
//                     <CancelIcon sx={{ color: red[500] }} />
//                 </IconButton>
//             ),
//             sortable: false,
//             filterable: false,
//         },
//         {
//             field: 'ispresent',
//             headerName: '',
//             width: 80,
//             renderCell: (params) => (
//                 <IconButton onClick={isPresent(sessionId, levelId, params.row.apogee)}>
//                     <HowToRegIcon sx={{ color: green[500] }} />
//                 </IconButton>
//             ),
//             sortable: false,
//             filterable: false,
//         },
//     ];

//     return (
//         <Box
//             sx={{
//                 height: 800,
//                 width: '100%',
//             }}
//         >
//             <DataGrid
//                 columns={columns}
//                 rows={users}
//                 getRowId={(row) => row._id}
//                 rowsPerPageOptions={[5, 10, 20]}
//                 pageSize={20}
//                 rowHeight={70}
//                 getRowSpacing={(params) => ({
//                     top: params.isFirstVisible ? 0 : 5,
//                     bottom: params.isLastVisible ? 0 : 5,
//                 })}
//                 sx={{
//                     [`& .${gridClasses.row}`]: {
//                         bgcolor: (theme) =>
//                             theme.palette.mode === 'light' ? grey[200] : grey[900],
//                     },
//                 }}
//             />
//         </Box>
//     );
// }

// export default Users;

                








// import React, { useEffect, useState } from 'react';
// import SockJS from 'sockjs-client';
// import Stomp from 'stompjs';
// import { Avatar, Box } from '@mui/material';
// import { DataGrid, gridClasses } from '@mui/x-data-grid';
// import {green, grey, red} from '@mui/material/colors';
// import { v4 as uuidv4 } from 'uuid';

// import IconButton from '@mui/material/IconButton';
// import CancelIcon from '@mui/icons-material/Cancel';
// import HowToRegIcon from '@mui/icons-material/HowToReg';





// function Users({ sessionId, levelId, level, apogee ,group}) {
//     const [dataStudent, setDataStudent] = useState([]);
//     const [users, setUsers] = useState([]);


//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/students/${level}/${group}`);
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch student data');
//                 }
//                 const data = await response.json();
//                 setDataStudent(data);
//                 const updatedUsers = data.map(student => ({
//                     _id: uuidv4(),
//                     apogee: student.apogee,
//                     name: `${student.firstName} ${student.lastName}`,
//                     present: !!apogee.includes(student.apogee),
//                     photoURL: null // Initialize photoURL, will be updated later
//                 }));
//                 setUsers(updatedUsers);
//                 await Promise.all(data.map(async student => {
//                     try {
//                         const imageResponse = await fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/import-files/image/${student.apogee}`);
//                         if (!imageResponse.ok) {
//                             throw new Error('Image not found');
//                         }
//                         const imageBlob = await imageResponse.blob();
//                         const imageUrl = URL.createObjectURL(imageBlob);
//                         const updatedUser = updatedUsers.find(user => user.apogee === student.apogee);
//                         updatedUser.photoURL = imageUrl;
//                         setUsers(prevUsers => [...prevUsers]); // Update users state
//                     } catch (error) {
//                         console.error('Error fetching image data:', error);
//                     }
//                 }));
//             } catch (error) {
//                 console.error('Error fetching student data:', error);
//             }
//         };

//         fetchData();
//     }, [level, apogee]);

//     const isNotPresent = (levelId, Apogee) => () => {
//         fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/absence/isnotpresent/${levelId}/${Apogee}/${group}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('La requête a échoué');

//                 }
//             })
//             .catch(error => {
//                 console.error('Erreur lors de l\'envoi de la requête:', error);
//             });
//     };


//     const isPresent = (sessionId, levelId, Apogee) => {
//         fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/absence/forprofesseur/${sessionId}/${levelId}/${group}?Apogee=${Apogee}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('La requête a échoué');
//                 }
//             })
//             .catch(error => {
//                 console.error('Erreur lors de l\'envoi de la requête:', error);
//             });
//     };




//     const columns = [
//         {
//             field: 'photoURL',
//             headerName: 'Avatar',
//             width: 100,
//             renderCell: (params) => (
//                 <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
//                     <Avatar sx={{ width: 60, height: 60}} src={params.row.photoURL} />
//                 </div>
//             ),
//             sortable: false,
//             filterable: false,
//         },
//         {
//             field: 'apogee',
//             headerName: 'Apogee',
//             width: 100
//         },
//         {
//             field: 'name',
//             headerName: 'Name',
//             width: 170
//         },
//         {
//             field: 'present',
//             headerName: 'Present',
//             width: 100,
//             type: 'boolean',
//         },
//         {
//             field: 'notpresent',
//             headerName: '',
//             width: 80,
//             renderCell: (params) => (
//                 <IconButton onClick={isNotPresent(levelId, params.row.apogee)}>
//                     <CancelIcon sx={{ color: red[500] }} />
//                 </IconButton>
//             ),
//             sortable: false,
//             filterable: false,
//         },
//         {
//             field: 'ispresent',
//             headerName: '',
//             width: 80,
//             renderCell: (params) => (
//                 <IconButton onClick={()=>{isPresent(sessionId, levelId, params.row.apogee)}}>
//                     <HowToRegIcon sx={{ color: green[500] }} />
//                 </IconButton>
//             ),
//             sortable: false,
//             filterable: false,
//         },
//     ];


//     // Render the data grid
//     return (
//         <Box
//             sx={{
//                 height: 800,
//                 width: '100%',
//             }}
//         >
//             <DataGrid
//                 columns={columns}
//                 rows={users}
//                 getRowId={(row) => row._id}
//                 rowsPerPageOptions={[5, 10, 20]}
//                 pageSize={20}
//                 rowHeight={70}
//                 getRowSpacing={(params) => ({
//                     top: params.isFirstVisible ? 0 : 5,
//                     bottom: params.isLastVisible ? 0 : 5,
//                 })}
//                 sx={{
//                     [`& .${gridClasses.row}`]: {
//                         bgcolor: (theme) =>
//                             theme.palette.mode === 'light' ? grey[200] : grey[900],
//                     },
//                 }}
//             />

//         </Box>
//     );
// }

// export default Users;