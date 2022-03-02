import axios from "axios";
import { getToken, handleInvalidToken } from "patient-portal-utils/Service.js";
const axiosApi = axios.create({
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
    language: `EN`,
    actiontype:"patient_portal"
  }
});
// doing something with the request
axiosApi.interceptors.request.use(request => {
  let token = getToken();
  if (token) {
    request.headers.common.Authorization = `Bearer ${token}`;
  }
  return request;
});

axiosApi.interceptors.response.use(function (response) {
  if (response.data.status === "error" && response.data.statuscode === 403) {
    setTimeout(handleInvalidToken, 3000);
    //handleInvalidToken();
  }
  let frontLabelData = response.data.data.frontLabels;
  let frontMessageData = response.data.data.frontMessages;
  let oldHashString = localStorage.getItem('frontTranslationHash');
  let combineData = {
    frontLabels: frontLabelData,
    frontMessages: frontMessageData
  };
  combineData = JSON.stringify(combineData);
  combineData = btoa(unescape(encodeURIComponent(combineData)));


  if (oldHashString == null) {
    localStorage.setItem('frontLabels', JSON.stringify(frontLabelData));
    localStorage.setItem('frontMessages', JSON.stringify(frontMessageData));
    localStorage.setItem('frontTranslationHash', combineData);
  } else {
    if (oldHashString != combineData) {
      localStorage.setItem('frontLabels', JSON.stringify(frontLabelData));
      localStorage.setItem('frontMessages', JSON.stringify(frontMessageData));
      localStorage.setItem('frontTranslationHash', combineData);
    }
  }
  return response;
}, function (error) {
  if (!error.response) {
   // handleInvalidToken();
  }
  else {
    if (error.response.status == 500) {
      return {
        data: {
          data: "",
          message:
            "There is some error while processing this request. Please try again after some time.",
          status: 500,
        },
      };
    }
    let msg = error.response.data.error;
    if (
      msg == "unauthenticated_request" ||
      msg == "session_timeout" ||
      msg == "server_error" ||
      msg == "token_not_found"
    ) {
      handleInvalidToken();
    }
  }
  // Any status codes outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});


const objectToQuery = (obj) => {
  return (obj) ? Object.entries(obj).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&") : '';
}
const apiUrl = process.env.REACT_APP_PATIENTPORTAL_API;
const bookApiUrl = process.env.REACT_APP_BOOKING_PORTAL_URL;

export { objectToQuery, axiosApi, apiUrl, bookApiUrl};