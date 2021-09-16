import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "patient-portal-routes";
import history from "patient-portal-history";
import "./index.scss";
import { getAccountData } from "patient-portal-utils/Service";

const App = () => {

  useEffect(() => {
    let data = getAccountData();
    document.title = (data?.name) ?  data?.name : "Patient Portal";
  }, []);

  return (
    <React.Fragment>
      <Router history={history}>
        <Routes />
      </Router>
    </React.Fragment>
  );
};

export default App;
