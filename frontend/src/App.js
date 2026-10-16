import "./App.css";

import NavRoot from "./components/NavRoot";
import Home, {
  destinationIndexLoader as homeLoader,
} from "./components/Home/Home";
import About from "./components/Static/About";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import SavedDestinations from "./components/SavedDestinations";
import SavedAirlines from "./components/SavedAirlines";
import Dashboard from "./components/Dashboard";
import Collections from "./components/Collections";
import CollectionDetails from "./components/CollectionDetails";

import { destinationIndexLoader as airlinesLoader } from "./components/AirlinesLanding";
import Destinations, { destinationsLoader } from "./components/Destinations";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import AirlineLanding from "./components/AirlinesLanding";
import AirlineSearch from "./components/AirlineSearch";
import ErrorPage from "./components/Error/ErrorPage";
import AirlinePage from "./components/Airline/AirlinePage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<NavRoot />}>
      {/* Public pages */}
      <Route index element={<Home />} loader={homeLoader} />

      <Route path="about" element={<About />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* Airline pages */}
      <Route
        path="airlines"
        element={<AirlineLanding />}
        loader={airlinesLoader}
      />

      <Route
        path="airlines/search"
        element={<AirlineSearch />}
        loader={airlinesLoader}
      />

      <Route
        path="airlines/:slug"
        element={<AirlinePage />}
        loader={airlinesLoader}
      />

      <Route
        path="airlines/:slug/destinations"
        element={<Destinations />}
        loader={destinationsLoader}
      />

      {/* Saved items */}
      <Route
        path="saved-destinations"
        element={<SavedDestinations />}
        loader={airlinesLoader}
      />

      <Route
        path="saved-airlines"
        element={<SavedAirlines />}
        loader={airlinesLoader}
      />

      {/* Collections */}
      <Route
        path="collections"
        element={<Collections />}
        loader={airlinesLoader}
      />

      <Route
        path="collections/:id"
        element={<CollectionDetails />}
        loader={airlinesLoader}
      />

      {/* Dashboard */}
      <Route path="dashboard" element={<Dashboard />} />

      {/* Not found */}
      <Route path="*" element={<ErrorPage />} />
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
