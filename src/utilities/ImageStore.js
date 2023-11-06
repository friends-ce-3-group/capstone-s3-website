import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import CakeIcon from '@mui/icons-material/Cake';
import CelebrationIcon from '@mui/icons-material/Celebration';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AppsIcon from '@mui/icons-material/Apps';

//Categories
// Farewell
// Birthday
// Wedding
// Welcome
// Anniversary
export function Categories() {
  return [
    { label: "All",  key: 1, icon: <AppsIcon />},
    { label: "Birthday",  key: 2, icon: <CakeIcon />},
    { label: "Farewell",  key: 3, icon: <FlightTakeoffIcon /> },
    { label: "Anniversary", key: 4, icon: <CelebrationIcon /> },
    { label: "Wedding",   key: 5, icon: <PeopleOutlineIcon /> },
    { label: "Upload",   key: 6, icon: <FileUploadIcon /> }
  ];  
}

export function ImageStore() {
  let imageStore = [
    {
      "key": "farewell1", 
      "category": "Farewell",
      "path": "farewell1.jpg",
      "backgroundColor": "#002744"
    },
    {
      "key": "birthday1", 
      "category": "Birthday",
      "path": "birthday1.jpg",
      "backgroundColor": "#ffffff"
    },
    {
      "key": "wedding1", 
      "category": "Wedding",
      "path": "wedding1.jpg",
      "backgroundColor": "#FFFFFF"
    },
    {
      "key": "anniversary1", 
      "category": "Anniversary",
      "path": "anniversary1.jpg",
      "backgroundColor": "#FFFFFF"
    },
  ];

  return imageStore;
}

