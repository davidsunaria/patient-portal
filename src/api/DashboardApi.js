import { axiosApi, apiUrl } from "patient-portal-utils/HttpService.js";

export const getDashboard = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/get/dashboard/${formData}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};


export const deleteNotification = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/remove/notification/${formData}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
export const getArticleDetail = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/get/article/${formData}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};


export const getPetByVisit = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/get_pet_id_by_visit/${formData}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
export const getPetIdInfo = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/get/pet_id/${formData.event}/${formData.id}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};


