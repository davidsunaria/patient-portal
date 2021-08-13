import { action, thunk } from "easy-peasy";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { getDashboard, deleteNotification, getArticleDetail } from "patient-portal-api/DashboardApi.js";
// import { setToken, setAccountData, setUser, setTempData, removeTempData } from "patient-portal-utils/Service.js";
const dashboardModel = {
  response: [],
  isNotificationDeleted: false,
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  setIsNotificationDeleted: action((state, payload) => {
    state.isNotificationDeleted = payload;
  }),
  getDashboard: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);

    let response = await getDashboard(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
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
  })
};

export default dashboardModel;
