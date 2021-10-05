import { axiosApi, apiUrl, objectToQuery, bookApiUrl } from "patient-portal-utils/HttpService.js";

export const getInvoices = async (formData) => {
  let query;
  if(formData.query){
    query = objectToQuery(formData.query);
  }
  try {
    let response = await axiosApi.get(`${apiUrl}/invoices/${formData.clientId}?${query}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
export const getInvoice = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/get/invoice/${formData}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
export const downloadInvoice = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/download/invoice/${formData}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
export const getAllClinics = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/clinics`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
export const payInvoice = async (formData) => {
	try {
		let response = await axiosApi.post(`${bookApiUrl}invoice-payment`, formData);
		return response?.data;
	} catch (error) {
		return error?.response?.data;
	}
};
