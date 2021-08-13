import authModel from "./Auth";
import commonModel from "./Common";
import dashboardModel from "./Dashboard";
import profileModel from "./Profile";
import petModel from "./Pet";
import treatmentInstructionModel from "./TreatmentInstruction";
import invoiceModel from "./Invoices";

const storeModel = {
	auth: authModel,
	common: commonModel,
	dashboard: dashboardModel,
	profile: profileModel,
	pet: petModel,
	treatment: treatmentInstructionModel,
	invoice: invoiceModel
};

export default storeModel;
