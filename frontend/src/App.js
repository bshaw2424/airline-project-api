import "./App.css";

import NavRoot from "./components/NavRoot";
import Home from "./components/Home/Home";
import About from "./components/Static/About";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import SavedDestinations from "./components/SavedDestinations";
import SavedAirlines from "./components/SavedAirlines";
import Dashboard from "./components/Dashboard";
import Collections from "./components/Collections";
import CollectionDetails from "./components/CollectionDetails";

import { destinationIndexLoader } from "./components/AirlinesLanding";
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
      <Route index element={<Home />} loader={destinationIndexLoader} />

      <Route path="about" element={<About />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* Airline pages */}
      <Route
        path="airlines"
        element={<AirlineLanding />}
        loader={destinationIndexLoader}
      />

      <Route
        path="airlines/search"
        element={<AirlineSearch />}
        loader={destinationIndexLoader}
      />

      <Route
        path="airlines/:slug"
        element={<AirlinePage />}
        loader={destinationIndexLoader}
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
        loader={destinationIndexLoader}
      />

      <Route
        path="saved-airlines"
        element={<SavedAirlines />}
        loader={destinationIndexLoader}
      />

      {/* Collections */}
      <Route
        path="collections"
        element={<Collections />}
        loader={destinationIndexLoader}
      />

      <Route
        path="collections/:id"
        element={<CollectionDetails />}
        loader={destinationIndexLoader}
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
