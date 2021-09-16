import { axiosApi, apiUrl, objectToQuery } from "patient-portal-utils/HttpService.js";

export const getPets = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/pets/${formData}/1`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
export const getPet = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/pet/edit/${formData}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
export const getTreatmentRecord = async (payload) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/pet/treatmentRecord/${payload.clientId}/${payload.petId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getVaccinationRecord = async (payload) => {
  let query;
  if (payload.query) {
    query = objectToQuery(payload.query);
  }
  try {
    let response = await axiosApi.get(`${apiUrl}/pet/vaccinationList/${payload.clientId}/${payload.petId}?${query}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getAntiParasiticRecord = async (payload) => {
  let query;
  if (payload.query) {
    query = objectToQuery(payload.query);
  }
  try {
    let response = await axiosApi.get(`${apiUrl}/pet/dewormingList/${payload.clientId}/${payload.petId}?${query}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getReports = async (payload) => {
  let query;
  if (payload.query) {
    query = objectToQuery(payload.query);
  }
  try {
    let response = await axiosApi.get(`${apiUrl}/pet/petRepords/${payload.clientId}/${payload.petId}?${query}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const downloadReport = async (payload) => {
  try {
    let response = await axiosApi.get(`${apiUrl}${payload.url}${payload.id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getMedicalRecords = async (payload) => {
  let query;
  if (payload.query) {
    query = objectToQuery(payload.query);
  }
  try {
    let response = await axiosApi.get(`${apiUrl}/pet/petMedicalRecords/${payload.clientId}/${payload.petId}?${query}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const createPet = async (formData) => {
  try {
    let response = await axiosApi.post(`${apiUrl}/pet/create`, formData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const updatePet = async (formData) => {
  try {
    let response = await axiosApi.post(`${apiUrl}/pet/update`, formData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getSpecies = async () => {
  try {
    let response = await axiosApi.get(`${apiUrl}/pet/species`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getBreeds = async (formData) => {
  try {
    let response = await axiosApi.post(`${apiUrl}/pet/breeds`, formData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
export const deletePet = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/pet/delete/${formData}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
export const getReportsByVisit = async (payload) => {
  let query;
  if (payload.query) {
    query = objectToQuery(payload.query);
  }
  try {
    let response = await axiosApi.get(`${apiUrl}/pet/petReportsByVisit/${payload.id}?${query}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};



export const getDewormingDetail = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/pet/deworming-detail/${formData}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
export const getVaccinationDetail = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/pet/vaccination-detail/${formData}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getReportDetail = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/get_pet_report_by_id/${formData}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const contactUs = async (formData) => {
  try {
    let response = await axiosApi.post(`${apiUrl}/contact`, formData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};