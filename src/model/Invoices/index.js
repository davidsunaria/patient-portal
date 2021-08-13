import { action, thunk } from "easy-peasy";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { getInvoices, getInvoice, downloadInvoice, getAllClinics } from "patient-portal-api/InvoiceApi.js";
const invoiceModel = {
  response: [],
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  getInvoices: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getInvoices(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    }
  }),
  getInvoice: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getInvoice(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
    }
  }),
  downloadInvoice: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await downloadInvoice(payload);
    if (response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
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
  })


};

export default invoiceModel;
