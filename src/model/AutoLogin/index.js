import { Action, action, thunk, Thunk } from "easy-peasy";
import { ToastContainer, toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { autologin } from "patient-portal-api/Auto.js";
import { setToken, setAccountData, setUser} from "patient-portal-utils/Service.js";
const autoLoginModel = {
	isLogin: false,
	response: {},
	
	setIsLogin: action((state, payload) => {
		state.isLogin = payload;
	}),
	setResponse: action((state, payload) => {
		state.response = payload;
	}),


	autologin: thunk(async (actions, payload, { getStoreActions }) => {
		console.log("payload",payload)
		await actions.setResponse({});
		getStoreActions().common.setLoading(true);
		let response = await autologin(payload);
		console.log("response",response)
		if (response && response.statuscode != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
			getStoreActions().common.setLoading(false);
		} else if (response && response.statuscode == 200) {
			setToken(response.data.token);
			setUser(response.data.client);
			setAccountData(response.data.accountInfo);
			await actions.setResponse(response.data);
			await actions.setIsLogin(true);
			getStoreActions().common.setLoading(false);
		}
		else {
			getStoreActions().common.setLoading(false);
			return true;
		}
	}),

};

export default autoLoginModel;
