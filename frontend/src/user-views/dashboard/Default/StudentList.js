import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Avatar, Box } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { grey } from '@mui/material/colors';
import { v4 as uuidv4 } from 'uuid';

function Users({ level }) {
    const [dataStudent, setDataStudent] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);
    
        stompClient.connect({}, function () {
            stompClient.subscribe('/topic/presence', function (message) {
                setUsers(users => users.map(item => 
                    item.Apogee == message.body ? { ...item, present: true } : item
                ));
            });
        });
    
        fetch(`http://localhost:8080/api/students/${level}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setDataStudent(data);
                setUsers(data.map(student => ({
                    _id: uuidv4(),
                    photoURL: `c://Users//LLLNNN//OneDrive//Desktop//GestAbs//backend//src//main//resources//students-images//2017466.jpeg`,
                    Apogee: `${student.apogee}`,
                    name: `${student.firstName} ${student.lastName}`,
                    present: null
                })));
            })
            .catch(error => console.error('Error fetching student data:', error));
    }, [level]);
    
    // Define the columns for the data grid
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
