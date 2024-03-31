import { useEffect, useState } from 'react';

// material-ui
import { Grid,Box,TextField,Typography,Divider } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';

// project imports

import TotalIncomeLightCard from '../dashboard/Default/TotalIncomeLightCard';
import TotalGrowthBarChart from '../dashboard/Default/TotalGrowthBarChart';
import TotalIncomeDarkCard from '../dashboard/Default/TotalIncomeDarkCard';
import PopularCard from '../dashboard/Default/PopularCard';
import { gridSpacing } from 'store/constant';
import { flexbox } from '@mui/system';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];
const Departement = ({name,abr}) => {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>

      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={12} md={6} sm={6} xs={12}>
            <TotalIncomeLightCard isLoading={isLoading} name={name} abr={abr} />
          </Grid>
          {/* <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid> */}
          <Grid item lg={8} md={6} sm={6} xs={12} justifyContent={'center'}>
            {/* <TotalOrderLineChartCard isLoading={isLoading} />*/}
            <Stack direction="row" spacing={2} justifyContent={'center'}>
              <Button color="warning" size='large' fullWidth variant='contained'>Voir Modules</Button>
              <Button color="warning" size='large' fullWidth variant='contained'>Voir Professeurs</Button>
            </Stack>
          </Grid>
          <Grid item lg={8} xs={12} md={8}>
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection
                />
            </div>
          </Grid>
          {/* <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid> */}
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing} justifyContent={'center'}>
              <Grid item lg={12} sm={6} xs={12} md={6}>
                {/* <TotalIncomeDarkCard isLoading={isLoading} /> */}
                <Box
                    component="form"
                    sx={{
                      '& > :not(style)': { m: 1, },
                    }}
                    noValidate
                    padding={'20px 10px 20px 10px'}
                    width={'100%'}
                    autoComplete="off"
                    bgcolor={'#fff'}
                    borderRadius={'20px'}
                    display={'flex'}
                    flexDirection={'column'}
                  > 
                    <Typography variant="h4" textAlign={'center'}>Ajouter module</Typography>
                    <TextField id="standard-basic" label="Nom De Module" variant="standard" />
                    <TextField id="standard-basic" label="ID De Departement" variant="standard" />
                    <Button variant="outlined" color="primary" style={{marginTop:'30px'}}>Ajouter</Button>
                </Box>
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <div style={{backgroundColor:"#000",height:'1px'}}></div>
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12} >
                {/* <TotalIncomeLightCard isLoading={isLoading} /> */}
                <Box
                    component="form"
                    sx={{
                      '& > :not(style)': { m: 1, },
                    }}
                    noValidate
                    padding={'20px 10px 20px 10px'}
                    width={'100%'}
                    autoComplete="off"
                    bgcolor={'#fff'}
                    borderRadius={'20px'}
                    display={'flex'}
                    flexDirection={'column'}
                  > 
                    <Typography variant="h4" textAlign={'center'}>Ajouter Professeur</Typography>
                    <TextField id="standard-basic" label="Nom " variant="standard" />
                    <TextField id="standardstandard-basic" label="Prénom" variant="standard" />
                    <TextField id="standardstandard-basic" label="Email"standard variant="standard" />
                    <TextField id="standardstandard-basic" label="ID De Departement" variant="standard" />
                    <Button variant="outlined" color="primary" style={{marginTop:'30px'}}>Ajouter</Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          {/* <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid> */}
          <Grid item lg={12} xs={12} md={8}>
            
        </Grid>
      </Grid>
      </Grid>
    </Grid>
  );
};

export default Departement;
