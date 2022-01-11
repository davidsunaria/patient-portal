import { axiosApi } from "patient-portal-utils/HttpService.js";
const apiUrl = process.env.REACT_APP_PATIENTPORTAL_API;

export const autoLogin = async (token) => {
	try {
		let response = await axiosApi.post(`${apiUrl}/verify-auto-login`, token);
		return response?.data;
	} catch (error) {
		return error?.response?.data;
	}
};

