import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';
import { Book } from '@mui/icons-material';
import axios from 'axios';

const CardWrapper = styled(MainCard)(({ theme, clicked,total  }) => ({
    backgroundColor: total >= 3 && clicked ? '#800000' : (total >= 3 ? '#A91101' : (clicked ? theme.palette.primary[800] : theme.palette.primary.dark)),
    color: theme.palette.primary.light,
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    transition: 'transform 0.4s ease-in-out',
    '&:hover': {
        backgroundColor: total >= 3 ? '#800000' : theme.palette.primary[800],
        transform: 'scale(1.05)',
    },
    '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: total >=3 ? `linear-gradient(210.04deg, #FF2424 -50.94%, rgba(144, 202, 249, 0) 83.49%)` : `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: total >=3 ? `linear-gradient(140.9deg, #FF2424 -14.02%, rgba(144, 202, 249, 0) 77.58%)` : `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

const Filiere = ({ levelId, levelName,sectorName, isLoading, onClick }) => {
    const [clicked, setClicked] = useState(false);
    const theme = useTheme();
    const [total,setTotal] = useState();

    useEffect(()=>{
      const fetchTotalAbsence = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/absence/level?levelId=${levelId}`);
          setTotal(response.data)
        } catch (error) {
          console.error('Error fetching absence:', error);
        }
      };
      fetchTotalAbsence();
    },[])

    const handleClick = () => {
        setClicked(true);
        onClick();
    };

  return (
    <div onClick={handleClick}>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <CardWrapper border={false} content={false} total={total}>
          <Box sx={{ p: 2 }}>
            <List sx={{ py: 0 }}>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      backgroundColor:total >= 3 ? '#990404' : theme.palette.primary[800],
                      color: '#fff'
                    }}
                  >
                    <Book fontSize='inherit'/>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    py: 0,
                    mt: 0.25,
                    mb: 0.25
                  }}
                  primary={
                    <>
                      <Typography variant="h4" sx={{ color: 'primary.light' }}>
                      Filière:<span style={{ fontWeight: 'bold',color: '#FFF' }}> {sectorName}</span> 
                      </Typography>
                      <Typography variant="h4" sx={{ color: 'primary.light' }}>
                      Niveau:<span style={{ fontWeight: 'bold',color: '#FFF' }}> {levelName}</span> 
                      </Typography>
                    </>
                  }
                  secondary={
                    <Typography variant="h5" sx={{ color: 'primary.light', mt: 0.25 }}>
                      Nombre D'absence: <span style={{ fontWeight: 'bold',borderBottom: '2px solid',color: '#FFF' }}> {total}</span>
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </CardWrapper>
      )}
    </div>
  );
};

Filiere.propTypes = {
  isLoading: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default Filiere;
