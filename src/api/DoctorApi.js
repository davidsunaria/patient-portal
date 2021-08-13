import axios from "axios";
import {
	getToken,
	setToken,
	handleInvalidToken,
} from "patient-portal-utils/Service.js";
import history from "patient-portal-history";
const AdminInstance = axios.create();

AdminInstance.interceptors.request.use(function (config) {
	const token = localStorage.getItem("access_token");
	if (!token) {
		handleInvalidToken();
	}
	config.headers.Authorization = "Bearer " + token;

	return config;
});
AdminInstance.interceptors.response.use(
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
);

const apiUrl = process.env.REACT_APP_DOCTORPORTAL_API;

export const getQuestionnaires = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/get-questionnaires",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const getQuestionsByQuestionnaireId = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/get-questions-by-questionnaireId",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const createQuestionnaire = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/create-questionnaire",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const updateQuestionnaire = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/update-questionnaire",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const createQuestion = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/create-question",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const updateQuestion = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/update-question",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const deleteQuestionById = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/delete-question",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const updateQuestionsOrder = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/update-question-order",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const deleteQuestionnaire = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/delete-questionnaire",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const generateIntake = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/create-patient-intake",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const getIntake = async (id) => {
	try {
		let response = await AdminInstance.get(
			apiUrl + "/get-patient-intake/" + id
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const getProfileDetails = async (id) => {
	try {
		let response = await AdminInstance.get(
			apiUrl + "/get-profile-details/" + id
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const createUser = async (formData) => {
	try {
		let response = await axios.post(apiUrl + "/create-user/", formData);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const authenticateUser = async (formData) => {
	try {
		let response = await axios.post(apiUrl + "/login-user/", formData);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const changeStatus = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/update-patient-intake-status/",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const downloadIntake = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/download-intake/",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const updateProfile = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/update-user/",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const getUserDetails = async (id) => {
	try {
		let response = await AdminInstance.get(
			apiUrl + "/get-user-details/" + id
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const getAllIntakes = async (id) => {
	try {
		let response = await AdminInstance.get(apiUrl + "/get-intakes/" + id);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const checkUser = async (formData) => {
	try {
		let response = await axios.post(apiUrl + "/check-user/", formData);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const saveProfileImage = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/save-profile-image/",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const deleteIntake = async (formData) => {
	try {
		let response = await AdminInstance.post(
			apiUrl + "/delete-intake/",
			formData
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
