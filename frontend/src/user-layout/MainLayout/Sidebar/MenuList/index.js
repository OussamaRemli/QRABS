import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import NavGroup from './NavGroup';
import { IconDashboard } from '@tabler/icons-react';
import axios from 'axios';
import WarningIcon from '@mui/icons-material/Warning';
import { Box } from '@mui/material';

const icons = { IconDashboard };


const IconWithText = ({ icon: Icon, text }) => {
  return (
    <Box display="flex" alignItems="center">
      <span>{text}</span>
      {Icon && <Icon style={{ marginRight: 4, marginLeft: 8,color: 'red' }} />}

    </Box>
  );
};

const MenuList = () => {
  const [menuItems, setMenuItems] = useState([
    {
      id: 'dashboard',
      title: 'Accueil',
      type: 'group',
      children: [
        {
          id: 'default',
          title: 'Accueil',
          type: 'item',
          url: '/dashboard/default',
          icon: icons.IconDashboard,
          breadcrumbs: false,
        },
      ],
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('Token is not available');
        }

        const tokenParts = token.split('.');
        const tokenPayload = JSON.parse(atob(tokenParts[1]));
        const professorId = parseInt(tokenPayload.id, 10);

        const response = await axios.get(
          `${process.env.REACT_APP_SPRING_BASE_URL}/api/session/professor/${professorId}/modules`
        );
        const data = response.data;

        const moduleAbsences = await Promise.all(
          data.map(async (module) => {
            const absenceResponse = await axios.get(
              `${process.env.REACT_APP_SPRING_BASE_URL}/api/absence/level/module`,
              {
                params: {
                  levelId: module.level.levelId,
                  moduleName: module.moduleName,
                },
              }
            );

            const absenceAResponse = await axios.get(
              `${process.env.REACT_APP_SPRING_BASE_URL}/api/absence/module/level`,
              {
                params: {
                  levelId: module.level.levelId,
                  module_id: module.moduleId,
                },
              }
            );

            const absenceCount = absenceResponse.data;
            const absenceA = absenceAResponse.data;
            const icon = absenceA ? WarningIcon : null;

            return {
              ...module,
              absences: absenceCount,
              icon,
            };
          })
        );

        const utilities = {
          id: 'utilities',
          title: 'Modules',
          type: 'group',
          children: moduleAbsences.map((module) => ({
            id: module.moduleId.toString(),
            title: <IconWithText icon={module.icon} text={`${module.moduleName} (${module.absences})`} />,
            type: 'item',
            url: `${module.moduleName}/${module.level.levelId.toString()}`,
          })),
        };

        setMenuItems((prevItems) => [...prevItems, utilities]);
      } catch (error) {
        console.error('Erreur lors de la récupération des modules:', error);
      }
    };

    fetchData();
  }, []);

  const navItems = menuItems.flatMap((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Erreur dans les éléments de menu
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;






// import React, { useEffect, useState } from 'react';
// import { Typography } from '@mui/material';
// import NavGroup from './NavGroup';
// import { IconDashboard } from '@tabler/icons-react';
//
// const icons = { IconDashboard };
//
// const MenuList = () => {
//   const [menuItems, setMenuItems] = useState([{
//     id: 'dashboard',
//     title: 'Dashboard',
//     type: 'group',
//     children: [
//       {
//         id: 'default',
//         title: 'Dashboard',
//         type: 'item',
//         url: '/dashboard/default',
//         icon: icons.IconDashboard,
//         breadcrumbs: false
//       }
//     ]
//   }]);
//
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('`${process.env.REACT_APP_SPRING_BASE_URL}/api/modules/professor/57');
//         const data = await response.json();
//
//         const utilities = {
//           id: 'utilities',
//           title: 'Modules',
//           type: 'group',
//           children: data.map(module => ({
//             id: module.moduleId.toString(),
//             title: module.moduleName,
//             type: 'item',
//             url: `${module.moduleName}/${module.level.levelId.toString()}`,
//           }))
//         };
//
//         // Mise à jour de l'état avec les nouveaux éléments de menu
//         setMenuItems(prevItems => [...prevItems, utilities]);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des modules:', error);
//       }
//     };
//
//     fetchData();
//   }, []);
//
//   // Génération des éléments de navigation
//   const navItems = menuItems.flatMap(item => {
//     switch (item.type) {
//       case 'group':
//         return <NavGroup key={item.id} item={item} />;
//       default:
//         return (
//             <Typography key={item.id} variant="h6" color="error" align="center">
//               Erreur dans les éléments de menu
//             </Typography>
//         );
//     }
//   });
//
//   return <>{navItems}</>;
// };
//
// export default MenuList;
