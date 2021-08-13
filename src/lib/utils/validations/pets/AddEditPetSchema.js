import { useContext, useMemo } from "react";
import { LanguageContext } from "patient-portal-context/LanguageContext.js";
import * as Yup from "yup";
const defaultStr = Yup.string().default("");

const usePetValidation = (props) => {
  const { labelData } = useContext(LanguageContext);
  const requiredForDiffAddress = {
    is: "other",
    then: Yup.string().required("Please enter breed name")
};

  const AddEditPetSchema = useMemo(() => Yup.object().shape({
    name: Yup
      .string()
      .required("Please enter name"),

    species: Yup.object({
      value: defaultStr.required("Please select species"),
      label: defaultStr.required("Please select species")
    }),
    breed: Yup.object({
      value: defaultStr.required("Please select breed"),
      label: defaultStr.required("Please select breed")
    }),
    breed_name: Yup.string().when('breed', requiredForDiffAddress),
    gender: Yup
      .string()
      .required("Please select gender"),
    dob: Yup
      .string()
      .required("Please select dob")


  }), [labelData]);

  return { AddEditPetSchema };
}

export { usePetValidation };