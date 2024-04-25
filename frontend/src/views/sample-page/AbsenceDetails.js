import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect,useState} from "react";


function createData(Date, Seance , Justifie) {
    return { Date, Seance ,Justifie};
}

export default function BasicTable({ moduleId, studentApogee }) {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/absence/absence/details?studentApogee=${studentApogee}&moduleId=${moduleId}`)
            .then(response => response.json())
            .then(data => {
                // data est un objet dont les clés sont les étudiants
                // nous prenons la première clé ici et ses valeurs correspondantes
                const studentData = data[Object.keys(data)[0]];
                const rowData = studentData.map(item => ({ Date: item.absenceDate, Seance: item.sessionType, Justifie : 'Non' }));
                setRows(rowData);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });
    }, [moduleId, studentApogee]);

    return (
        <TableContainer sx={{width:500}}component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="simple table">
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

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}