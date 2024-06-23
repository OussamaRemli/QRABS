import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';
import { Book } from '@mui/icons-material';
import axios from 'axios';

const CardWrapper = styled(MainCard)(({ theme, clicked,total  }) => ({
  backgroundColor: total >= 3 && clicked ? '#800000' : (total >= 3 ? '#A91101' : (clicked ? theme.palette.primary[800] : theme.palette.primary.dark)),  color: theme.palette.primary.light,
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  '&:hover': {
      backgroundColor: total >= 3 ? '#800000' : theme.palette.primary[800],
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

const Module = ({ name, professor, levelId, isLoading, onClick, isActive }) => {
    const [clicked, setClicked] = useState(false);
    const theme = useTheme();
    const [total,setTotal] = useState();

    useEffect(()=>{
      const fetchTotalAbsence = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/absence/level/module?levelId=${levelId}&moduleName=${name}`);
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
        <CardWrapper border={false} content={false} clicked={isActive} total={total}>
          <Box sx={{ p: 2,minHeight:'125px' }}>
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
                    mt: 0.45,
                    mb: 0.45
                  }}
                  primary={
                    <Typography variant="h4" sx={{ color: '#fff' }}>
                      {name}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="h6" sx={{ color: 'primary.light', mt: 0.25 }}>
                        Pr.<span style={{ fontWeight: 'bold' }}>{professor.name}</span>
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'primary.light', mt: 0.25 }}>
                        Nombre d'absence:<span style={{ fontWeight: 'bold',fontSize:'14px',borderBottom: '2px solid' }}> {total}</span>
                      </Typography>
                    </>
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

Module.propTypes = {
  isLoading: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default Module;
