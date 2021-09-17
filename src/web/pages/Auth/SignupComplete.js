import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import DCCLOGO from "patient-portal-images/dcc-logo.svg";
import { LanguageContext } from "patient-portal-context/LanguageContext.js";
import { Formik, ErrorMessage } from "formik";
import { useAuthValidation } from "patient-portal-utils/validations/auth/AuthSchema";
import EMAIL_IMAGE from "patient-portal-images/email.svg";
import PASSWORD_IMAGE from "patient-portal-images/password.svg";
import { getTempData } from "patient-portal-utils/Service";
import { Spinner } from 'react-bootstrap';

const SignupComplete = (props) => {
  const [title, setTitle] = useState("");
  const history = useHistory();
  const signUp = useStoreActions((actions) => actions.auth.signUp);
  const isSignupCompleted = useStoreState((state) => state.auth.isSignupCompleted);
  const isLoading = useStoreState((state) => state.common.isLoading);
  const response = useStoreState((state) => state.auth.response);
  const { SignupSchema } = useAuthValidation();
  const { labelData } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    code: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
    device_token:  new Buffer(window.navigator.userAgent).toString('base64')
  });

  const createUser = async (payload) => {
    let tempData = getTempData();
    let formData = {
      code: tempData.code,
      phone: tempData.phone,
      email: payload.email,
      password: payload.password,
      password_confirmation: payload.password_confirmation,
    }
    await signUp(formData);
  }

  // useEffect(() => {
  //   if (isSignupCompleted) {
  //     history.push("/dashboard");
  //   }
  // }, [isSignupCompleted])

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
      <div className="loginOuter">
        <div className="loginBox">
          <div className="loginLogo"><img src={DCCLOGO} /></div>
          <div className="loginTitle mb-2">Welcome Back!</div>
          <p className="loginTitleInfo mb-4">Create credentials to activate your DCC login account.</p>
          <Formik
            enableReinitialize={true}
            initialValues={formData}
            onSubmit={async values => {
              //setFormData(JSON.stringify(values, null, 2))
              createUser(values);
            }}
            validationSchema={SignupSchema}
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
                    <label>Email Address</label>
                    <div className={
                      errors.email && touched.email
                        ? "loginField error"
                        : "loginField"
                    }>
                      <img src={EMAIL_IMAGE} />
                      <input
                        placeholder="Email Address"
                        id="email"
                        name="email"
                        type="text"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="off"
                      />
                    </div>
                    <ErrorMessage name="email" component="span" className="errorMsg" />
                  </div>

                  <div className="loginFieldGroup">
                    <label>Create Password</label>
                    <div className={
                      errors.password && touched.password
                        ? "loginField error"
                        : "loginField"
                    }>
                      <img src={PASSWORD_IMAGE} />
                      <input
                        placeholder="Enter new password"
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

                  <div className="loginFieldGroup">
                    <label>Confirm Password</label>
                    <div className={
                      errors.password_confirmation && touched.password_confirmation
                        ? "loginField error"
                        : "loginField"
                    }>
                      <img src={PASSWORD_IMAGE} />
                      <input
                        placeholder="Confirm new password"
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        value={values.password_confirmation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="off"
                      />
                    </div>
                    <ErrorMessage name="password_confirmation" component="span" className="errorMsg" />
                  </div>


                  <button disabled={isLoading} className="loginBtn">{isLoading && <Spinner animation="border" size="sm" />}
                    {(isLoading) ? 'Processing' : 'Log In'}</button>
                  <div className="alreadyAccount">
                    <p>Already have an account?</p>
                    <Link to="/login">Sign In</Link>
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

export default SignupComplete;
