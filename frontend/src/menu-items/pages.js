// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'Departements',
  title: 'Départements',
  type: 'group',
  children: [
    {
      id: 'Départements',
      title: 'Départements',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'MMA',
          title: 'MMA',
          type: 'item',
          url: '/departements/MMA',
          // target: true
          breadcrumbs: false
        },
        {
          id: 'EIT',
          title: 'EIT',
          type: 'item',
          url: '/departements/EIT',
          // target: true
          breadcrumbs: false
        },
        {
          id: 'LC',
          title: 'LC',
          type: 'item',
          url: '/departements/LC',
          // target: true
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default pages;
