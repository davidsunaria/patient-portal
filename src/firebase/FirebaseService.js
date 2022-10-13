
import { initializeApp } from "firebase/app";
import { logEvent, getAnalytics, setUserProperties } from "firebase/analytics";
import firebaseConfig from "./FirebaseConfig.json"

const firebaseApp = initializeApp(firebaseConfig);

const analytics = getAnalytics(firebaseApp);
const logLogin = (method, userAccount) => {
    if (process.env.REACT_APP_ENVIRONMENT !== "dev") return
        console.log("envvvvv")
        setUserProperties(analytics, {
            id: userAccount?.id?.toString(),
            email: userAccount?.email,
            phone: userAccount?.phone_code,
            fullName: userAccount?.firstname + (userAccount?.lastname ? (" " + userAccount?.lastname) : "")
        }, { global: true });
        logEvent(analytics, 'login', { method })
    
}


const logLogOut = () => {
    if (process.env.REACT_APP_ENVIRONMENT !== "dev") return
        logEvent(analytics, 'logout')
        setUserProperties(analytics, {
            id: "",
            email: "",
            phone: "",
            fullName: ""
        }, { global: true })
}

const FirebaseService = {
    logLogin,
    logLogOut
}

export default FirebaseService






