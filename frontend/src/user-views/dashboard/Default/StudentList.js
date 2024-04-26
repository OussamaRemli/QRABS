import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Avatar, Box } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {green, grey, red} from '@mui/material/colors';
import { v4 as uuidv4 } from 'uuid';

import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import HowToRegIcon from '@mui/icons-material/HowToReg';





function Users({ sessionId, levelId, level, apogee }) {
    const [dataStudent, setDataStudent] = useState([]);
    const [users, setUsers] = useState([]);
    const [ip,setIp] =useState(94894);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/students/${level}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch student data');
                }
                const data = await response.json();
                setDataStudent(data);
                const updatedUsers = data.map(student => ({
                    _id: uuidv4(),
                    apogee: student.apogee,
                    name: `${student.firstName} ${student.lastName}`,
                    present: !!apogee.includes(student.apogee),
                    photoURL: null // Initialize photoURL, will be updated later
                }));
                setUsers(updatedUsers);
                await Promise.all(data.map(async student => {
                    try {
                        const imageResponse = await fetch(`http://localhost:8080/api/import-files/image/${student.apogee}`);
                        if (!imageResponse.ok) {
                            throw new Error('Image not found');
                        }
                        const imageBlob = await imageResponse.blob();
                        const imageUrl = URL.createObjectURL(imageBlob);
                        const updatedUser = updatedUsers.find(user => user.apogee === student.apogee);
                        updatedUser.photoURL = imageUrl;
                        setUsers(prevUsers => [...prevUsers]); // Update users state
                    } catch (error) {
                        console.error('Error fetching image data:', error);
                    }
                }));
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };

        fetchData();
    }, [level, apogee]);

    const isNotPresent = (levelId, Apogee) => () => {
        fetch(`http://localhost:8080/api/absence/isnotpresent/${levelId}/${Apogee}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('La requête a échoué');
                }
                showAlert('Ceci est une alerte de succès — regardez!', 'success');
            })
            .catch(error => {
                console.error('Erreur lors de l\'envoi de la requête:', error);
                showAlert('Ceci est une alerte d\'erreur — attention!', 'error');
            });
    };

    const isPresent = (sessionId, levelId, Apogee) => {
        fetch(`http://localhost:8080/api/absence/scan/${sessionId}/${levelId}?Apogee=${Apogee}&ip=${ip}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('La requête a échoué');
                }
                showAlert('Ceci est une alerte de succès — regardez!', 'success');
                setIp(ip + 1);
            })
            .catch(error => {
                console.error('Erreur lors de l\'envoi de la requête:', error);
                showAlert('Ceci est une alerte d\'erreur — attention!', 'error');
            });
    };


    const showAlert = (message, type) => {
        // Implement your logic to display an alert
    };

    const columns = [
        {
            field: 'photoURL',
            headerName: 'Avatar',
            width: 100,
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Avatar sx={{ width: 60, height: 60}} src={params.row.photoURL} />
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
                <IconButton onClick={isNotPresent(levelId, params.row.apogee)}>
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
                <IconButton onClick={()=>{isPresent(sessionId, levelId, params.row.apogee)}}>
                    <HowToRegIcon sx={{ color: green[500] }} />
                </IconButton>
            ),
            sortable: false,
            filterable: false,
        },
    ];


    // Render the data grid
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