import { action, thunk } from "easy-peasy";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { getPastAppointments, getUpcomingAppointments, getDates, getTimeSlot, updateAppointment, getClinicInfo, cancelAppointment, getAppointmentDetail, getCancellationPolicy, getAllClinics, getClinicServices, getProviders, getProviderSchedule, getProviderSlots, createAppointment, getProviderName, getFeedbackDetail, saveFeedback, getQuestionnaireDetail, uploadFile, saveQuestionnaire, getPet, getAppointmentQuestionnaireDetail, saveAppointmentQuestionnaire } from "patient-portal-api/AppointmentApi.js";
const appointmentModel = {
  response: [],
  isRescheduled: false,
  isCancelled: false,
  isBooked: false,
  isFeedbackGiven: false,
  isQuestionnaireSubmitted: false,
  count:0,
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  setCount: action((state, payload) => {
    state.count = payload;
  }),
  setIsRescheduled: action((state, payload) => {
    state.isRescheduled = payload;
  }),
  setIsCancelled: action((state, payload) => {
    state.isCancelled = payload;
  }),
  setIsBooked: action((state, payload) => {
    state.isBooked = payload;
  }),
  setIsFeedbackGiven: action((state, payload) => {
    state.isFeedbackGiven = payload;
  }),
  setIsQuestionnaireSubmitted: action((state, payload) => {
    state.isQuestionnaireSubmitted = payload;
  }),
  getPastAppointments: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    await actions.setIsRescheduled(false);
    let response = await getPastAppointments(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    }
    else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  getUpcomingAppointments: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    await actions.setIsRescheduled(false);
    let response = await getUpcomingAppointments(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  getDates: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getDates(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  getTimeSlot: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getTimeSlot(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  updateAppointment: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    await actions.setIsRescheduled(false);
    let response = await updateAppointment(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      toast.success(<ToastUI message={response.message} type={"Success"} />);
      getStoreActions().common.setLoading(false);

      await actions.setIsRescheduled(true);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  getClinicInfo: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getClinicInfo(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  cancelAppointment: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    await actions.setIsCancelled(false);
    let response = await cancelAppointment(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      toast.success(<ToastUI message={response.message} type={"Success"} />);
      getStoreActions().common.setLoading(false);
      await actions.setIsCancelled(true);
      await actions.setResponse(response);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  getAppointmentDetail: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getAppointmentDetail(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  getCancellationPolicy: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getCancellationPolicy(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  getAllClinics: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getAllClinics(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  getClinicServices: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getClinicServices(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  getProviders: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getProviders(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  getProviderSchedule: thunk(async (actions, payload, { getStoreActions,getState }) => {
    getStoreActions().common.setLoading(true);
    let response = await getProviderSchedule(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      await actions.setResponse(response);
      if(getState()?.count!=0){
        getStoreActions().common.setLoading(false);
      }
      await actions.setCount(1)
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  getProviderSlots: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getProviderSlots(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  createAppointment: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    await actions.setIsBooked(false);
    let response = await createAppointment(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      toast.success(<ToastUI message={response.message} type={"Success"} />);
      await actions.setResponse(response);
      await actions.setIsBooked(true);

      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  getProviderName: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getProviderName(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  getFeedbackDetail: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getFeedbackDetail(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  saveFeedback: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    await actions.setIsFeedbackGiven(false);
    let response = await saveFeedback(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      toast.success(<ToastUI message={response.message} type={"Success"} />);
      await actions.setIsFeedbackGiven(true);
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  getQuestionnaireDetail: thunk(async (actions, payload, { getStoreActions }) => {
    await actions.setIsQuestionnaireSubmitted(false);
    getStoreActions().common.setLoading(true);
    let response = await getQuestionnaireDetail(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  uploadFile: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await uploadFile(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  saveQuestionnaire: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    await actions.setIsQuestionnaireSubmitted(false);
    let response = await saveQuestionnaire(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      toast.success(<ToastUI message={response.message} type={"Success"} />);
      await actions.setIsQuestionnaireSubmitted(true);
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  getPet: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getPet(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  getAppointmentQuestionnaireDetail: thunk(async (actions, payload, { getStoreActions }) => {
    await actions.setIsQuestionnaireSubmitted(false);
    getStoreActions().common.setLoading(true);
    let response = await getAppointmentQuestionnaireDetail(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  saveAppointmentQuestionnaire: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    await actions.setIsQuestionnaireSubmitted(false);
    let response = await saveAppointmentQuestionnaire(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      toast.success(<ToastUI message={response.message} type={"Success"} />);
      await actions.setIsQuestionnaireSubmitted(true);
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
};

export default appointmentModel;
