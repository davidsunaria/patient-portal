import React, { useState, useEffect } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Link, useHistory, useLocation } from "react-router-dom";
import { clearUserData, getUser } from "patient-portal-utils/Service.js";

import DCCLOGO from "patient-portal-images/dcc-logo.svg";
import HIDE_SHOW from "patient-portal-images/arrowHideShow.svg";
import USER_IMAGE from "patient-portal-images/user.png";
import DOWN_ARROW from "patient-portal-images/down-arrow.svg";
import DEFAULT_USER_IMG from "patient-portal-images/default-user.png";
import LogoutConfirmation from "patient-portal-components/Logout/LogoutConfirmation"
import FirebaseService from "../../../firebase/FirebaseService";

const Sidebar = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [userData, setUserData] = useState(getUser());
  const [showSubmenu, setShowSubMenu] = useState(false);
  const [hideLeftSection, setHideLeftSection] = useState(false);
  const [menu, setMenu] = useState("");
  const logout = useStoreActions((actions) => actions.auth.logout);
  const isLoggedOut = useStoreState((state) => state.auth.isLoggedOut);
  const [logoutModal, setLogoutModal] = useState(false);
  const setClinics = useStoreActions((actions) => actions.invoice.setClinics);
  const setStartDate = useStoreActions((actions) => actions.invoice.setStartDate);
  const setEndDate=useStoreActions((actions) => actions.invoice.setEndDate);
  const setSelectedPet = useStoreActions((actions) => actions.pet.setSelectedPet);
  const setMaxDate=useStoreActions((actions) => actions.invoice.setMaxDate);

  const toggleMenu = () => {
    setShowSubMenu(!showSubmenu);
  };

  const goToUrl = (url) => {
    history.push("/" + url);
    setClinics([])
    setStartDate(null)
    setEndDate(null)
    setMaxDate(new Date())
    setSelectedPet([])
  };

  const logoutMe = async () => {
    setLogoutModal(false);
    await logout();
    FirebaseService.logLogOut()
  };
  useEffect(() => {
    if (isLoggedOut) {
      clearUserData();
      setTimeout(() => {
        window.location.href = "/login";
      })

    }
  }, [isLoggedOut]);

  useEffect(() => {
    if (props.data) {
      setUserData(props.data);
    }
  }, [props.data]);

  const logoutUser = (id) => {
    setLogoutModal(!logoutModal);
  };
  return (
    <React.Fragment>
      <LogoutConfirmation modal={logoutModal} toggle={logoutUser} onLogout={logoutMe} />
      <div>
        <a
          className={
            hideLeftSection ? "showSidebar hideSidebar" : "showSidebar"
          }
          onClick={() => setHideLeftSection(!hideLeftSection)}
        >
          <img src={HIDE_SHOW} />
        </a>
        <div
          className={
            hideLeftSection ? "sidebar_outer sidebar-minimize" : "sidebar_outer"
          }
        >
          <div className="sidebar">
            <div className="header-logo">
              <a className="sidebar-brand">
                <img src={DCCLOGO} />
              </a>
            </div>
            <div className="userInfo">
              <span className="userImg">
                <img src={`${userData?.user_image ? process.env.REACT_APP_MEDIA_URL + userData.user_image : DEFAULT_USER_IMG}`} />
              </span>
              <div className="userName">
                <label>{userData?.firstname} {" "} {userData?.lastname}</label>
                <img src={DOWN_ARROW} />
              </div>
            </div>
            <ul className="navbar-nav scrollbar">
              <li className="nav-item">
                <a className={`nav-link dashboardLink ${props.activeMenu === "dashboard" ? "active" : ""
                  }`}
                  onClick={() => goToUrl("dashboard")}
                >
                  <span>Dashboard</span>
                </a>

              </li>
              <li className="nav-item">
                <a className={`nav-link petLink ${props.activeMenu === "pets" ? "active" : ""
                  }`}
                  onClick={() => goToUrl("pets")}
                >
                  <span>Pets</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link appointmentLink ${props.activeMenu === "appointment" ? "active" : ""
                    }`}
                  onClick={() => goToUrl("appointment")}
                >
                  <span>Appointments</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link invoiceLink ${props.activeMenu === "invoices" ? "active" : ""
                    }`}
                  onClick={() => goToUrl("invoices")}
                >
                  <span>Invoices</span>
                </a>


              </li>
              <li className="nav-item">
                <a
                  className={`nav-link instructionLink ${props.activeMenu === "treatments" ? "active" : ""
                    }`}
                  onClick={() => goToUrl("treatments")}
                >
                  <span>Treatment Instructions</span>
                </a>

              </li>
              <li className="nav-item">
                <a
                  className={`nav-link profileLink ${props.activeMenu === "profile" ? "active" : ""
                    }`}
                  onClick={() => goToUrl("profile")}
                >
                  <span>Profile</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link logoutLink" onClick={logoutUser}>
                  <span>Logout</span>
                </a>
              </li>
            </ul>

            {/* <ul className="navbar-nav scrollbar">
              <li className="nav-item" >
                <a className={`nav-link profileLink ${props.activeMenu === 'profile' ? 'active' : ''}`} >
                  <span>Profile</span>
                </a>
              </li>
              <li className="nav-item" onClick={() => goToUrl('appointment')}>
                <a className={`nav-link appointmentLink ${props.activeMenu === 'appointment' ? 'active' : ''}`}>
                  <span>Appointments</span>
                </a>
              </li>
              <li className="nav-item" onClick={() => goToUrl('settings')}>
                <a className={`nav-link settingLink ${props.activeMenu === 'settings' ? 'active' : ''}`}>
                  <span>Settings</span>
                </a>
                <ul className="submenu">
                  <li>
                    <a>Edit Profile</a>
                  </li>
                  <li>
                    <a>Invoice</a>
                  </li>
                  <li>
                    <a>Treatment Instructions</a>
                  </li>
                  <li>
                    <a>Notifications Settings</a>
                  </li>
                  <li>
                    <a>Rate DCC PetConnect</a>
                  </li>
                  <li>
                    <a>Pre-Appointment Questionnaire</a>
                  </li>
                  <li>
                    <a>Privacy Policy</a>
                  </li>
                  <li>
                    <a>Terms &amp; Conditions</a>
                  </li>
                  <li>
                    <a>Logout</a>
                  </li>
                </ul>
              </li>
            </ul>*/}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
 