import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import { LanguageContext } from "patient-portal-context/LanguageContext.js";
import DCCLOGO from "patient-portal-images/dcc-logo.svg";

import EMAIL_IMAGE from "patient-portal-images/phone-email.svg";
import PASSWORD_IMAGE from "patient-portal-images/password.svg";

import { Formik, ErrorMessage } from "formik";
import { Spinner } from 'react-bootstrap';
import { useAuthValidation } from "patient-portal-utils/validations/auth/AuthSchema";


const Login = (props) => {
  const history = useHistory();
  const [formData, setFormData] = useState({ user_name: '', password: '' });
  const { labelData } = useContext(LanguageContext);
  const login = useStoreActions((actions) => actions.auth.login);
  const isLogin = useStoreState((state) => state.auth.isLogin);
  const isLoading = useStoreState((state) => state.common.isLoading);
  const { LoginSchema } = useAuthValidation();


  const signIn = async (values) => {
    await login(values);
  }
  useEffect(() => {
    if (isLogin) {
      history.push("/dashboard");
    }
  }, [isLogin])

  return (
    <React.Fragment>


      <div className="loginOuter">
        <div className="loginBox">
          <div className="loginLogo"><img src={DCCLOGO} /></div>
          <div className="loginTitle"> Welcome Back!</div>
          <div className="loginIntro">If you are an existing client, Please sign in below. If you are new to our practice, Please complete signup to activate your account.</div>

          <Formik
            enableReinitialize={true}
            initialValues={formData}
            onSubmit={async values => {
              //setFormData(JSON.stringify(values, null, 2))
              signIn(values);
            }}
            validationSchema={LoginSchema}
          >
            {props => {
              const {
                values,
                touched,
                errors,
                dirty,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit,
                handleReset
              } = props;
              return (
                <form onSubmit={handleSubmit}>

                  <div className="loginFieldGroup">
                    <label>Email or Phone</label>
                    <div className={
                      errors.user_name && touched.user_name
                        ? "loginField error"
                        : "loginField"
                    }>
                      <img src={EMAIL_IMAGE} />
                      <input
                        placeholder="Enter email or phone"
                        id="user_name"
                        name="user_name"
                        type="text"
                        value={values.user_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    autoComplete="off"
                      />


                    </div>
                    <ErrorMessage name="user_name" component="span" className="errorMsg" />
                  </div>
                  <div className="loginFieldGroup">
                    <label>Password

                          <Link className="change-password" to="/forgot-password">Forgot Password</Link>

                    </label>
                    <div className={
                      errors.password && touched.password
                        ? "loginField error"
                        : "loginField"
                    }>
                      <img src={PASSWORD_IMAGE} />
                      <input
                        placeholder="Enter your password"
                        id="password"
                        name="password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="off"
                      />

                    </div>
                    <ErrorMessage name="password" component="span" className="errorMsg" />
                  </div>
                  <button type="submit" disabled={isLoading} className="loginBtn">Log In</button>


                  <div className="alreadyAccount">
                    <p> Don't have an account?</p>
                    <Link to="/register">Sign Up</Link>
                  </div>


                </form>
              );
            }}
          </Formik>

        </div>
      </div>

    </React.Fragment>
  );
};

export default Login;
