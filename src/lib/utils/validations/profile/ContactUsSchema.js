import { useContext, useMemo } from "react";
import { LanguageContext } from "patient-portal-context/LanguageContext.js";
import * as Yup from "yup";
import { TITLE_REQUIRED, BODY_REQUIRED } from "patient-portal-message";
const defaultStr = Yup.string().default("");

const useConactUsValidation = (props) => {
  const { labelData } = useContext(LanguageContext);
  const ContactUsSchema = useMemo(() => Yup.object({

    title: Yup.object({
      value: defaultStr.required(TITLE_REQUIRED),
      label: defaultStr.required(TITLE_REQUIRED)
    }),
    body: Yup
      .string()
      .required(BODY_REQUIRED)
  }), [labelData]);

  return { ContactUsSchema };
}

export { useConactUsValidation };