import {axiosApi} from "patient-portal-utils/HttpService.js";
const apiUrl = process.env.REACT_APP_PATIENTPORTAL_API;

export const autologin = async (token) => {
	console.log("api token",token)
	try {
		let response = await axiosApi.post(`${apiUrl}/verify-auto-login`, token);
		console.log("api response",response)
		return response?.data;
	} catch (error) {
		return error?.response?.data;
	}
};

