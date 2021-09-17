import { axiosApi, apiUrl } from "patient-portal-utils/HttpService.js";

export const getMyProfile = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/profile/${formData}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
export const getPets = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/pets/${formData}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
export const updateMyProfile = async (formData) => {
  try {
    let response = await axiosApi.post(`${apiUrl}/profile/update`, formData);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
export const getClinics = async () => {
  try {
    let response = await axiosApi.get(`${apiUrl}/clinics`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
export const updateSettings = async (formData) => {
  try {
    let response = await axiosApi.post(`${apiUrl}/save/client/settings/${formData.id}`, formData.payload);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
export const getSettings = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/client/settings/${formData}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};