// assets
// import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons-react';

// // constant
// const icons = {
//   IconTypography,
//   IconPalette,
//   IconShadow,
//   IconWindmill
// };

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Modules',
  type: 'group',
  children: [
    {
      id: 'Réseaux_informatique',
      title: 'Réseaux informatique',
      type: 'item',
      url: '/utils/Réseaux_informatique'
      // icon: icons.IconTypography,
      // breadcrumbs: false
    },
    {
      id: 'Adminstration_système',
      title: 'Adminstration_système',
      type: 'item',
      url: '/utils/Adminstration_système'
      // icon: icons.IconPalette,
      // breadcrumbs: false
    },
    {
      id: 'Interconnexion_réseaux',
      title: 'Interconnexion réseaux',
      type: 'item',
      url: '/utils/Interconnexion_réseaux'
      // icon: icons.IconShadow,
      // breadcrumbs: false
    },
    {
      id: 'Sécurité_informatique',
      title: 'Sécurité informatique',
      type: 'item',
      url: '/utils/Sécurité_informatique'
      // icon: icons.IconWindmill
    }
  ]
};

export default utilities;
