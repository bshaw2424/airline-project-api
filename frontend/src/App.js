import "./App.css";
import NavRoot from "./components/NavRoot";
import Home from "./components/Home/Home";
import About from "./components/Static/About";

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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<NavRoot />}>
      <Route index element={<Home />} loader={destinationIndexLoader} />
      <Route path="about" element={<About />} />
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
        path="airlines/:slug/destinations"
        element={<Destinations />}
        loader={destinationsLoader}
      />

      <Route path="*" element={<ErrorPage />} />
    </Route>,
  ),
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
