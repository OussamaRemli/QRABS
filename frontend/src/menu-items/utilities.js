import { IconSchool } from '@tabler/icons-react';

// constant
const icons = {
  IconSchool
};

// Utility function to wrap icons with a background style
const withBackground = (IconComponent, bgColor) => (props) => (
  <div style={{ 
    backgroundColor: bgColor, 
    padding: '5px', 
    borderRadius: '50%',
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
    <IconComponent {...props} style={{ color: 'white' }} />
  </div>
);

// Function to generate a random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Fetch data from the API
async function fetchLevels() {
  const response = await fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/levels`);
  const data = await response.json();
  return data;
}

const data = await fetchLevels();

// Generate dynamic menu items for filieres
const filiereMenuItems = data.reduce((acc, item) => {
  const sectorPath = item.sectorName.toLowerCase();
  const filiereItem = {
    id: item.levelName.toLowerCase(),
    title: item.levelName,
    type: 'item',
    url: `/filieres/${sectorPath}/${item.levelName.toLowerCase()}`,
    breadcrumbs: false
  };

  // Check if sector item already exists
  const existingSectorItem = acc.find(menuItem => menuItem.id === sectorPath);
  if (existingSectorItem) {
    existingSectorItem.children.push(filiereItem);
  } else {
    acc.push({
      id: sectorPath,
      title: item.sectorName,
      type: 'collapse',
      icon: withBackground(icons.IconSchool, getRandomColor()),
      children: [filiereItem]
    });
  }

  return acc;
}, []);

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'filieres',
  title: 'Filières',
  type: 'group',
  children: filiereMenuItems
};

export default utilities;
