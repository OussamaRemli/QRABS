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


// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
    id: 'utilities',
    title: 'Modules',
    type: 'group',
    children: []
};

// Fetch data from the endpoint
fetch('http://localhost:8080/api/modules/professor/1')
    .then(response => response.json())
    .then(data => {
        data.forEach(module => {
            utilities.children.push({
                id: module.moduleId.toString(), // Assuming moduleId is unique
                title: module.moduleName,
                type: 'item',
                url: `/utils/${encodeURIComponent(module.intituleModule)}`,
            });
        });
    })
    .catch(error => {
        console.error('Error fetching utilities:', error);
    });

export default utilities;
