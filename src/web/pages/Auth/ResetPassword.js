import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Input from "patient-portal-components/Input/Input.js";
import Button from "patient-portal-components/Button/Button.js";
import { useStoreActions, useStoreState } from "easy-peasy";
import { } from "patient-portal-message";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DCCLOGO from "patient-portal-images/dcc-logo.svg";


import { LanguageContext } from "patient-portal-context/LanguageContext.js";
import { Formik, ErrorMessage } from "formik";
import { useAuthValidation } from "patient-portal-utils/validations/auth/AuthSchema";
import PASSWORD_IMAGE from "patient-portal-images/password.svg";
import { getTempData } from "patient-portal-utils/Service";
import { Spinner } from 'react-bootstrap';

const ResetPassword = (props) => {
  const history = useHistory();
  const { ResetPasswordSchema } = useAuthValidation();
  const { labelData } = useContext(LanguageContext);
  const resetPassword = useStoreActions((actions) => actions.auth.resetPassword);
  const isPasswordReset = useStoreState((state) => state.auth.isPasswordReset);
  const isLoading = useStoreState((state) => state.common.isLoading);
  const [formData, setFormData] = useState({
    code: '',
    phone: '',
    password: '',
    password_confirmation: ''
  });
  const resetPass = async (payload) => {
    let tempData = getTempData();
    let formData = {
      code: tempData.code,
      phone: tempData.phone,
      password: payload.password,
      password_confirmation: payload.password_confirmation,
    }
    console.log(formData);
    await resetPassword(formData);
  }
  useEffect(() => {
    if (isPasswordReset) {
      history.push("/login");
    }
  }, [isPasswordReset]);
  return (
    <React.Fragment>
      <div className="loginOuter">
        <div className="loginBox">
          <div className="loginLogo"><img src={DCCLOGO} /></div>
          <div className="loginTitle">Forgot Password</div>
          <div className="loginIntro">Re-create your password</div>
          <Formik
            enableReinitialize={true}
            initialValues={formData}
            onSubmit={async values => {
              resetPass(values);
            }}
            validationSchema={ResetPasswordSchema}
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
 {/* {JSON.stringify(errors)} */}
                  <div className="loginFieldGroup">
                    <label>Create New Password</label>
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
                    <label>Re-Enter New Password</label>
                    <div className={
                      errors.password_confirmation && touched.password_confirmation
                        ? "loginField error"
                        : "loginField"
                    }>
                      <img src={PASSWORD_IMAGE} />
                      <input
                        placeholder="Re-enter new password"
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
                  <button type="submit" disabled={isLoading} className="loginBtn">{isLoading && <Spinner animation="border" size="sm" />}
                    {(isLoading) ? 'Processing' : 'Submit'}</button>

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

export default ResetPassword;
