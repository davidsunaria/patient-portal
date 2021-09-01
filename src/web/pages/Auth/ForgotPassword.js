import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import { } from "patient-portal-message";
import DCCLOGO from "patient-portal-images/dcc-logo.svg";
import MOBILE_IMAGE from "patient-portal-images/phone.svg";

import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import { LanguageContext } from "patient-portal-context/LanguageContext.js";
import { Formik, ErrorMessage } from "formik";
import { useAuthValidation } from "patient-portal-utils/validations/auth/AuthSchema";
import { Spinner } from 'react-bootstrap';

const ForgotPassword = (props) => {
  const history = useHistory();
  const { ForgotPasswordSchema } = useAuthValidation();
  const sendForgotPasswordOTP = useStoreActions((actions) => actions.auth.sendForgotPasswordOTP);
  const isOtpSend = useStoreState((state) => state.auth.isOtpSend);
  const isLoading = useStoreState((state) => state.common.isLoading);
  const { labelData } = useContext(LanguageContext);
  const [phone, setPhone] = useState({ iso2: '', dialCode: '', phone: '' });

  const sendOtp = async (payload) => {
    let formData = {
      code: `+${payload.dialCode}`,
      phone: payload.phone
    }
    await sendForgotPasswordOTP(formData);
  }


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
          <p className="loginTitleInfo mb-4">If you are an existing client, and forgot your password. Please enter phone number associated with your account</p>
          <Formik
            enableReinitialize={true}
            initialValues={phone}
            onSubmit={async values => {
              sendOtp(values);
            }}
            validationSchema={ForgotPasswordSchema}
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
                        css={['intl-tel-input']}
                        defaultValue={`${phone.phone}`}
                        fieldName='phone'
                        separateDialCode={`true`}
                        autoComplete={`phone`}
                        onPhoneNumberChange={(isValidNumber, phone, payload, fullNumber) => {
                          let input = { ...phone };
                          input = { iso2: payload.iso2, dialCode: payload.dialCode, phone: phone };
                          setPhone(input);
                        }}
                        onSelectFlag={(inputFieled, phone, payload, isValidNumber) => {
                          let input = { ...phone };
                          input = { iso2: phone.iso2, dialCode: phone.dialCode, phone: inputFieled };
                          setPhone(input);
                        }}
                        autoPlaceholder={true}
                      />

                      {/* <ReactIntlTelInput
                        inputProps={inputProps}
                        intlTelOpts={intlTelOpts}
                        value={phone}
                        onChange={onChange}
                        onReady={onReady}
                      /> */}
                    </div>
                    {errors.phone && <span className="errorMsg">{errors.phone}</span>}
                  </div>

                  <button disabled={isLoading} type="submit" className="loginBtn">Send OTP</button>

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

export default ForgotPassword;
