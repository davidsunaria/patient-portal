import { axiosApi, apiUrl, objectToQuery } from "patient-portal-utils/HttpService.js";
export const getPastAppointments = async (formData) => {
	try {
		let response = await axiosApi.get(`${apiUrl}/past_appointments/${formData}/past`);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const getUpcomingAppointments = async (formData) => {
	try {
		let response = await axiosApi.get(`${apiUrl}/upcoming_appointments/${formData}`);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const getDates = async (formData) => {
	try {
		let response = await axiosApi.get(`${apiUrl}/reschedule_appointment/${formData}`);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const getTimeSlot = async (formData) => {
	try {
		let response = await axiosApi.get(`${apiUrl}/timeslots/${formData.id}/${formData.date}`);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};
export const updateAppointment = async (formData) => {
	try {
		let response = await axiosApi.post(`${apiUrl}/update_appointment`, formData);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const getClinicInfo = async (formData) => {
	try {
		let response = await axiosApi.get(`${apiUrl}/clinicinfo/${formData}`);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const cancelAppointment = async (formData) => {
	try {
		let response = await axiosApi.get(`${apiUrl}/cancel/${formData.id}/${formData.clientId}`);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const getAppointmentDetail = async (formData) => {
	try {
		let response = await axiosApi.get(`${apiUrl}/appointment/info/${formData}`);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const getCancellationPolicy = async () => {
	try {
		let response = await axiosApi.get(`${apiUrl}/cancellation_policy`);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const getAllClinics = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/clinics`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getClinicServices = async (formData) => {
  let query;
  if(formData.type == "virtual"){
    query = `${apiUrl}/services/${formData.type}`;
  }
  else{
    query = `${apiUrl}/services/${formData.type}/${formData.clinic_id}`;
  }
  try {
    let response = await axiosApi.get(`${query}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};


export const getProviders = async (formData) => {
  let clinicId;
  if(formData?.formData?.clinic_id != ""){
    clinicId = `/${formData?.formData?.clinic_id}`;
  }
  try {
    let response = await axiosApi.get(`${apiUrl}/service_for/${formData.type}${(clinicId) ? clinicId : ''}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getProviderSchedule = async (formData) => {
  try {
    let response = await axiosApi.post(`${apiUrl}/provider_slots`, formData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
export const getProviderSlots = async (formData) => {
  try {
    let response = await axiosApi.post(`${apiUrl}/slots`, formData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const createAppointment = async (formData) => {
  try {
    let response = await axiosApi.post(`${apiUrl}/appointment/create`, formData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getProviderName = async (formData) => {
  try {
    let response = await axiosApi.post(`${apiUrl}/check_doctor`, formData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
export const getFeedbackDetail = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/feedback/questions/${formData}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};


export const saveFeedback = async (formData) => {
  try {
    let response = await axiosApi.post(`${apiUrl}/save/feedback/${formData.clientId}/${formData.invoiceId}`, formData.formData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
export const getQuestionnaireDetail = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/get_questionnaire_details/${formData}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const uploadFile = async (formData) => {
  try {
    let response = await axiosApi.post(`${apiUrl}/upload/file`, formData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};


export const saveQuestionnaire = async (formData) => {
  try {
    let response = await axiosApi.post(`${apiUrl}/save/patient/questionnaire`, formData);
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
export const getAppointmentQuestionnaireDetail = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/get_appointment_questionnaire_details/${formData}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const saveAppointmentQuestionnaire = async (formData) => {
  try {
    let response = await axiosApi.post(`${apiUrl}/save/appointment/questionnaire`, formData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
