import {Grid, IconButton} from '@mui/material';
import {gridSpacing} from 'store/constant';

import AbsenceList from './AbsenceList';

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

    
        <Grid container spacing={gridSpacing} style={{ marginTop: '5px', marginBottom: '20px' }}>
            <Grid item xs={12}>
            {!selector && (
                <Grid container spacing={gridSpacing} justifyContent="center">
                    <Grid item lg={7} md={10} sm={6} xs={12}>
                        <AbsenceList levelId={levelId} moduleId={moduleId} onButtonClick={handleButtonClick} />
                    </Grid>
                </Grid>
            )}
                {selector && (  <Grid container spacing={gridSpacing}>

                        <>
                            <Grid>
                                <IconButton onClick={()=>{setSelector(!selector)}}>
                                    <ArrowBackIcon />
                                </IconButton>
                            </Grid>
                            <Grid item lg={5} md={5} sm={5} xs={5}>
                                <StudentCard Apogee={Apogee} />
                            </Grid>
                            <br />
                            <Grid item lg={10} md={6} sm={6} xs={12}>
                                <AbsenceDetails moduleId={moduleId} studentApogee={Apogee} />
                            </Grid>
                        </>

                </Grid>)}
            </Grid>
        </Grid>
    );

};

export default Index;
