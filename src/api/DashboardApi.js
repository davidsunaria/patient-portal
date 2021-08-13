import { axiosApi, apiUrl } from "patient-portal-utils/HttpService.js";

export const getDashboard = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/get/dashboard/${formData}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};


export const deleteNotification = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/remove/notification/${formData}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
export const getArticleDetail = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/get/article/${formData}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

