import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { getToken, setToken, handleInvalidToken, } from "patient-portal-utils/Service.js";
import { LanguageProvider } from "patient-portal-context/LanguageContext.js";

import Login from "patient-portal-pages/Auth/Login.js";
import Profile from "patient-portal-pages/Profile/Profile.js";
import EditProfile from "patient-portal-pages/Profile/EditProfile.js";


import Appointment from "patient-portal-pages/Appointment/Appointment.js";
import Treatment from "patient-portal-pages/Pretreatment/Treatment.js";
import TreatmentDetail from "patient-portal-pages/Pretreatment/TreatmentDetail.js";


import BookAppointment from "patient-portal-pages/Appointment/BookAppointment/BookAppointment.js";
import ForgotPassword from "patient-portal-pages/Auth/ForgotPassword.js";
import ResetPassword from "patient-portal-pages/Auth/ResetPassword.js";
import VerifyOtp from "patient-portal-pages/Auth/VerifyOtp.js";

import Signup from "patient-portal-pages/Auth/Signup.js";
import SignupComplete from "patient-portal-pages/Auth/SignupComplete.js";


import Feedback from "patient-portal-pages/Feedback/Feedback.js";
import Invoice from "patient-portal-pages/Invoice/Invoice.js";
import InvoiceDetail from "patient-portal-pages/Invoice/InvoiceDetail.js";


import Pets from "patient-portal-pages/Pet/Pets.js";
import ProfileView from "patient-portal-pages/Pet/ProfileView.js";

import Dashboard from "patient-portal-pages/Dashboard/Dashboard.js";
import ArticleDetail from "patient-portal-components/Dashboard/ArticleDetail.js";
import EditPet from "patient-portal-pages/Pet/EditPet.js";
import AddPet from "patient-portal-pages/Pet/AddPet.js";
import Layout from "patient-portal-components/Layout/Layout.js";
import TreatmentReports from "patient-portal-pages/Pet/TreatmentReports.js";
import AppointmentDetail from "patient-portal-pages/Appointment/AppointmentDetail.js";
import Questionnaire from "patient-portal-pages/Questionnaire/Questionnaire.js";
import ContactUs from "patient-portal-pages/Profile/ContactUs.js";


const PrivateRoute = ({ component: Component, ...rest }) => {
	return (
		// Show the component only when the user is logged in
		// Otherwise, redirect the user to /signin page
		<Route
			{...rest}
			render={(props) =>
				getToken() ? <Component {...props} /> : <Redirect to="/login" />
			}
		/>
	);
};

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
	return (
		// restricted = false meaning public route
		// restricted = true meaning restricted route
		<Route
			{...rest}
			render={(props) =>
				getToken() && restricted ? (
					<Redirect to="/dashboard" />
				) : (
					<Component {...props} />
				)
			}
		/>
	);
};
const Routes = () => {
	return (
		<Layout>
			<LanguageProvider>
				<BrowserRouter>

					<Switch>
						<PublicRoute restricted={true} path={"/verify-otp"} component={VerifyOtp} exact />
						<PublicRoute restricted={true} path={"/forgot-password"} component={ForgotPassword} exact />
						<PublicRoute restricted={true} path={"/reset-password"} component={ResetPassword} exact />
						<PublicRoute restricted={true} path={"/login"} component={Login} exact />
						<PublicRoute restricted={true} path={"/register"} component={Signup} exact />
						<PublicRoute restricted={true} path={"/register-user"} component={SignupComplete} exact />

						{/* private routes */}
						<PrivateRoute path={"/dashboard"} component={Dashboard} exact />
						<PrivateRoute path={"/article-detail/:id"} component={ArticleDetail} exact />

						<PrivateRoute path={"/profile"} component={Profile} exact />
						<PrivateRoute path={"/edit-profile"} component={EditProfile} exact />
						<PrivateRoute path={"/treatments/:id?"} component={Treatment} exact />
						<PrivateRoute path={"/treatment-detail/:id"} component={TreatmentDetail} exact />

						<PrivateRoute path={"/appointment"} component={Appointment} exact />
						<PrivateRoute path={"/book-appointment/:id?"} component={BookAppointment} exact />
						<PrivateRoute path={"/appointment-detail/:id"} component={AppointmentDetail} exact />
						<PrivateRoute path={"/feedback/:id"} component={Feedback} exact />
						<PrivateRoute path={"/invoices"} component={Invoice} exact />
						<PrivateRoute path={"/invoice-detail/:id"} component={InvoiceDetail} exact />

						<PrivateRoute path={"/pets"} component={Pets} exact />
						<PrivateRoute path={"/treatment-record-reports/:id"} component={TreatmentReports} exact />
						
						<PrivateRoute path={"/pet-profile/:id/:type?/:visitId?"} component={ProfileView} exact />
						<PrivateRoute path={"/edit-pet/:id"} component={EditPet} exact />
						<PrivateRoute path={"/create-pet"} component={AddPet} exact />

						
						<PrivateRoute path={"/questionnaire/:id/:type"} component={Questionnaire} exact />
						<PrivateRoute path={"/contact-us"} component={ContactUs} exact />
						<Route
							path="/"
							render={() => <Redirect to="/login" />}
							exact
						/>
					</Switch>

				</BrowserRouter>
			</LanguageProvider>
		</Layout>
	);
};

export default Routes;
