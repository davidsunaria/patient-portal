import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import DCCLOGO from "patient-portal-images/dcc-logo.svg";
import MOBILE_IMAGE from "patient-portal-images/phone.svg";

import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import { LanguageContext } from "patient-portal-context/LanguageContext.js";
import { Formik, ErrorMessage } from "formik";
import { useAuthValidation } from "patient-portal-utils/validations/auth/AuthSchema";
import { Spinner } from 'react-bootstrap';

const Signup = (props) => {
  const history = useHistory();
  const {RegisterSchema} = useAuthValidation();
  const isLoading = useStoreState((state) => state.common.isLoading);
  const sendOTP = useStoreActions((actions) => actions.auth.sendOTP);
  const sendOtpForLogin = useStoreActions((actions) => actions.auth.sendOtpForLogin);
  const isOtpSend = useStoreState((state) => state.auth.isOtpSend);
  const loginWithOtp = useStoreState((state) => state.auth.loginWithOtp);
  const setLoginWithOtp = useStoreActions((actions) => actions.auth.setLoginWithOtp);

  const { labelData } = useContext(LanguageContext);
  const [phone, setPhone] = useState({ iso2: '', dialCode: '', phone: '' });
 
 
  const sendOtp = async (payload) => {
    let formData = {
      code: `+${payload.dialCode}`,
      phone: payload.phone
    }
    if(loginWithOtp ){
      await sendOtpForLogin(formData);
    }
    else{
      await sendOTP(formData);
    }
  }

  const signInPage= () =>{
    setLoginWithOtp(false)
    history.push("/login");
  }
  
  console.log("send",loginWithOtp)

  useEffect(() => {
    if (isOtpSend) {
      history.push("/verify-otp");
    }
  }, [isOtpSend])

  return (
    <React.Fragment>
      <div className="loginOuter">
        <div className="loginBox">
          <div className="loginLogo"><img src={DCCLOGO} /></div>
          <div className="loginTitle mb-2">Welcome Back!</div>
          {
            loginWithOtp ? <p className="loginTitleInfo mb-4">Please enter your mobile number to continue with us</p>:
            <p className="loginTitleInfo mb-4">If you are new client, Please fill your details below to complete signup to activate your account.</p>
          }
         
          <Formik
            enableReinitialize={true}
            initialValues={phone}
            onSubmit={async values => {
              sendOtp(values);
            }}
            validationSchema={RegisterSchema}
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
                  <div className="loginFieldGroup loginTelInput">
                    <label>Phone Number</label>
                    <div className={
                      errors.phone && touched.phone
                        ? "loginField error"
                        : "loginField"
                    }>
                      <img src={MOBILE_IMAGE} />
                      <IntlTelInput
                            preferredCountries={['IN']}
                              css={ ['intl-tel-input'] }
                              defaultValue={`${phone.phone}`}
                              fieldName='phone'
                              separateDialCode={`true`}
                              autoComplete={`phone`}
                              onPhoneNumberChange={(isValidNumber,phone, payload, fullNumber) => {
                                let input  = {...phone};
                                input = { iso2: payload.iso2, dialCode: payload.dialCode, phone: phone };
                                setPhone(input);
                              }}
                              onSelectFlag={(inputFieled,phone, payload, isValidNumber) => {
                                let input  = {...phone};
                                input = { iso2: phone.iso2, dialCode: phone.dialCode, phone: inputFieled };
                                setPhone(input);
                              }}
                              autoPlaceholder={false}
                            /> 
                    </div>
                    {errors.phone && <span className="errorMsg">{errors.phone}</span>}
                  </div>
                  <button type="submit" disabled={isLoading} className="loginBtn">Send OTP</button>

                  <div className="alreadyAccount">
                    <p>Already have an account?</p>
                     <p onClick={()=>signInPage()} disabled={isLoading} className="signIn">Sign In</p> 
                    {/* <Link to="/login">Sign In</Link> */}
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

export default Signup;
