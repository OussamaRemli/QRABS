import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from "@mui/material/IconButton";
import { Snackbar, Alert } from '@mui/material';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';

function createData(Id, Date, Seance, Justifie) {
    return { Id, Date, Seance, Justifie };
}

export default function BasicTable({ moduleId, studentApogee }) {
    const [rows, setRows] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');

    useEffect(() => {
        fetchData();
    }, [moduleId, studentApogee]);

    const fetchData = () => {
        axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/absence/absence/details?studentApogee=${studentApogee}&moduleId=${moduleId}`)
            .then(response => {
                const studentData = response.data[Object.keys(response.data)[0]];
                const rowData = studentData.map(item => ({
                    Id: item.absenceId,
                    Date: new Date(item.absenceDate).toLocaleDateString('en-CA'),
                    Seance: item.sessionType,
                    Justifie: item.justified ? 'Oui' : 'Non',
                }));
                setRows(rowData);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });
    }

    const handleClick = (absenceId) => {
        axios.put(`${process.env.REACT_APP_SPRING_BASE_URL}/api/absence/absence/justify?absenceId=${absenceId}`)
            .then(response => {
                if (response.status === 200) {
                    console.log('La justification de l\'absence a réussi.');
                    fetchData();
                } else {
                    console.error('La justification de l\'absence a échoué.');
                }
            })
            .catch(error => {
                console.error('Une erreur s\'est produite lors de la justification de l\'absence : ', error);
                setSnackbarSeverity('error');
                setSnackbarMessage('Impossible de modifier : délai dépassé (3 jours).');
                setOpenSnackbar(true)
            });
    }

    // const handleSnackbarOpen = (message) => {
    //     setSnackbarMessage(message);
    //     setOpenSnackbar(true);
    // };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: 'auto', mt: 2 }}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Type de séance</TableCell>
                        <TableCell align="right">Justifié</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                                {row.Date}
                            </TableCell>
                            <TableCell align="right">{row.Seance}</TableCell>
                            <TableCell align="right">{row.Justifie}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => { handleClick(row.Id) }}>
                                    {row.Justifie === 'Oui' ? <CheckBoxOutlinedIcon /> : <CheckBoxOutlineBlankOutlinedIcon />}
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    severity={snackbarSeverity}
                    onClose={handleSnackbarClose}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </TableContainer>
    );
}

// import React, { useEffect, useState } from 'react';
// import axios from 'axios'; // Import Axios
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import IconButton from "@mui/material/IconButton";
// import { Snackbar, Alert } from '@mui/material';
// import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
// import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
// function createData(Id, Date, Seance, Justifie) {
//     return { Id, Date, Seance, Justifie };
// }

// export default function BasicTable({ moduleId, studentApogee }) {
//     const [rows, setRows] = useState([]);
//     const [openSnackbar, setOpenSnackbar] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState('');
//     const [snackbarSeverity, setSnackbarSeverity] = useState('error');

//     useEffect(() => {
//         fetchData();
//     }, [moduleId, studentApogee]);

//     const fetchData = () => {
//         axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/absence/absence/details?studentApogee=${studentApogee}&moduleId=${moduleId}`)
//             .then(response => {
//                 const studentData = response.data[Object.keys(response.data)[0]];
//                 const rowData = studentData.map(item => ({
//                     Id: item.absenceId,
//                     Date: new Date(item.absenceDate).toLocaleDateString('en-CA'),
//                     Seance: item.sessionType,
//                     Justifie: item.justified ? 'Oui' : 'Non',
//                 }));
//                 setRows(rowData);
//             })
//             .catch(error => {
//                 console.error('Erreur lors de la récupération des données:', error);
//             });
//     }

//     const handleClick = (absenceId) => {
//         axios.put(`${process.env.REACT_APP_SPRING_BASE_URL}/api/absence/absence/justify?absenceId=${absenceId}`)
//             .then(response => {
//                 if (response.status === 200) {
//                     console.log('La justification de l\'absence a réussi.');
//                     fetchData();
//                 } else {
//                     console.error('La justification de l\'absence a échoué.');
//                 }
//             })
//             .catch(error => {
//                 console.error('Une erreur s\'est produite lors de la justification de l\'absence : ', error);
//                 setSnackbarSeverity('error');
//                 setSnackbarMessage('Impossible de modifier : délai dépassé (3 jours).');
//                 setOpenSnackbar(true)
//             });
//     }
//     const handleSnackbarOpen = (message) => {
//         setSnackbarMessage(message);
//         setOpenSnackbar(true);
//     };   
//     const handleSnackbarClose = (event, reason) => {
//         if (reason === 'clickaway') {
//             return;
//         }
//         setOpenSnackbar(false);
//     };

//     return (
//         <TableContainer sx={{ width: 500 }} component={Paper}>
//             <Table sx={{ minWidth: 500 }} aria-label="simple table">
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>Date</TableCell>
//                         <TableCell align="right">Type de séance</TableCell>
//                         <TableCell align="right">Justifié</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {rows.map((row, index) => (
//                         <TableRow key={index}>
//                             <TableCell component="th" scope="row">
//                                 {row.Date}
//                             </TableCell>
//                             <TableCell align="right">{row.Seance}</TableCell>
//                             <TableCell align="right">{row.Justifie}</TableCell>
//                             <TableCell>
//                                 <IconButton onClick={() => { handleClick(row.Id) }}>
//                                 {row.Justifie === 'Oui' ? <CheckBoxOutlinedIcon /> : <CheckBoxOutlineBlankOutlinedIcon />}
//                                 </IconButton>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//             <Snackbar
//                 open={openSnackbar}
//                 autoHideDuration={4000}
//                 onClose={handleSnackbarClose}
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//                 >
//                 <Alert 
//                     severity={snackbarSeverity}
//                     onClose={handleSnackbarClose}
//                     variant="filled"
//                     sx={{ width: '100%' }}
//                 >
//                 {snackbarMessage}
//                 </Alert>
//                 </Snackbar>
//         </TableContainer>
//     );
// }
