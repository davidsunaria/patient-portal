import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import DCCLOGO from "patient-portal-images/dcc-logo.svg";
import { LanguageContext } from "patient-portal-context/LanguageContext.js";
import { Formik, ErrorMessage, Field } from "formik";
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
    firstname: '',
    lastname: '',
    code: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
    privacy_policy: false,
    term_and_conditions: false,
    device_token: new Buffer(window.navigator.userAgent).toString('base64')
  });

  const createUser = async (payload) => {
    let tempData = getTempData();
    let formData = {
      firstname: payload?.firstname,
      lastname: payload?.lastname,
      code: tempData.code,
      phone: tempData.phone,
      email: payload.email,
      privacy_policy: 1,
      term_and_conditions: 1,
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
      console.log(response)
      let { accountInfo, client } = response;
      if (accountInfo) {
        setTitle(accountInfo.name);
      }
      if (client) {
        setFormData({ ...formData, firstname: client?.firstname, lastname: client?.lastname, email: client?.email });
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
          <div className="loginLogo mb-2"><img src={DCCLOGO} /></div>
          <div className="loginTitle mb-2">Welcome Back!</div>
          <p className="loginTitleInfo mb-2">Create credentials to activate your DCC login account.</p>
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
                    <label>First name</label>
                    <div className={
                      errors.firstname && touched.firstname
                        ? "loginField error"
                        : "loginField"
                    }>
                      <input
                        placeholder="First name"
                        id="firstname"
                        name="firstname"
                        type="text"
                        value={values.firstname}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="off"
                      />
                    </div>
                    <ErrorMessage name="firstname" component="span" className="errorMsg" />
                  </div>

                  <div className="loginFieldGroup">
                    <label>Last name</label>
                    <div className={
                      errors.lastname && touched.lastname
                        ? "loginField error"
                        : "loginField"
                    }>
                      <input
                        placeholder="Last name"
                        id="lastname"
                        name="lastname"
                        type="text"
                        value={values.lastname}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="off"
                      />
                    </div>
                    <ErrorMessage name="lastname" component="span" className="errorMsg" />
                  </div>

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
                  <div className="loginFieldGroup termsCondition">
                    <input type="checkbox" name={`privacy_policy`} checked={values.privacy_policy} value={values.privacy_policy} onChange={handleChange} />I agree to the <a href={`${process.env.REACT_APP_PAGES_URL}privacy-policy`} target="_blank"> Privacy Policy</a>
                    <ErrorMessage name="privacy_policy" component="span" className="errorMsg" /></div>
                    {console.log(values.term_and_conditions)}
                  <div className="loginFieldGroup termsCondition">
                    <input type="checkbox" name={`term_and_conditions`} checked={values.term_and_conditions} value={values.term_and_conditions} onChange={handleChange} />I agree to the  <a href={`${process.env.REACT_APP_PAGES_URL}terms-and-conditions`} target="_blank" onChange={handleChange}>Terms & Conditions.</a>
                    <ErrorMessage name="term_and_conditions" component="span" className="errorMsg" /></div>
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
