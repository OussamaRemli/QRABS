import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import NavGroup from './NavGroup';
import { IconDashboard } from '@tabler/icons-react';

const icons = { IconDashboard };

const MenuList = () => {
  const [menuItems, setMenuItems] = useState([{
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard/default',
        icon: icons.IconDashboard,
        breadcrumbs: false
      }
    ]
  }]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Appel API pour obtenir les modules
        const response = await fetch('http://localhost:8080/api/modules/professor/17');
        const data = await response.json();

        // Création de l'objet utilities avec les données reçues
        const utilities = {
          id: 'utilities',
          title: 'Modules',
          type: 'group',
          children: data.map(module => ({
            id: module.moduleId.toString(),
            title: module.moduleName,
            type: 'item',
            url: `${module.moduleName}/${module.level.levelId.toString()}`,
          }))
        };

        // Mise à jour de l'état avec les nouveaux éléments de menu
        setMenuItems(prevItems => [...prevItems, utilities]);
      } catch (error) {
        console.error('Erreur lors de la récupération des modules:', error);
      }
    };

    // Appel de la fonction fetchData
    fetchData();
  }, []); // Le tableau de dépendances vide signifie que l'effet s'exécutera une seule fois

  // Génération des éléments de navigation
  const navItems = menuItems.flatMap(item => {
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
