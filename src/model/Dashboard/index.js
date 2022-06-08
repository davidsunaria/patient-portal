import { action, thunk } from "easy-peasy";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { getDashboard, deleteNotification, getArticleDetail, getPetByVisit, getPetIdInfo } from "patient-portal-api/DashboardApi.js";
import { setProfileCompleted } from "patient-portal-utils/Service.js";
const dashboardModel = {
  response: [],
  petData: {},
  isNotificationDeleted: false,
  isProfileAndPetCompleted:false,
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  setIsNotificationDeleted: action((state, payload) => {
    state.isNotificationDeleted = payload;
  }),
  setPetData: action((state, payload) => {
    state.petData = payload;
  }),
  setIsProfileAndPetCompleted: action((state, payload) => {
    state.isProfileAndPetCompleted = payload;
  }),
  getDashboard: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    getStoreActions().appointment.setIsQuestionnaireSubmitted(false);
    await actions.setIsProfileAndPetCompleted(false);
    let response = await getDashboard(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200)  {
      setProfileCompleted(response);
      getStoreActions().common.setLoading(false);
      await actions.setIsProfileAndPetCompleted(true);
      await actions.setResponse(response);
    }
    else{
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  deleteNotification: thunk(async (actions, payload, { getStoreActions }) => {
    await actions.setIsNotificationDeleted(false);
    getStoreActions().common.setLoading(true);

    let response = await deleteNotification(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      toast.success(<ToastUI message={response.message} type={"Success"} />);
      getStoreActions().common.setLoading(false);
      await actions.setIsNotificationDeleted(true);
    }else{
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),

  getArticleDetail: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);

    let response = await getArticleDetail(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    }else if (response && response.statuscode == 200) {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    }else{
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  getPetByVisit: thunk(async (actions, payload, { getStoreActions }) => {

    getStoreActions().common.setLoading(true);
    let response = await getPetByVisit(payload.id);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      getStoreActions().common.setLoading(false);
      let type;
      if (payload.event == "anti_ectoparasite") {
        let responsePet = await getPetIdInfo(payload);

        type = "antiparasitic-record";
        payload.history.push(`/pet-profile/${responsePet.data.event_data.pet_id}/${type}/${response.data.pet_visit.id}`);
      }
      else if (payload.event == "deworming") {
        let responsePet = await getPetIdInfo(payload);
        type = "deworming";
        payload.history.push(`/pet-profile/${responsePet.data.event_data.pet_id}/${type}/${response.data.pet_visit.id}`);
      }
      else if (payload.event == "vaccination") {
        let responsePet = await getPetIdInfo(payload);
        type = "vaccination-record";
        payload.history.push(`/pet-profile/${responsePet.data.event_data.pet_id}/${type}/${response.data.pet_visit.id}`);
      }
      // else if (payload.event == "report") {
      //   type = "report";
      //   payload.history.push(`/pet-profile/${response.data.pet_visit.pet_id}/${type}/${response.data.pet_visit.id}`);
      // }
      
      else {
        payload.history.push(`/pet-profile/${response.data.pet_visit.pet_id}/treatment-record/${response.data.pet_visit.id}`);
      }

    }else{
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  
  getPetIdInfo: thunk(async (actions, payload, { getStoreActions }) => {

    getStoreActions().common.setLoading(true);
    let response = await getPetIdInfo(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      getStoreActions().common.setLoading(false);
      console.log(payload, response)
      if(payload.event === "deworming" && payload.type === "completed"){
        payload.history.push(`/pet-profile/${response.data.event_data.pet_id}/deworming/${payload.id}`);
      }
      else if(payload.event === "vaccination" && payload.type === "completed"){
        payload.history.push(`/pet-profile/${response.data.event_data.pet_id}/vaccination-record/${payload.id}`);
      }
      else if (payload.event === "report") {
        let type = "report";
        payload.history.push(`/pet-profile/${response.data.event_data.pet_id}/${type}/${payload.id}`);
      }
     else if (payload.event === "anti_ectoparasite" || payload.event === "deworming" || payload.event === "vaccination") {
        payload.history.push(`/book-appointment/${response.data.event_data.pet_id}`);
      }
    }else{
      getStoreActions().common.setLoading(false);
      return true;
    }
  })
};

export default dashboardModel;
