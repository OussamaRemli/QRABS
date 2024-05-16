// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill,IconPencil,IconSchool } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconPencil,
  IconSchool
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'filieres',
  title: 'filieres',
  type: 'group',
  children: [
    {
      id: 'gi',
      title: 'GI',
      type: 'collapse',
      icon: icons.IconSchool,
      children: [
        {
          id: 'gi3',
          title: 'GI3',
          type: 'item',
          url: '/filieres/gi/gi3',
          breadcrumbs: false
        },
        {
          id: 'gi4',
          title: 'GI4',
          type: 'item',
          url: '/filieres/gi/gi4',
          breadcrumbs: false
        },
        {
          id: 'gi5',
          title: 'GI5',
          type: 'item',
          url: '/filieres/gi/gi5',
          breadcrumbs: false
        }
        
      ]
    },
    {
      id: 'gseir',
      title: 'GSEIR',
      type: 'collapse',
      icon: icons.IconSchool,
      children: [
        {
          id: 'gseir3',
          title: 'GSEIR3',
          type: 'item',
          url: '/filieres/gseir/gseir3',
          breadcrumbs: false
        },
        {
          id: 'gseir4',
          title: 'GSEIR4',
          type: 'item',
          url: '/filieres/gseir/gseir4',
          breadcrumbs: false
        },
        {
          id: 'gseir5',
          title: 'GSEIR5',
          type: 'item',
          url: '/filieres/gseir/gseir5',
          breadcrumbs: false
        }
        
      ]
    },
    {
      id: 'gc',
      title: 'GC',
      type: 'collapse',
      icon: icons.IconSchool,
      children: [
        {
          id: 'gc3',
          title: 'GC3',
          type: 'item',
          url: '/filieres/gc/gc3',
          breadcrumbs: false
        },
        {
          id: 'gc4',
          title: 'GC4',
          type: 'item',
          url: '/filieres/gc/gc4',
          breadcrumbs: false
        },
        {
          id: 'gc5',
          title: 'GC5',
          type: 'item',
          url: '/filieres/gc/gc5',
          breadcrumbs: false
        }
        
      ]
    },
    {
      id: 'dscc',
      title: 'DSCC',
      type: 'collapse',
      icon: icons.IconSchool,
      children: [
        {
          id: 'dscc3',
          title: 'DSCC3',
          type: 'item',
          url: '/filieres/dscc/dscc3',
          breadcrumbs: false
        },
        {
          id: 'dscc4',
          title: 'DSCC4',
          type: 'item',
          url: '/filieres/dscc/dscc4',
          breadcrumbs: false
        },
        {
          id: 'dscc5',
          title: 'DSCC5',
          type: 'item',
          url: '/filieres/dscc/dscc5',
          breadcrumbs: false
        }
        
      ]
    }
    
  ]
};

export default utilities;
