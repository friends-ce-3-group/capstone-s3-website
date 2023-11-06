import { CreateCard } from "./components/CreateCard";
import SignCard from "./components/SignCard";

const AppRoutes = [
  {
    path: '/',
    element: <CreateCard />
  },
  {
    path: '/create',
    element: <CreateCard />
  },
  {
    path: '/sign/:id',
    element: <SignCard />
  }
];

export default AppRoutes;
