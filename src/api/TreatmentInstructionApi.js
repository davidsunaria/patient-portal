import { axiosApi, apiUrl, objectToQuery } from "patient-portal-utils/HttpService.js";

export const getInstructions = async (formData) => {
  console.log("formdata",formData)
  let query;
  if(formData.query){
    query = objectToQuery(formData.query);
  }
  try {
    let response = await axiosApi.get(`${apiUrl}/treatment/instructions/${formData.clientId}/${formData.type}?${query}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const getInstructionDetail = async (formData) => {
  
  try {
    let response = await axiosApi.get(`${apiUrl}/get/treatment/instruction/${formData}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};



