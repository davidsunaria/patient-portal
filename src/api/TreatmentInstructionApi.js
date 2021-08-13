import { axiosApi, apiUrl, objectToQuery } from "patient-portal-utils/HttpService.js";

export const getInstructions = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/treatment/instructions/${formData.clientId}/${formData.type}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getInstructionDetail = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/get/treatment/instruction/${formData}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};



