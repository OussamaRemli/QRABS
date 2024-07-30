import React, { useEffect, useState } from 'react';
import { Avatar, Box } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { green, grey, red } from '@mui/material/colors';
import { v4 as uuidv4 } from 'uuid';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DoneIcon from '@mui/icons-material/Done'; // Import DoneIcon
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon
import '../../../assets/scss/style.css';

function Users({ sessionId, levelId, level, group, apogee }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/students/${level}/${group}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch student data');
                }
                const data = await response.json();

                const storedPresence = JSON.parse(localStorage.getItem('presentQrabs')) || [];

                const initialUsers = data.map(student => ({
                    _id: uuidv4(),
                    apogee: student.apogee,
                    name: `${student.firstName} ${student.lastName}`,
                    present: storedPresence.includes(student.apogee),
                    photoURL: null,
                }));

                setUsers(initialUsers);

                await Promise.all(data.map(async student => {
                    try {
                        const imageResponse = await fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/import-files/image/${student.apogee}`);
                        if (!imageResponse.ok) {
                            throw new Error('Image not found');
                        }
                        const imageBlob = await imageResponse.blob();
                        const imageUrl = URL.createObjectURL(imageBlob);

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
    }, [level, group]);

    useEffect(() => {
        if (apogee.length > 0) {
            setUsers(prevUsers => {
                const updatedUsers = prevUsers.map(user => ({
                    ...user,
                    present: apogee.includes(user.apogee) || user.present,
                }));

                const currentPresence = JSON.parse(localStorage.getItem('presentQrabs')) || [];
                const newPresence = [...new Set([...currentPresence, ...apogee])];
                localStorage.setItem('presentQrabs', JSON.stringify(newPresence));

                return updatedUsers;
            });
        }
    }, [apogee]);

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

                let presentQrabs = JSON.parse(localStorage.getItem('presentQrabs')) || [];

                if (isPresent) {
                    presentQrabs = [...new Set([...presentQrabs, apogee])];
                } else {
                    presentQrabs = presentQrabs.filter(id => id !== apogee);
                }

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
            flex: 0.2,
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Avatar sx={{ width: 60, height: 60 }} src={params.row.photoURL} />
                </div>
            ),
            sortable: false,
            filterable: false,
            headerAlign: 'center',
        },
        {
            field: 'apogee',
            headerName: 'Apogee',
            flex: 0.2,
            headerAlign: 'center',
            renderCell: (params) => <div className="header-center-text">{params.value}</div>
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 0.2,
            headerAlign: 'center',
            renderCell: (params) => <div className="header-center-text">{params.value}</div>
        },
        {
            field: 'present',
            headerName: 'Present',
            flex: 0.2,
            type: 'boolean',
            headerAlign: 'center',
            renderCell: (params) => (
                params.value ? <DoneIcon sx={{ color: green[500] }} /> : <CloseIcon sx={{ color: grey[500] }} />
            )
        },
        {
            field: 'notpresent',
            headerName: '',
            flex: 0.1,
            renderCell: (params) => (
                <IconButton className="header-center-text" onClick={handlePresenceChange(params.row.apogee, false)}>
                    <CancelIcon sx={{ color: red[500] }} />
                </IconButton>
            ),
            sortable: false,
            filterable: false,
        },
        {
            field: 'ispresent',
            headerName: '',
            flex: 0.1,
            renderCell: (params) => (
                <IconButton className="header-center-text" onClick={handlePresenceChange(params.row.apogee, true)}>
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
                height: '0.9',  // Ensure DataGrid does not have internal scrolling
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
        >
            <DataGrid
                columns={columns}
                rows={users}
                getRowId={(row) => row._id}
                rowsPerPageOptions={[5, 10, 20]}
                pageSize={20}
                rowHeight={70}
                hideFooter
                getRowSpacing={() => ({
                    top: 0,
                    bottom: 0,
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
