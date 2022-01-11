import { Action, action, thunk, Thunk } from "easy-peasy";
import { ToastContainer, toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { sendOTP, getTranslations, login, verifyOtp, signUp, sendForgotPasswordOTP, resetPassword, logout, autologin } from "patient-portal-api/AuthApi.js";
import { setToken, setAccountData, setUser, setTempData, removeTempData } from "patient-portal-utils/Service.js";
import { OTP_SENT } from "patient-portal-message";
const authModel = {
	translations: [],
	isLogin: false,
	isOtpSend: false,
	isOtpVerified: false,
	isSignupCompleted: false,
	isPasswordReset: false,
	isLoggedOut: false,
	response: {},
	setTranslations: action((state, payload) => {
		state.translations = payload;
	}),
	setIsLogin: action((state, payload) => {
		state.isLogin = payload;
	}),
	setIsOtpSend: action((state, payload) => {
		state.isOtpSend = payload;
	}),
	setIsOtpVerified: action((state, payload) => {
		state.isOtpVerified = payload;
	}),
	setIsSignupCompleted: action((state, payload) => {
		state.isSignupCompleted = payload;
	}),
	setIsLoggedOut: action((state, payload) => {
		state.isLoggedOut = payload;
	}),
	setIsPasswordReset: action((state, payload) => {
		state.isPasswordReset = payload;
	}),
	setResponse: action((state, payload) => {
		state.response = payload;
	}),
	sendOTP: thunk(async (actions, payload, { getStoreActions }) => {
		getStoreActions().common.setLoading(true);
		let response = await sendOTP(payload);
		if (response && response.statuscode != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
			getStoreActions().common.setLoading(false);
		} else if (response && response.statuscode == 200) {
			toast.success(<ToastUI message={OTP_SENT} type={"Success"} />);
			payload.type = "signup";
			setTempData(payload);
			await actions.setIsOtpSend(true);
			getStoreActions().common.setLoading(false);
		}
		else {
			getStoreActions().common.setLoading(false);
			return true;
		}
	}),
	getTranslations: thunk(async (actions, payload, { getStoreActions, getStoreState }) => {
		if (getStoreState().auth.translations.length === 0) {
			let response = await getTranslations();
			if (response && response.statuscode != 200) {
				toast.error(<ToastUI message={response.message} type={"Error"} />);
			} else if (response && response.statuscode == 200) {
				await actions.setTranslations(response.data);
				return response.data;
			}
			else {
				getStoreActions().common.setLoading(false);
				return true;
			}
		}

	}),
	login: thunk(async (actions, payload, { getStoreActions }) => {
		await actions.setResponse({});
		getStoreActions().common.setLoading(true);
		let response = await login(payload);
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

	verifyOtp: thunk(async (actions, payload, { getStoreActions }) => {
		getStoreActions().common.setLoading(true);
		let response = await verifyOtp(payload);
		if (response && response.statuscode != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
			getStoreActions().common.setLoading(false);
		} else if (response && response.statuscode == 200) {
			await actions.setIsOtpVerified(true);
			getStoreActions().common.setLoading(false);
			await actions.setResponse(response.data);
			return true;
		}
		else {
			getStoreActions().common.setLoading(false);
			return true;
		}
	}),
	signUp: thunk(async (actions, payload, { getStoreActions }) => {
		getStoreActions().common.setLoading(true);
		await actions.setResponse({});
		let response = await signUp(payload);
		if (response && response.statuscode != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
			getStoreActions().common.setLoading(false);
		} else if (response && response.statuscode == 200) {
			//toast.success(<ToastUI message={"Signup completed successfully. please login"} type={"Success"} />);
			getStoreActions().common.setLoading(false);
			setToken(response.data.token);
			setUser(response.data.client);
			setAccountData(response.data?.accountInfo);
			removeTempData(payload);
			await actions.setIsSignupCompleted(true);
			await actions.setResponse(response.data);
		}
		else {
			getStoreActions().common.setLoading(false);
			return true;
		}
	}),
	sendForgotPasswordOTP: thunk(async (actions, payload, { getStoreActions }) => {
		getStoreActions().common.setLoading(true);
		let response = await sendForgotPasswordOTP(payload);
		if (response && response.statuscode != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
			getStoreActions().common.setLoading(false);
		} else if (response && response.statuscode == 200) {
			toast.success(<ToastUI message={OTP_SENT} type={"Success"} />);
			getStoreActions().common.setLoading(false);
			payload.type = "forgot_password";
			setTempData(payload);
			await actions.setIsOtpSend(true);
		}
		else {
			getStoreActions().common.setLoading(false);
			return true;
		}
	}),
	resetPassword: thunk(async (actions, payload, { getStoreActions }) => {
		getStoreActions().common.setLoading(true);

		let response = await resetPassword(payload);
		if (response && response.statuscode != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
			getStoreActions().common.setLoading(false);
		} else if (response && response.statuscode == 200) {
			toast.success(<ToastUI message={response.message} type={"Success"} />);
			getStoreActions().common.setLoading(false);
			removeTempData();
			await actions.setIsPasswordReset(true);
		}
		else {
			getStoreActions().common.setLoading(false);
			return true;
		}
	}),
	logout: thunk(async (actions, payload, { getStoreActions }) => {
		getStoreActions().common.setLoading(true);

		let response = await logout(payload);
		if (response && response.statuscode != 200) {
			toast.error(<ToastUI message={response.message} type={"Error"} />);
			getStoreActions().common.setLoading(false);
		} else if (response && response.statuscode == 200) {
			toast.success(<ToastUI message={response.message} type={"Success"} />);
			getStoreActions().common.setLoading(false);
			await actions.setIsLoggedOut(true);
		}
		else {
			getStoreActions().common.setLoading(false);
			return true;
		}
	})
};

export default authModel;
