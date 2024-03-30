import React from 'react';
import { Avatar, Box } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { grey } from '@mui/material/colors';

function Users() {
    const columns = [
        {
            field: 'photoURL',
            headerName: 'Avatar',
            width: 60,
            renderCell: (params) => <Avatar src={params.row.photoURL} />,
            sortable: false,
            filterable: false,
        },
        { field: 'name', headerName: 'Name', width: 170 },
        {
            field: 'present',
            headerName: 'Present',
            width: 100,
            type: 'boolean',
        },
    ];

    const users = [
        {
            _id: '1',
            photoURL: 'https://example.com/user1.jpg',
            name: 'John Doe',
            present: true,
        },
        {
            _id: '2',
            photoURL: 'https://example.com/user2.jpg',
            name: 'Jane Smith',
            present: false,
        },
        {
            _id: '3', // Added more users
            photoURL: 'https://example.com/user3.jpg',
            name: 'Alice Johnson',
            present: true,
        },
        {
            _id: '4',
            photoURL: 'https://example.com/user4.jpg',
            name: 'Bob Williams',
            present: false,
        },
        {
            _id: '5', // ... and so on
            photoURL: 'https://example.com/user5.jpg',
            name: 'Charlie Miller',
            present: true,
        },
        // ... Add more users with unique IDs and data
    ];

    return (
        <Box
            sx={{
                height: 400,
                width: '100%',
            }}
        >
            <DataGrid
                columns={columns}
                rows={users}
                getRowId={(row) => row._id}
                rowsPerPageOptions={[5, 10, 20]}
                pageSize={20} // Set a default page size
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
