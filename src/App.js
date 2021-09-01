import React from "react";

import { Switch, Route } from "react-router-dom";
import World from "./pages/world/World";
import Country from "./pages/country/Country";
import Vaccine from "./pages/vaccine/Vaccine";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./components/scrolltotop/ScrollToTop";

function App() {
  return (
    <div>
      <ScrollToTop></ScrollToTop>
      <Header></Header>
      <Switch>
        <Route exact path="/">
          <World></World>
        </Route>
        <Route path="/country">
          <Country></Country>
        </Route>
        <Route path="/vaccine">
          <Vaccine></Vaccine>
        </Route>
      </Switch>
      <Footer></Footer>
    </div>
  );
}

export default App;
