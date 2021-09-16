import { useContext, useMemo } from "react";
import { LanguageContext } from "patient-portal-context/LanguageContext.js";
import * as Yup from "yup";
import { TITLE_REQUIRED, BODY_REQUIRED } from "patient-portal-message";

const useConactUsValidation = (props) => {
  const { labelData } = useContext(LanguageContext);
  const ContactUsSchema = useMemo(() => Yup.object({
    title: Yup
      .string()
      .required(TITLE_REQUIRED),
    body: Yup
      .string()
      .required(BODY_REQUIRED)
  }), [labelData]);

  return { ContactUsSchema };
}

export { useConactUsValidation };