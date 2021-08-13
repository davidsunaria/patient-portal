import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "patient-portal-routes";
import history from "patient-portal-history";
import "./index.scss";

const App = () => {
  useEffect(() => {}, []);
  return (
    <React.Fragment>
      <Router history={history}>
        <Routes />
      </Router>
    </React.Fragment>
  );
};

export default App;
