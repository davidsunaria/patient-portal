import { useContext, useMemo } from "react";
import { LanguageContext } from "patient-portal-context/LanguageContext.js";
import * as Yup from "yup";
import { FIRST_NAME_REQUIRED, LAST_NAME_REQUIRED, EMAIL_REQUIRED, GENDER_REQUIRED } from "patient-portal-message";

const useProfileValidation = (props) => {
  const { labelData } = useContext(LanguageContext);
  const ProfileSchema = useMemo(() => Yup.object({
    firstname: Yup
      .string()
      .nullable()
      .required(FIRST_NAME_REQUIRED),
    lastname: Yup
      .string()
      .nullable()
      .required(LAST_NAME_REQUIRED),
    email: Yup
      .string()
      .email()
      .required(EMAIL_REQUIRED),
    email_2: Yup
      .string()
      .email()
      .nullable().notRequired(),
    gender: Yup
      .string()
      .nullable()
      .required(GENDER_REQUIRED)
  }), [labelData]);

  return { ProfileSchema };
}

export { useProfileValidation };