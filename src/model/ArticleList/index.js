import { action, thunk } from "easy-peasy";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { getDashboard, deleteNotification, getArticleDetail, getPetByVisit, getPetIdInfo,getArticleList } from "patient-portal-api/DashboardApi.js";
import { setProfileCompleted } from "patient-portal-utils/Service.js";
const ArticleListModel = {
  response: [],
 
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  
  getArticleList: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getArticleList(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200)  {
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    }
    else{
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),




};

export default ArticleListModel;
