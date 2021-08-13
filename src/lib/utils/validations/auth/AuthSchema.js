import { useContext, useMemo } from "react";
import { LanguageContext } from "patient-portal-context/LanguageContext.js";
import * as Yup from "yup";

const useAuthValidation = (props) => {
  const { labelData } = useContext(LanguageContext);

  const LoginSchema = useMemo(() => Yup.object({
    user_name: Yup
      .string()
      .required("Please enter email address or phone"),

    password: Yup
      .string()
      .required("Please enter password"),
  }), [labelData]);

  const VerifyOtpSchema = useMemo(() => Yup.object({
    otp: Yup
      .string()
      .required("Please enter OTP"),//labelData.frontLabels.welcome_back
  }), [labelData]);

  const SignupSchema = useMemo(() => Yup.object({
    email: Yup
      .string()
      .email()
      .required("Please enter email"),
    password: Yup
      .string()
      .required("Please enter password"),
    password_confirmation: Yup
      .string()
      .required("Please enter confirm password")
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
  }), [labelData]);

  const ForgotPasswordSchema = useMemo(() => Yup.object({
    phone: Yup
      .string()
      .required("Please enter phone number"),
  }), [labelData]);

  const RegisterSchema = useMemo(() => Yup.object({
    phone: Yup
      .string()
      .required("Please enter phone number"),
  }), [labelData]);

  const ResetPasswordSchema = useMemo(() => Yup.object({

    password: Yup
      .string()
      .required("Please enter password"),
    password_confirmation: Yup
      .string()
      .required("Please re-enter new password")
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
  }), [labelData]);

  return { LoginSchema, VerifyOtpSchema, SignupSchema, ForgotPasswordSchema, RegisterSchema, ResetPasswordSchema };
}

export { useAuthValidation };