import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, ButtonGroup, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { grey } from '@mui/material/colors';
import { v4 as uuidv4 } from 'uuid';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import '../../assets/scss/style.css';

function AbsenceList({ levelId, moduleId, onButtonClick }) {
    const [users, setUsers] = useState([]);
    const [TypeSession, setTypeSession] = useState("Total");
    const buttonStyle = (sessionType) => ({
        backgroundColor: TypeSession === sessionType ? '#1976d2' : '',
        color: TypeSession === sessionType ? 'white' : '',
    });

    useEffect(() => {
        // Utilisation de fetch pour récupérer les données des absences
        fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/absence/absence/count?moduleId=${moduleId}&levelId=${levelId}`)
            .then(response => response.json())
            .then(data => {
                const updatedUsers = Object.keys(data).map(key => {
                    const studentString = key.match(/\(([^)]+)\)/)[1];
                    const studentFields = studentString.split(', ').reduce((acc, current) => {
                        const [key, value] = current.split('=').map(val => val.trim());
                        acc[key] = value;
                        return acc;
                    }, {});

                    const absenceData = data[key];

                    const getAbsenceCount = (typeSession) => {
                        if (typeSession === "Total") {
                            return (absenceData.TP || 0) + (absenceData.Cours || 0) + (absenceData.TD || 0);
                        } else {
                            return absenceData[typeSession] || 0;
                        }
                    };

                    const Nombredabsence = getAbsenceCount(TypeSession);

                    return {
                        _id: uuidv4(),
                        Apogee: studentFields.apogee,
                        name: studentFields.firstName,
                        firstname : studentFields.lastName,
                        Nombredabsence: Nombredabsence,
                        photoURL: '',
                    };
                });
                setUsers(updatedUsers);
                // Boucle pour récupérer les images des étudiants
                updatedUsers.forEach(user => {
                    fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/import-files/image/${user.Apogee}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Image not found');
                            }
                            return response.blob();
                        })
                        .then(imageBlob => {
                            const imageUrl = URL.createObjectURL(imageBlob);
                            const updatedUser = updatedUsers.find(u => u.Apogee === user.Apogee);
                            updatedUser.photoURL = imageUrl;
                            setUsers([...updatedUsers]);
                        })
                        .catch(error => console.error('Error fetching image data:', error));
                });
            })
            .catch(error => console.error('Error fetching student data:', error));
    }, [levelId, moduleId, TypeSession]);
    const columns = [
        {
            field: 'photoURL',
            headerName: 'Avatar',
            width: 150,
            headerAlign: 'center',
            renderCell: (params) =>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Avatar sx={{ width: 50, height: 50 }} src={params.row.photoURL} />
                </div>,
            sortable: false,
            filterable: false,
        },
        {
            field: 'Apogee',
            headerName: 'Apogee',
            width: 150,
            headerAlign: 'center',
            renderCell: (params) => <div className="header-center-text">{params.value}</div>
        },
        {
            field: 'name',
            headerName: 'Nom',
            width: 150,
            headerAlign: 'center',
            renderCell: (params) => <div className="header-center-text">{params.value}</div>
        },
        {
            field: 'firstname',
            headerName: 'Prénom',
            width: 150,
            headerAlign: 'center',
            renderCell: (params) => <div className="header-center-text">{params.value}</div>
        },
        {
            field: 'Nombredabsence',
            headerName: 'Nombre d\'absence',
            width: 150,
            headerAlign: 'center',
            renderCell: (params) => <div className="header-center-text">{params.value}</div>
        },
        {
            field: 'actions',
            headerName: '',
            width: 50,
            renderCell: (params) =>
                <IconButton className="header-center-text" onClick={() => onButtonClick(params.row.Apogee)} sx={{ color: '#1976d2' }}>
                    <InfoOutlinedIcon />
                </IconButton>,
            sortable: false,
            filterable: false,
            headerAlign: 'center',
        },
    ];

    return (
        <Grid container spacing={2} lg={12} justifyContent={'center'}>
            <Grid item>
                <ButtonGroup variant="outlined" aria-label="Basic button group">
                    <Button
                        style={buttonStyle('Total')}
                        onClick={() => setTypeSession('Total')}
                    >
                        Total
                    </Button>
                    <Button
                        style={buttonStyle('Cours')}
                        onClick={() => setTypeSession('Cours')}
                    >
                        Cours
                    </Button>
                    <Button
                        style={buttonStyle('TD')}
                        onClick={() => setTypeSession('TD')}
                    >
                        TD
                    </Button>
                    <Button
                        style={buttonStyle('TP')}
                        onClick={() => setTypeSession('TP')}
                    >
                        TP
                    </Button>
                </ButtonGroup>
            </Grid>
            <Grid item>
                <Box
                    sx={{
                        height: 'auto',  // Let the container adjust height based on rows
                        width: '100%',
                        overflow: 'hidden',  // Prevent scrolling within the container
                    }}
                >
                    <DataGrid
                        columns={columns}
                        rows={users}
                        getRowId={(row) => row._id}
                        pageSize={100}  // Display all rows
                        hideFooter
                        disableSelectionOnClick
                        rowHeight={60}  // Adjust row height if needed
                        sx={{
                            height: 'auto',  // Ensure DataGrid does not have internal scrolling
                            width: '100%',
                            '& .MuiDataGrid-row': {
                                bgcolor: (theme) =>
                                    theme.palette.mode === 'light' ? grey[200] : grey[900],
                                borderBottom: 'none',  // Remove row borders
                                '&:nth-of-type(odd)': {
                                    bgcolor: (theme) =>
                                        theme.palette.mode === 'light' ? grey[100] : grey[800],  // Color for odd rows
                                },
                            },
                        }}
                    />
                </Box>
            </Grid>
        </Grid>
    );
}

export default AbsenceList;


// import React, { useEffect, useState } from 'react';
// import { Avatar, Box, Button, ButtonGroup, Grid } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import { grey } from '@mui/material/colors';
// import { v4 as uuidv4 } from 'uuid';
// import IconButton from "@mui/material/IconButton";
// import InfoIcon from '@mui/icons-material/Info';
// import '../../assets/scss/style.css'

// function AbsenceList({ levelId, moduleId, onButtonClick }) {

//     const [users, setUsers] = useState([]);
//     const [TypeSession, setTypeSession] = useState("Total");
//     const buttonStyle = (sessionType) => ({
//         backgroundColor: TypeSession === sessionType ? '#1976d2' : '',
//         color: TypeSession === sessionType ? 'white' : '',
//     });

//     useEffect(() => {
//         fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/absence/absence/count?moduleId=${moduleId}&levelId=${levelId}`)
//             .then(response => response.json())
//             .then(data => {
//                 const updatedUsers = Object.keys(data).map(key => {
//                     const studentString = key.match(/\(([^)]+)\)/)[1];
//                     const studentFields = studentString.split(', ').reduce((acc, current) => {
//                         const [key, value] = current.split('=').map(val => val.trim());
//                         acc[key] = value;
//                         return acc;
//                     }, {});

//                     const absenceData = data[key];

//                     const getAbsenceCount = (typeSession) => {
//                         if (typeSession === "Total") {
//                             return (absenceData.TP || 0) + (absenceData.Cours || 0) + (absenceData.TD || 0);
//                         } else {
//                             return absenceData[typeSession] || 0;
//                         }
//                     };

//                     const Nombredabsence = getAbsenceCount(TypeSession);

//                     return {
//                         _id: uuidv4(),
//                         Apogee: studentFields.apogee,
//                         name: studentFields.firstName,
//                         firstname :studentFields.lastName,
//                         Nombredabsence: Nombredabsence,
//                         photoURL: '',
//                     };
//                 });
//                 setUsers(updatedUsers);
//                 // Boucle pour récupérer les images des étudiants
//                 updatedUsers.forEach(user => {
//                     fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/import-files/image/${user.Apogee}`)
//                         .then(response => {
//                             if (!response.ok) {
//                                 throw new Error('Image not found');
//                             }
//                             return response.blob();
//                         })
//                         .then(imageBlob => {
//                             const imageUrl = URL.createObjectURL(imageBlob);
//                             const updatedUser = updatedUsers.find(u => u.Apogee === user.Apogee);
//                             updatedUser.photoURL = imageUrl;
//                             setUsers([...updatedUsers]);
//                         })
//                         .catch(error => console.error('Error fetching image data:', error));
//                 });
//             })
//             .catch(error => console.error('Error fetching student data:', error));
//     }, [levelId, moduleId, TypeSession]);

//     const columns = [
//         {
//             field: 'photoURL',
//             headerName: 'Avatar',
//             width: 150,
//             renderCell: (params) =>
//                 <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
//                     <Avatar src={params.row.photoURL} />
//                 </div>,
//             sortable: false,
//             filterable: false,
//         },
//         {
//             field: 'Apogee',
//             headerName: 'Apogee',
//             width: 150,
//             headerAlign: 'center', 
//             renderCell: (params) => <div className="header-center-text">{params.value}</div>
//         },
//         {
//             field: 'name',
//             headerName: 'Nom',
//             width: 150,
//             headerAlign: 'center', 
//             renderCell: (params) => <div className="header-center-text">{params.value}</div>
//         },
//         {
//             field: 'firstname',
//             headerName: 'Prénom',
//             width: 150,
//             headerAlign: 'center', 
//             renderCell: (params) => <div className="header-center-text">{params.value}</div>
//         },
//         {
//             field: 'Nombredabsence',
//             headerName: 'Nombre d\'absence',
//             width: 150,
//             headerAlign: 'center', 
//             renderCell: (params) => <div className="header-center-text">{params.value}</div>
//         },
//         {
//             field: 'ispresent',
//             headerName: '',
//             width: 150,
//             renderCell: (params) =>
//                 <IconButton onClick={() => onButtonClick(params.row.Apogee)}> {/* Modifié */}
//                     <InfoIcon />
//                 </IconButton>,
//             sortable: false,
//             filterable: false,
//             headerAlign: 'center', renderCell: (params) => <div className="header-center-text">{params.value}</div>
//         },
//     ];

//     return (
//         <Grid container spacing={2} lg={12} justifyContent={'center'}>
//          <Grid item>
//                 <ButtonGroup variant="outlined" aria-label="Basic button group">
//                     <Button
//                         style={buttonStyle('Total')}
//                         onClick={() => setTypeSession('Total')}
//                     >
//                         Total
//                     </Button>
//                     <Button
//                         style={buttonStyle('Cours')}
//                         onClick={() => setTypeSession('Cours')}
//                     >
//                         Cours
//                     </Button>
//                     <Button
//                         style={buttonStyle('TD')}
//                         onClick={() => setTypeSession('TD')}
//                     >
//                         TD
//                     </Button>
//                     <Button
//                         style={buttonStyle('TP')}
//                         onClick={() => setTypeSession('TP')}
//                     >
//                         TP
//                     </Button>
//                 </ButtonGroup>
//             </Grid>
//             <Grid item >
//                 <Box
//                     sx={{
//                         height: 700,
//                         width: '100%',
//                     }}
//                 >
//                     <DataGrid
//                         columns={columns}
//                         rows={users}
//                         getRowId={(row) => row._id}
//                         rowsPerPageOptions={[5, 10, 20]}
//                         pageSize={20}
//                         hideFooter

//                         getRowSpacing={(params) => ({
//                             top: params.isFirstVisible ? 0 : 5,
//                             bottom: params.isLastVisible ? 0 : 5,
//                         })}
//                         sx={{
//                             '& .MuiDataGrid-row': {
//                                 bgcolor: (theme) =>
//                                     theme.palette.mode === 'light' ? grey[200] : grey[900],
//                             },
//                         }}
//                     />
//                 </Box>
//             </Grid>
//         </Grid>
//     );
// }

// export default AbsenceList;
