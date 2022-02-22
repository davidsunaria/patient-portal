import { action, thunk } from "easy-peasy";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { getPets, getPet, getTreatmentRecord, getVaccinationRecord, getAntiParasiticRecord, getReports, downloadReport, getMedicalRecords, createPet, updatePet, getSpecies, getBreeds, deletePet, getReportsByVisit, getDewormingDetail, getVaccinationDetail, getReportDetail, contactUs, getTreatmentDetail } from "patient-portal-api/PetApi.js";
const petModel = {
  response: [],
  getSelectedPet: [],
  isPetDeleted: false,
  isPetCreated: false,
  isPetUpdated: false,
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  setIsPetDeleted: action((state, payload) => {
    state.isPetDeleted = payload;
  }),
  setIsPetCreated: action((state, payload) => {
    state.isPetCreated = payload;
  }),
  setIsPetUpdated: action((state, payload) => {
    state.isPetUpdated = payload;
  }),
  getPets: thunk(async (actions, payload, { getStoreActions }) => {
    await actions.setIsPetUpdated(false);
    await actions.setIsPetDeleted(false);
    await actions.setIsPetCreated(false);
    getStoreActions().common.setLoading(true);
    let response = await getPets(payload);
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
  setSelectedPet: action((state, payload) => {
    state.getSelectedPet = payload;
  }),
  getPet: thunk(async (actions, payload, { getStoreActions }) => {
    await actions.setIsPetUpdated(false);
    await actions.setIsPetDeleted(false);
    await actions.setIsPetCreated(false);
    getStoreActions().common.setLoading(true);
    let response = await getPet(payload);
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
  getTreatmentRecord: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getTreatmentRecord(payload);
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
  getVaccinationRecord: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getVaccinationRecord(payload);
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
  getAntiParasiticRecord: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getAntiParasiticRecord(payload);
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
  getReports: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getReports(payload);
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
  downloadReport: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await downloadReport(payload);
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
  getMedicalRecords: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getMedicalRecords(payload);
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
  createPet: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    await actions.setIsPetCreated(false);
    let response = await createPet(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      toast.success(<ToastUI message={response.message} type={"Success"} />);
      getStoreActions().common.setLoading(false);
      await actions.setIsPetCreated(true);
      await actions.setResponse(response);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  updatePet: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    await actions.setIsPetUpdated(false);
    let response = await updatePet(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      toast.success(<ToastUI message={response.message} type={"Success"} />);
      await actions.setIsPetUpdated(true);
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  getSpecies: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getSpecies(payload);
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
  getBreeds: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getBreeds(payload);
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
  deletePet: thunk(async (actions, payload, { getStoreActions }) => {
    await actions.setIsPetDeleted(false);
    getStoreActions().common.setLoading(true);
    let response = await deletePet(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      toast.success(<ToastUI message={response.message} type={"Success"} />);
      getStoreActions().common.setLoading(false);
      await actions.setIsPetDeleted(true);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  getReportsByVisit: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getReportsByVisit(payload);
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
  getDewormingDetail: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getDewormingDetail(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  getVaccinationDetail: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getVaccinationDetail(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  getReportDetail: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getReportDetail(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  contactUs: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await contactUs(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      toast.success(<ToastUI message={response.message} type={"Success"} />);
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  }),
  resetContactUs: thunk(async (actions, payload, { getStoreActions }) => {
    await actions.setResponse([]);
  }),

  getTreatmentDetail: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().common.setLoading(true);
    let response = await getTreatmentDetail(payload);
    if (response && response.statuscode != 200) {
      toast.error(<ToastUI message={response.message} type={"Error"} />);
      getStoreActions().common.setLoading(false);
    } else if (response && response.statuscode == 200) {
      await actions.setResponse(response);
      getStoreActions().common.setLoading(false);
      await actions.setResponse(response);
    } else {
      getStoreActions().common.setLoading(false);
      return true;
    }
  })
};

export default petModel;
