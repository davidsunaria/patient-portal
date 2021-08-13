import { action, thunk } from "easy-peasy";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { getMyProfile, getPets, updateMyProfile, getClinics, getSettings, updateSettings } from "patient-portal-api/ProfileApi.js";
const profileModel = {
  response: [],
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  getMyProfile: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getMyProfile(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    }
  }),
  getPets: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getPets(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    }
  }),
  updateMyProfile: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await updateMyProfile(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      toast.success(<ToastUI message={response.message} type={"Success"} />);
      await actions.setResponse(response);
    }
  }),
  getClinics: thunk(async (actions, payload, { getStoreActions }) => {
    let response = await getClinics(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
    } else {
      await actions.setResponse(response);
    }
  }),
  updateSettings: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await updateSettings(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      getStoreActions().common.setLoading(false);
      toast.success(<ToastUI message={response.message} type={"Success"} />);
      await actions.setResponse(response);
    }
  }),
  getSettings: thunk(async (actions, payload, { getStoreActions }) => {
    let response = await getSettings(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
    } else {
      await actions.setResponse(response);
    }
  })
};

export default profileModel;
