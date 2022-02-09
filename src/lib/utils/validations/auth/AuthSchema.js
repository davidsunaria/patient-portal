import { useContext, useMemo } from "react";
import { LanguageContext } from "patient-portal-context/LanguageContext.js";
import * as Yup from "yup";
import { USER_NAME_REQUIRED, CONFIRM_PASSWORD_REQUIRED, PASSWORD_REQUIRED, OTP_REQUIRED, EMAIL_REQUIRED, CONFIRM_PASSWORD_MATCH, PHONE_REQUIRED, REENTER_PASSWORD, FIRSTNAME_REQUIRED, LASTNAME_REQUIRED } from "patient-portal-message";

const useAuthValidation = (props) => {
  const { labelData } = useContext(LanguageContext);

  const LoginSchema = useMemo(() => Yup.object({
    user_name: Yup
      .string()
      .required(USER_NAME_REQUIRED),

    password: Yup
      .string()
      .required(PASSWORD_REQUIRED),
  }), [labelData]);

  const VerifyOtpSchema = useMemo(() => Yup.object({
    otp: Yup
      .string()
      .required(OTP_REQUIRED),//labelData.frontLabels.welcome_back
  }), [labelData]);

  const SignupSchema = useMemo(() => Yup.object({
    firstname: Yup
      .string()
      .required(FIRSTNAME_REQUIRED),
    lastname: Yup
      .string()
      .required(LASTNAME_REQUIRED),
    email: Yup
      .string()
      .email()
      .required(EMAIL_REQUIRED),
    password: Yup
      .string()
      .required(PASSWORD_REQUIRED),
    term_and_conditions: Yup.bool().oneOf([true], 'You must agree to terms & conditions'),
    privacy_policy: Yup.bool().oneOf([true], 'You must agree to privacy policy'),
    password_confirmation: Yup
      .string()
      .required(CONFIRM_PASSWORD_REQUIRED)
      .oneOf([Yup.ref('password'), null], CONFIRM_PASSWORD_MATCH)
  }), [labelData]);

  const ForgotPasswordSchema = useMemo(() => Yup.object({
    phone: Yup
      .string()
      .required(PHONE_REQUIRED),
  }), [labelData]);

  const RegisterSchema = useMemo(() => Yup.object({
    phone: Yup
      .string()
      .required(PHONE_REQUIRED),
  }), [labelData]);

  const ResetPasswordSchema = useMemo(() => Yup.object({

    password: Yup
      .string()
      .required(PASSWORD_REQUIRED),
    password_confirmation: Yup
      .string()
      .required(REENTER_PASSWORD)
      .oneOf([Yup.ref('password'), null], CONFIRM_PASSWORD_MATCH)
  }), [labelData]);

  return { LoginSchema, VerifyOtpSchema, SignupSchema, ForgotPasswordSchema, RegisterSchema, ResetPasswordSchema };
}

export { useAuthValidation };