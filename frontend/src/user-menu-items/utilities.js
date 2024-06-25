
// const tokenParts = token.split('.');
// const tokenPayload = JSON.parse(atob(tokenParts[1]));
// const professorId = parseInt(tokenPayload.id, 10);

// const utilities = {
//     id: 'utilities',
//     title: 'Modules',
//     type: 'group',
//     children: []
// };

// // Fetch data from the endpoint using the extracted professor ID
// fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/modules/professor/${professorId}`)
//     .then(response => response.json())
//     .then(data => {
//         data.forEach(module => {
//             utilities.children.push({
//                 id: module.moduleId.toString(), // Assuming moduleId is unique
//                 title: module.moduleName,
//                 type: 'item',
//                 url: `/utils/${encodeURIComponent(module.intituleModule)}`,
//             });
//         });
//     })
//     .catch(error => {
//         console.error('Error fetching utilities:', error);
//     });

// export default utilities;

// const utilities = {
//     id: 'utilities',
//     title: 'Modules',
//     type: 'group',
//     children: []
// };
//
// // Fetch data from the endpoint
// fetch('`${process.env.REACT_APP_SPRING_BASE_URL}/api/modules/professor/75')
//     .then(response => response.json())
//     .then(data => {
//         data.forEach(module => {
//             utilities.children.push({
//                 id: module.moduleId.toString(), // Assuming moduleId is unique
//                 title: module.moduleName,
//                 type: 'item',
//                 url: `/utils/${encodeURIComponent(module.intituleModule)}`,
//             });
//         });
//     })
//     .catch(error => {
//         console.error('Error fetching utilities:', error);
//     });
//
// export default utilities;
