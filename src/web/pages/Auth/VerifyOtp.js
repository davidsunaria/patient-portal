import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { LanguageContext } from "patient-portal-context/LanguageContext.js";
import { useStoreActions, useStoreState } from "easy-peasy";
import DCCLOGO from "patient-portal-images/dcc-logo.svg";
import OtpInput from 'react-otp-input';
import { useAuthValidation } from "patient-portal-utils/validations/auth/AuthSchema";
import { Formik, ErrorMessage } from "formik";
import { getTempData } from "patient-portal-utils/Service";
import FirebaseService from "../../../firebase/FirebaseService";



const VerifyOtp = (props) => {
  const history = useHistory();
  const { VerifyOtpSchema } = useAuthValidation();
  const verifyOtp = useStoreActions((actions) => actions.auth.verifyOtp);
  const sendOTP = useStoreActions((actions) => actions.auth.sendOTP);
  const sendForgotPasswordOTP = useStoreActions((actions) => actions.auth.sendForgotPasswordOTP);
  const isOtpVerified = useStoreState((state) => state.auth.isOtpVerified);
  const setLoginWithOtp = useStoreActions((actions) => actions.auth.setLoginWithOtp);
  const sendOtpForLogin = useStoreActions((actions) => actions.auth.sendOtpForLogin);
  const verifyLoginWithOtp = useStoreActions((actions) => actions.auth.verifyLoginWithOtp);
  const setIsOtpSend = useStoreActions((actions) => actions.auth.setIsOtpSend);
  const otpToken = useStoreState((state) => state.auth.otpToken);
  const response = useStoreState((state) => state.auth.response);
  const loginWithOtp = useStoreState((state) => state.auth.loginWithOtp);
  const { labelData } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    otp: "",
    code: '',
    phone: ''
  });

  const handleChangeVal = (otp) => {
    let tempData = getTempData();
    setFormData({
      otp: otp,
      code: tempData.code,
      phone: tempData.phone
    });
  };
  const verify = async (payload) => {
    let tempData = getTempData();
    if (tempData.type === "LoginWithOtp") {
      await verifyLoginWithOtp(payload)
    }
    else {
      await verifyOtp(payload);
    }

  }
  const resendOtp = async (payload) => {
    let tempData = getTempData();

    if (tempData.type === "forgot_password") {
      delete tempData.type;
      await sendForgotPasswordOTP(tempData);
    }
    if (tempData.type === "signup") {
      delete tempData.type;
      await sendOTP(tempData);
    }
    if (tempData.type === "LoginWithOtp") {
      delete tempData.type;
      await sendOtpForLogin(tempData);
    }
    //
  }
  useEffect(() => {
    //console.log("isOtpVerified",response)
    if (isOtpVerified) {
      let tempData = getTempData();
      if (tempData.type === "forgot_password") {
        history.push("/reset-password");
      }
      else if(otpToken){
        history.push("/dashboard");
        FirebaseService.logLogin("Web-OTP",response?.client)
      }
      else {
        history.push("/register-user");
      }
    }
  }, [isOtpVerified,otpToken])

  // useEffect(() => {
  //   if (loginWithOtp) {
  //     setLoginWithOtp(false)
  //   }
  // }, [])

  useEffect(() => {
    setIsOtpSend(false)
  }, [])


  return (
    <React.Fragment>

      <div className="loginOuter">
        <div className="loginBox">
          <div className="loginLogo"><img src={DCCLOGO} /></div>
          <div className="loginTitle mb-2">Welcome Back!</div>
          <p className="loginTitleInfo mb-4">OTP will be sent on your phone number. Please fill that OTP below to verify that is your phone number.</p>
          <Formik
            enableReinitialize={true}
            initialValues={formData}
            onSubmit={async values => {
              //setFormData(JSON.stringify(values, null, 2))
              verify(values);
            }}
            validationSchema={VerifyOtpSchema}
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
                  <div className="loginFieldGroup mb-4">
                    <div className="OTPFIeld">
                      <OtpInput
                        value={values.otp}
                        onChange={handleChangeVal}
                        numInputs={6}
                      />
                    </div>
                    <ErrorMessage name="otp" component="span" className="errorMsg" />
                  </div>
                  <button type="submit" className="button primary w-100 mb-2 w-100">Verify OTP</button>
                  <button type="button" className="button primary w-100" onClick={resendOtp}>Resend OTP</button>
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

export default VerifyOtp;
