import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Avatar, Box } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { grey } from '@mui/material/colors';
import { v4 as uuidv4 } from 'uuid';

function Users({ level ,apogee}) {
    const [dataStudent, setDataStudent] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/students/${level}`)
            .then(response => response.json())
            .then(data => {
                setDataStudent(data);
                const updatedUsers = data.map(student => ({
                    _id: uuidv4(),
                    Apogee: student.apogee,
                    name: `${student.firstName} ${student.lastName}`,
                    present: !!apogee.includes(student.apogee) // Removed unnecessary semicolon
                }));
                setUsers(updatedUsers);
                data.forEach(student => {
                    fetch(`http://localhost:8080/api/import-files/image/${student.apogee}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Image not found');
                            }
                            return response.blob();
                        })
                        .then(imageBlob => {
                            const imageUrl = URL.createObjectURL(imageBlob);
                            const updatedUser = updatedUsers.find(user => user.Apogee === student.apogee);
                            updatedUser.photoURL = imageUrl;
                            setUsers([...updatedUsers]);
                        })
                        .catch(error => console.error('Error fetching image data:', error));
                });
            })
            .catch(error => console.error('Error fetching student data:', error)); // Added closing parenthesis and brace

    }, [level,apogee]);


    const columns = [
        {
            field: 'photoURL',
            headerName: 'Avatar',
            width: 100,
            renderCell: (params) =>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Avatar src={params.row.photoURL} />
                </div>,
            sortable: false,
            filterable: false,
        },
        {
            field: 'Apogee',
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
    ];

    // Render the data grid
    return (
        <Box
            sx={{
                height: 700,
                width: '100%',
            }}
        >
            <DataGrid
                columns={columns}
                rows={users}
                getRowId={(row) => row._id}
                rowsPerPageOptions={[5, 10, 20]}
                pageSize={20}
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