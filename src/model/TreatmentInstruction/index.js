import { action, thunk } from "easy-peasy";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { getInstructions, getInstructionDetail } from "patient-portal-api/TreatmentInstructionApi.js";
const treatmentInstructionModel = {
  response: [],
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  getInstructions: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getInstructions(payload);
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
  getInstructionDetail: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getInstructionDetail(payload);
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
  })
};

export default treatmentInstructionModel;
