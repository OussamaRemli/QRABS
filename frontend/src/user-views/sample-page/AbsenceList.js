import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, ButtonGroup, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { grey } from '@mui/material/colors';
import { v4 as uuidv4 } from 'uuid';
import IconButton from "@mui/material/IconButton";
import InfoIcon from '@mui/icons-material/Info';

function AbsenceList({ levelId, moduleId, onButtonClick }) {

    const [users, setUsers] = useState([]);
    const [TypeSession, setTypeSession] = useState("Total");

    useEffect(() => {
        // Utilisation de fetch pour récupérer les données des absences
        fetch(`http://localhost:8080/api/absence/absence/count?professorId=1&moduleId=${moduleId}&levelId=${levelId}`)
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
                        name: `${studentFields.firstName} ${studentFields.lastName}`,
                        Nombredabsence: Nombredabsence,
                        photoURL: '',
                    };
                });
                setUsers(updatedUsers);
                // Boucle pour récupérer les images des étudiants
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
    }, [levelId, moduleId, TypeSession]);

    const columns = [
        {
            field: 'photoURL',
            headerName: 'Avatar',
            width: 100,
            renderCell: (params) =>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Avatar sx={{ width: 60, height: 60}} src={params.row.photoURL} />
                </div>,
            sortable: false,
            filterable: false,
        },
        {
            field: 'Apogee',
            headerName: 'Apogee',
            width: 80
        },
        {
            field: 'name',
                headerName: 'Nom',
            width: 150
        },
        {
            field: 'Nombredabsence',
            headerName: 'Nombre d\'absence',
            width: 150,
        },
        {
            field: 'ispresent',
            headerName: '',
            width: 60,
            renderCell: (params) =>
                <IconButton onClick={() => onButtonClick(params.row.Apogee)}> {/* Modifié */}
                    <InfoIcon />
                </IconButton>,
            sortable: false,
            filterable: false,
        },
    ];

    return (
        <Grid container spacing={2}>
            <Grid item>
                <ButtonGroup variant="outlined" aria-label="Basic button group">
                    <Button onClick={() => setTypeSession("Total")}>Total</Button>
                    <Button onClick={() => setTypeSession("Cours")}>Cours</Button>
                    <Button onClick={() => setTypeSession("TD")}>TD</Button>
                    <Button onClick={() => setTypeSession("TP")}>TP</Button>
                </ButtonGroup>
            </Grid>
            <Grid item>
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
                        rowHeight={70}
                        getRowSpacing={(params) => ({
                            top: params.isFirstVisible ? 0 : 5,
                            bottom: params.isLastVisible ? 0 : 5,
                        })}
                        sx={{
                            '& .MuiDataGrid-row': {
                                bgcolor: (theme) =>
                                    theme.palette.mode === 'light' ? grey[200] : grey[900],
                            },
                        }}
                    />
                </Box>
            </Grid>
        </Grid>
    );
}

export default AbsenceList;
