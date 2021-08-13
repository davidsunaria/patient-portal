import { useContext, useMemo } from "react";
import { LanguageContext } from "patient-portal-context/LanguageContext.js";
import * as Yup from "yup";

const useProfileValidation = (props) => {
  const { labelData } = useContext(LanguageContext);
  const ProfileSchema = useMemo(() => Yup.object({
    firstname: Yup
      .string()
      .required("Please enter first name"),
    lastname: Yup
      .string()
      .required("Please enter last name"),
    email: Yup
      .string()
      .email()
      .required("Please enter email"),
      email_2: Yup
      .string()
      .email()
      .nullable().notRequired(),
    gender: Yup
      .string()
      .required("Please select gender")
  }), [labelData]);

  return { ProfileSchema };
}

export { useProfileValidation };