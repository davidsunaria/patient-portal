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
  try {
    let response = await axiosApi.get(`${apiUrl}/services/${formData.type}/${formData.clinic_id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};


export const getProviders = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/service_for/${formData.formData.clinic_id}/${formData.type}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getProviderSchedule = async (formData) => {
  try {
    let response = await axiosApi.get(`${apiUrl}/service_for/${formData.formData.clinic_id}/${formData.type}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
