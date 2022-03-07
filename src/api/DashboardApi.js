import { axiosApi, apiUrl,objectToQuery } from "patient-portal-utils/HttpService.js";

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

// export const getArticleList = async (formData) => {
//   try {
//     let response = await axiosApi.get(`${apiUrl}/article_list/${}`);
//     return response?.data;
//   } catch (error) {
//     return error?.response?.data;
//   }
// };

 export const getArticleList = async (formData) => {
   let query;
   if(formData.query){
     query = objectToQuery(formData.query);
   }
   try {
     let response = await axiosApi.get(`${apiUrl}/article_list?${query}&search_key=${formData.search_key}`);
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


