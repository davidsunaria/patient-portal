import { Action, action, thunk, Thunk } from "easy-peasy";
import { ToastContainer, toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import {
	getQuestionnaires,
	createQuestionnaire,
	updateQuestionnaire,
	createQuestion,
	getQuestionsByQuestionnaireId,
	deleteQuestionById,
	updateQuestion,
	updateQuestionsOrder,
	deleteQuestionnaire,
	generateIntake,
	getIntake,
	getProfileDetails,
	createUser,
	authenticateUser,
	getUserDetails,
	getAllIntakes,
	changeStatus,
	checkUser,
	downloadIntake,
	updateProfile,
	saveProfileImage,
	deleteIntake,
} from "patient-portal-api/DoctorApi.js";

const doctorModel = {
	setQuestionnaires: action((state, payload) => {
		state.allQuestionnaires = payload;
	}),
	setIntake: action((state, payload) => {
		state.intake = payload;
	}),
	setAllIntakes: action((state, payload) => {
		state.allIntakes = payload;
	}),
	setQuestions: action((state, payload) => {
		state.questions = payload;
	}),
	setLoggedInUser: action((state, payload) => {
		console.log(payload);
		state.loggedInUser = payload;
	}),
	setUserProfile: action((state, payload) => {
		state.userProfile = payload;
	}),
	setFileData: action((state, payload) => {
		state.file = payload;
	}),
	getQuestionnaires: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await getQuestionnaires(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			toast.success(
				<ToastUI
					message={"Questionnaires loaded successfully."}
					type={"Success"}
				/>
			);
			await actions.setQuestionnaires(response.data);
		}
	}),
	createQuestionnaire: thunk(
		async (actions, payload, { getStoreActions }) => {
			let response = await createQuestionnaire(payload);
			if (response.status != 200) {
				toast.error(
					<ToastUI message={response.message} type={"Error"} />
				);
			} else {
				await actions.setQuestionnaires(response.data);
			}
		}
	),
	updateQuestionnaire: thunk(
		async (actions, payload, { getStoreActions }) => {
			let response = await updateQuestionnaire(payload);
			if (response.status != 200) {
				toast.error(
					<ToastUI message={response.message} type={"Error"} />
				);
			} else {
				await actions.setQuestionnaires(response.data);
			}
		}
	),
	createQuestion: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await createQuestion(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			await actions.setQuestions(response.data);
		}
	}),
	getQuestionsByQuestionnaireId: thunk(
		async (actions, payload, { getStoreActions }) => {
			let response = await getQuestionsByQuestionnaireId(payload);
			if (response.status != 200) {
				toast.error(
					<ToastUI message={response.message} type={"Error"} />
				);
			} else {
				await actions.setQuestions(response.data);
			}
		}
	),
	deleteQuestionById: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await deleteQuestionById(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			await actions.setQuestions(response.data);
		}
	}),
	updateQuestion: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await updateQuestion(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			await actions.setQuestions(response.data);
		}
	}),
	updateQuestionsOrder: thunk(
		async (actions, payload, { getStoreActions }) => {
			let response = await updateQuestionsOrder(payload);
			if (response.status != 200) {
				toast.error(
					<ToastUI message={response.message} type={"Error"} />
				);
			} else {
				await actions.setQuestions(response.data);
			}
		}
	),
	deleteQuestionnaire: thunk(
		async (actions, payload, { getStoreActions }) => {
			let response = await deleteQuestionnaire(payload);
			if (response.status != 200) {
				toast.error(
					<ToastUI message={response.message} type={"Error"} />
				);
			} else {
				await actions.setQuestionnaires(response.data);
			}
		}
	),
	generateIntake: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await generateIntake(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			return response.data;
			//await actions.setQuestionnaires(response.data);
		}
	}),
	getIntake: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await getIntake(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			//return response.data;
			await actions.setIntake(response.data);
		}
	}),
	getProfileDetails: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await getProfileDetails(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			//return response.data;
			await actions.setUserProfile(response.data);
		}
	}),
	createUser: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await createUser(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
		}
	}),
	authenticateUser: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await authenticateUser(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			console.log(response.data);
			localStorage.setItem("doctorId", response.data._id);
			await actions.setLoggedInUser(response.data);
			return response.data;
		}
	}),
	getUserDetails: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await getUserDetails(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			console.log(response.data);
			localStorage.setItem("doctorId", response.data._id);
			await actions.setLoggedInUser(response.data);
			return response.data;
		}
	}),
	getAllIntakes: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await getAllIntakes(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			await actions.setAllIntakes(response.data);
			return response.data;
		}
	}),
	changeStatus: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await changeStatus(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			await actions.getIntake(payload.intakeId);
			return response.data;
		}
	}),
	checkUser: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await checkUser(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			//await actions.getIntake(payload.intakeId);
			return response.data;
		}
	}),
	downloadIntake: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await downloadIntake(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			//await actions.getIntake(payload.intakeId);
			return response.data;
		}
	}),
	updateProfile: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await updateProfile(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			await actions.setLoggedInUser(response.data);
			//return response.data;
		}
	}),
	saveProfileImage: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await saveProfileImage(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			await actions.setLoggedInUser(response.data);
			return response.data;
		}
	}),
	deleteIntake: thunk(async (actions, payload, { getStoreActions }) => {
		let response = await deleteIntake(payload);
		if (response.status != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
		} else {
			await actions.setAllIntakes(response.data);
			//return response.data;
		}
	}),
};

export default doctorModel;
