import { action, thunk } from "easy-peasy";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { getInvoices, getInvoice, downloadInvoice, getAllClinics, payInvoice } from "patient-portal-api/InvoiceApi.js";
const invoiceModel = {
  response: [],
  getClinics: [],
  startDate: null,
  endDate: null,
  maxDate: new Date(),
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  setClinics: action((state, payload) => {
    state.getClinics = payload;
  }),
  setStartDate: action((state, payload) => {
    state.startDate = payload;
  }),
  setEndDate: action((state, payload) => {
    state.endDate = payload;
  }),
  setMaxDate: action((state, payload) => {
    state.maxDate = payload;
  }),
  getInvoices: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getInvoices(payload);
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
  getInvoice: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getInvoice(payload);
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
  downloadInvoice: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await downloadInvoice(payload);
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
  payInvoice: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await payInvoice(payload);
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

export default invoiceModel