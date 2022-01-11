import React, { useState, useEffect, useContext } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Link, useHistory, useParams } from "react-router-dom";


const AutoLogin = (props) => {

  let history= useHistory()

 let params = {
    "auto_login_token": "adhsdhkasjdaksjdhaskjdhkjsad"
  }

  const autologin = useStoreActions((actions) => actions.autoLogin.autologin);
  const isLogin = useStoreState((state) => state.auth.isLogin);
  const isLoading = useStoreState((state) => state.common.isLoading);
  const response = useStoreState((state) => state.autoLogin.response);

  console.log("main response",response)

  useEffect(() => {
    autologin(params)
  }, [])

  return (
    <React.Fragment>
      <h1>Welcome to AutoLogin Page</h1>
    </React.Fragment>
  );
};

export default AutoLogin;
