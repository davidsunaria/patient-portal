import {axiosApi} from "patient-portal-utils/HttpService.js";

/*const AuthInstance = axios.create();

AuthInstance.interceptors.request.use(function (config) {
	const token = localStorage.getItem("access_token");

	if (token) {
		config.headers.Authorization = "Bearer " + token;
	}

	return config;
});
AuthInstance.interceptors.response.use(
	function (response) {
		if (response.data.status === "error" &&  response.data.statuscode === 403) {
			handleInvalidToken();
		}
		return response;
	},
	function (error) {
		if (!error.response) {
			handleInvalidToken();
		} else {
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
		return Promise.reject(error);
	}
);*/

const apiUrl = process.env.REACT_APP_PATIENTPORTAL_API;

export const getTranslations = async () => {
	let formData = { language: process.env.REACT_APP_LANGUAGE }
	try {
		let response = await axiosApi.post(`${apiUrl}/language`, formData);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const sendOTP = async (formData) => {
	try {
		let response = await axiosApi.post(`${apiUrl}/otp`, formData);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const login = async (formData) => {
	try {
		let response = await axiosApi.post(`${apiUrl}/client-login`, formData);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};


export const verifyOtp = async (formData) => {
	try {
		let response = await axiosApi.post(`${apiUrl}/verify-signup-otp`, formData);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const signUp = async (formData) => {
	try {
		let response = await axiosApi.post(`${apiUrl}/new_signup`, formData);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const sendForgotPasswordOTP = async (formData) => {
	try {
		let response = await axiosApi.post(`${apiUrl}/get-change-password-otp`, formData);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const resetPassword = async (formData) => {
	try {
		let response = await axiosApi.post(`${apiUrl}/reset-password`, formData);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const logout = async () => {
	try {
		let response = await axiosApi.get(`${apiUrl}/logout`);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

