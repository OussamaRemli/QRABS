import React, { useEffect, useState } from 'react';
import { Avatar, Box } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { grey } from '@mui/material/colors';
import { v4 as uuidv4 } from 'uuid';
import IconButton from "@mui/material/IconButton";
import InfoIcon from '@mui/icons-material/Info';
function AbsenceList({ levelId, moduleId ,SessionType }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/absence/absence/count?professorId=1&moduleId=${moduleId}&levelId=${levelId}`)
            .then(response => response.json())
            .then(data => {
                const updatedUsers = Object.keys(data).map(key => {
                    // Extraction des informations de l'étudiant depuis la clé
                    const studentString = key.match(/\(([^)]+)\)/)[1];
                    const studentFields = studentString.split(', ').reduce((acc, current) => {
                        const [k, v] = current.split('=');
                        acc[k.trim()] = v.trim();
                        return acc;
                    }, {});

                    // Création de l'objet utilisateur avec les données extraites
                    return {
                        _id: uuidv4(),
                        Apogee: studentFields.apogee,
                        name: `${studentFields.firstName} ${studentFields.lastName}`,
                        Nombredabsence: data[key],
                        photoURL: '',
                    };
                });
                setUsers(updatedUsers);
                updatedUsers.forEach(user => {
                    fetch(`http://localhost:8080/api/import-files/image/${user.Apogee}`)
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
    }, [levelId, moduleId]);

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
            field: 'Nombredabsence',
            headerName: 'Nombre d\'absence',
            width: 150,
        },
        {
            field: 'ispresent',
            headerName: '',
            width: 80,
            renderCell: (params) =>
                <IconButton>
                    <InfoIcon/>
                </IconButton>,
            sortable: false,
            filterable: false,
        },
    ];
    return (
        <Box
            sx={{
                height: 700,
                width: '80%',
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

export default AbsenceList;
