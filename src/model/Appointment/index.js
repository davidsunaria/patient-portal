import { action, thunk } from "easy-peasy";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { getPastAppointments, getUpcomingAppointments, getDates, getTimeSlot, updateAppointment, getClinicInfo, cancelAppointment, getAppointmentDetail, getCancellationPolicy, getAllClinics, getClinicServices, getProviders, getProviderSchedule } from "patient-portal-api/AppointmentApi.js";
const appointmentModel = {
  response: [],
  isRescheduled: false,
  isCancelled: false,
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  setIsRescheduled: action((state, payload) => {
    state.isRescheduled = payload;
  }),
  setIsCancelled: action((state, payload) => {
    state.isCancelled = payload;
  }),
  getPastAppointments: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getPastAppointments(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    }
  }),
  getUpcomingAppointments: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getUpcomingAppointments(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    }
  }),

  getDates: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getDates(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    }
  }),
  getTimeSlot: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getTimeSlot(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    }
  }),
  updateAppointment: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    await actions.setIsRescheduled(false);
    let response = await updateAppointment(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      toast.success(<ToastUI message={response.message} type={"Success"} />);
      getStoreActions().common.setLoading(false);

      await actions.setIsRescheduled(true);
    }
  }),
  getClinicInfo: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getClinicInfo(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    }
  }),

  cancelAppointment: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    await actions.setIsCancelled(false);
    let response = await cancelAppointment(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      toast.success(<ToastUI message={response.message} type={"Success"} />);
      getStoreActions().common.setLoading(false);
      await actions.setIsCancelled(true);
      await actions.setResponse(response);
    }
  }),

  getAppointmentDetail: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getAppointmentDetail(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    }
  }),

  getCancellationPolicy: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getCancellationPolicy(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    }
  }),
  getAllClinics: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getAllClinics(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    }
  }),
  getClinicServices: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getClinicServices(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    }
  }),

  getProviders: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getProviders(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    }
  }),

  getProviderSchedule: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getProviderSchedule(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    }
  })

};

export default appointmentModel;
