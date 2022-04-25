import { Action, action, thunk, Thunk } from "easy-peasy";
import { ToastContainer, toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { autoLogin } from "patient-portal-api/AutoLogin.js";
import { setToken, setAccountData, setUser } from "patient-portal-utils/Service.js";
const autoLoginModel = {
	isAutoLogin: false,
	response: {},

	setIsAutoLogin: action((state, payload) => {
		state.isAutoLogin = payload;
	}),
	setResponse: action((state, payload) => {
		state.response = payload;
	}),


	autoLogin: thunk(async (actions, payload, { getStoreActions }) => {
		await actions.setIsAutoLogin(false);
	
		await actions.setResponse({});
		getStoreActions().common.setLoading(true);
		let response = await autoLogin(payload);
		//console.log("response", response)
			if (response && response.statuscode != 200) {
				toast.error(<ToastUI message={response.message} type={"Error"} />);
				getStoreActions().common.setLoading(false);
			} else if (response && response.statuscode == 200) {
				setToken(response.data.token);
				setUser(response.data.client);
				setAccountData(response.data.accountInfo);
				await actions.setResponse(response.data);
				await actions.setIsAutoLogin(true);
				getStoreActions().common.setLoading(false);
			}
			else {
				getStoreActions().common.setLoading(false);
				return true;
			}
	}),

};

export default autoLoginModel;
