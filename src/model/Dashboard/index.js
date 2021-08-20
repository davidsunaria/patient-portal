import { action, thunk } from "easy-peasy";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { getDashboard, deleteNotification, getArticleDetail, getPetByVisit } from "patient-portal-api/DashboardApi.js";
import { setProfileCompleted } from "patient-portal-utils/Service.js";
const dashboardModel = {
  response: [],
  petData: {},
  isNotificationDeleted: false,
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  setIsNotificationDeleted: action((state, payload) => {
    state.isNotificationDeleted = payload;
  }),
  setPetData: action((state, payload) => {
    state.petData = payload;
  }),
  getDashboard: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);

    let response = await getDashboard(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      setProfileCompleted(response);
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    }
  }),
  deleteNotification: thunk(async (actions, payload, { getStoreActions }) => {
    await actions.setIsNotificationDeleted(false);
    getStoreActions().common.setLoading(true);

    let response = await deleteNotification(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      toast.success(<ToastUI message={response.message} type={"Success"} />);
      getStoreActions().common.setLoading(false);
      await actions.setIsNotificationDeleted(true);
    }
  }),

  getArticleDetail: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);

    let response = await getArticleDetail(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    }
  }),
  getPetByVisit: thunk(async (actions, payload, { getStoreActions }) => {

    getStoreActions().common.setLoading(true);
    let response = await getPetByVisit(payload.id);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      console.log("TYpe", payload.event);
      getStoreActions().common.setLoading(false);
      let type;
      if (payload.event == "anti_ectoparasite") {
        type = "antiparasitic-record";
        payload.history.push(`/pet-profile/${response.data.pet_visit.pet_id}/${type}/${response.data.pet_visit.id}`);
      }
      else if (payload.event == "deworming") {
        type = "deworming";
        payload.history.push(`/pet-profile/${response.data.pet_visit.pet_id}/${type}/${response.data.pet_visit.id}`);
      }
      else if (payload.event == "vaccination") {
        type = "vaccination-record";
        payload.history.push(`/pet-profile/${response.data.pet_visit.pet_id}/${type}/${response.data.pet_visit.id}`);
      }
      else if (payload.event == "report") {
        type = "report";
        payload.history.push(`/pet-profile/${response.data.pet_visit.pet_id}/${type}/${response.data.pet_visit.id}`);
      }
      
      else {
        payload.history.push(`/pet-profile/${response.data.pet_visit.pet_id}/treatment-record/${response.data.pet_visit.id}`);
      }

    }
  })
};

export default dashboardModel;
