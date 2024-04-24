import {Button, ButtonGroup, Grid, IconButton} from '@mui/material';
import {gridSpacing} from 'store/constant';

import AbsenceList from './AbsenceList';
import Chart from './PieChart';

import StudentCard from './StudentCard';
import AbsenceDetails from './AbsenceDetails';
import {useState} from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Index = ({levelId, moduleId}) => {

    const [Apogee, setApogee] = useState(null);
    const [selector ,setSelector] =useState(null);
    const handleButtonClick = (Apogee) => {
        setApogee(Apogee);
        setSelector(!selector);
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    {/* Affiche le graphique si le sélecteur n'est pas activé */}
                    {!selector && (
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <Chart />
                        </Grid>
                    )}
                    {/* Grille pour la liste des absences */}
                    {!selector && (
                        <Grid item lg={10} md={6} sm={6} xs={12}>
                            <AbsenceList levelId={levelId} moduleId={moduleId} onButtonClick={handleButtonClick} />
                        </Grid>
                    )}
                    {/* Afficher les détails de l'apogée sélectionné s'il y en a un */}
                    {selector && (
                        <>
                            <Grid>
                                <IconButton onClick={()=>{setSelector(!selector)}}>
                                    <ArrowBackIcon />
                                </IconButton>
                            </Grid>
                            {/* Grille pour la carte de l'étudiant */}
                            <Grid item lg={4} md={6} sm={6} xs={12}>
                                <StudentCard Apogee={Apogee} />
                            </Grid>
                            <br />
                            {/* Grille pour les détails de l'absence */}
                            <Grid item lg={4} md={6} sm={6} xs={12}>
                                <AbsenceDetails moduleId={moduleId} studentApogee={Apogee} />
                            </Grid>
                        </>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );

};

export default Index;
