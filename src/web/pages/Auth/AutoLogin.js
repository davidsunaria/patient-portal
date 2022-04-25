import React, { useState, useEffect, useContext } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Link, useHistory, useParams } from "react-router-dom";


const AutoLogin = (props) => {
  const { token } = useParams();
  const autoLogin = useStoreActions((actions) => actions.autoLogin.autoLogin);
  const response = useStoreState((state) => state.autoLogin.response);
  const [title, setTitle] = useState("");
  const history = useHistory();
  useEffect(async () => {
    let params = {
      auto_login_token: token
    }
    await autoLogin(params)
  }, [])

  useEffect(() => {
    if (response) {
      let { accountInfo } = response;

      if (accountInfo) {
        setTitle(accountInfo.name);
      }
    }
  }, [response]);

  useEffect(() => {
    if (title) {
      document.title = (title) ? title : "Patient Portal";
      history.push("/dashboard");
    }
  }, [title]);

  return (
    <React.Fragment>
      <h1>Please wait we are logging you in...</h1>
    </React.Fragment>
  );
};

export default AutoLogin;
