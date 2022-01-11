import {axiosApi} from "patient-portal-utils/HttpService.js";
const apiUrl = process.env.REACT_APP_PATIENTPORTAL_API;
export const getTranslations = async () => {
	let formData = { language: process.env.REACT_APP_LANGUAGE }
	try {
		let response = await axiosApi.post(`${apiUrl}/language`, formData);
		return response?.data;
	} catch (error) {
		return error?.response?.data;
	}
};
export const sendOTP = async (formData) => {
	try {
		let response = await axiosApi.post(`${apiUrl}/otp`, formData);
		return response?.data;
	} catch (error) {
		return error?.response?.data;
	}
};

export const login = async (formData) => {
	try {
		let response = await axiosApi.post(`${apiUrl}/client-login`, formData);
		return response?.data;
	} catch (error) {
		console.log("api error",error)
		return error?.response?.data;
	}
};

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

export const verifyOtp = async (formData) => {
	try {
		let response = await axiosApi.post(`${apiUrl}/verify-signup-otp`, formData);
		return response?.data;
	} catch (error) {
		return error?.response?.data;
	}
};

export const signUp = async (formData) => {
	try {
		let response = await axiosApi.post(`${apiUrl}/new_signup`, formData);
		return response?.data;
	} catch (error) {
		return error?.response?.data;
	}
};
export const sendForgotPasswordOTP = async (formData) => {
	try {
		let response = await axiosApi.post(`${apiUrl}/get-change-password-otp`, formData);
		return response?.data;
	} catch (error) {
		return error?.response?.data;
	}
};

export const resetPassword = async (formData) => {
	try {
		let response = await axiosApi.post(`${apiUrl}/reset-password`, formData);
		return response?.data;
	} catch (error) {
		return error?.response?.data;
	}
};

export const logout = async () => {
	try {
		let response = await axiosApi.get(`${apiUrl}/logout`);
		return response?.data;
	} catch (error) {
		return error?.response?.data;
	}
};

