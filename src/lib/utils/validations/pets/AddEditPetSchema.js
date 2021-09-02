import { useContext, useMemo } from "react";
import { LanguageContext } from "patient-portal-context/LanguageContext.js";
import * as Yup from "yup";
import { NAME_REQUIRED, GENDER_REQUIRED, BREED_REQUIRED, SPECIES_REQUIRED, BREED_SELECT_REQUIRED, DOB_REQUIRED } from "patient-portal-message";
const defaultStr = Yup.string().default("");

const usePetValidation = (props) => {
  const { labelData } = useContext(LanguageContext);
  const requiredForDiffAddress = {
    is: "other",
    then: Yup.string().required(BREED_REQUIRED)
};

  const AddEditPetSchema = useMemo(() => Yup.object().shape({
    name: Yup
      .string()
      .required(NAME_REQUIRED),

    species: Yup.object({
      value: defaultStr.required(SPECIES_REQUIRED),
      label: defaultStr.required(SPECIES_REQUIRED)
    }),
    breed: Yup.object({
      value: defaultStr.required(BREED_SELECT_REQUIRED),
      label: defaultStr.required(BREED_SELECT_REQUIRED)
    }),
    breed_name: Yup.string().when('breed', requiredForDiffAddress),
    gender: Yup
      .string()
      .required(GENDER_REQUIRED),
    dob: Yup
      .string()
      .required(DOB_REQUIRED)


  }), [labelData]);

  return { AddEditPetSchema };
}

export { usePetValidation };