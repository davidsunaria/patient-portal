import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Header from "patient-portal-components/Header/Header.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import "react-toastify/dist/ReactToastify.css";
import { getLoggedinUserId } from "patient-portal-utils/Service";
import { useStoreActions, useStoreState } from "easy-peasy";
import USER_LOCATION_IMG from "patient-portal-images/userLocation.svg";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { setUser } from "patient-portal-utils/Service.js";
import DEFAULT_USER_IMG from "patient-portal-images/default-user.png";

const Profile = () => {
  const history = useHistory();
  const [userData, setUserData] = useState({});
  const [settingsData, setSettingsData] = useState({
    reminders: 0,
    pre_visit_updates: 0,
    post_visit_updates: 0,
    knowledge_base: 0,
  });
  const [loaderText, setLoaderText] = useState("Loading");
  const [showLoader, setShowLoader] = useState(false);
  const getMyProfile = useStoreActions((actions) => actions.profile.getMyProfile);
  const response = useStoreState((state) => state.profile.response);
  const updateSettings = useStoreActions((actions) => actions.profile.updateSettings);
  const getSettings = useStoreActions((actions) => actions.profile.getSettings);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  useEffect(async () => {
    await getMyProfile(getLoggedinUserId());
    await getSettings(getLoggedinUserId());
  }, []);

  useEffect(() => {
    if (response) {
      let { status, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        if (data?.clientData) {
          setUserData(data.clientData);
          setUser(data.clientData);
        }
        if (data?.client_settings) {
          setSettingsData(data?.client_settings);
        }
      }
    }
  }, [response]);

  const handleChange = async (e, type) => {

    let payload = { ...settingsData };
    if (type === "reminders") {
      payload.reminders = e.target.checked == 1 ? 1 : 0
    }
    if (type === "pre_visit_updates") {
      payload.pre_visit_updates = e.target.checked == 1 ? 1 : 0
    }
    if (type === "post_visit_updates") {
      payload.post_visit_updates = e.target.checked == 1 ? 1 : 0
    }
    if (type === "knowledge_base") {
      payload.knowledge_base = e.target.checked == 1 ? 1 : 0
    }
    delete payload.id;
    delete payload.client_id;
    delete payload.created;
    await updateSettings({ payload: payload, id: getLoggedinUserId() });
    setSettingsData(payload);
  }
  return (
    <React.Fragment>
      <div className="content_outer">
        <Modal isOpen={modal} toggle={toggle} >
          <ModalBody className="p-0 ">
            <div className="popupWrapper">
              <div className="popupTitle mb-3">Notification Settings
                <a className="cross" onClick={toggle}>
                  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.25 5.75L5.75 17.25" stroke="#444444" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5.75 5.75L17.25 17.25" stroke="#444444" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </a>
              </div>
              <p className="p-text mb-4">We recommend you keep push notifications turned on to keep you up-to-date on your pets’ health.</p>

              <div className="notificationRow">
                <div>Reminders</div>
                <label className="switch">
                  <input type="checkbox" id="togBtn1" checked={settingsData?.reminders === 1} onChange={(e) => handleChange(e, "reminders")} name="reminders" value={settingsData?.reminders} />
                  <div className="slider"></div>
                </label>
              </div>

              <div className="notificationRow">
                <div>Pre-Visit Updates</div>
                <label className="switch">
                  <input type="checkbox" id="togBtn2" checked={settingsData?.pre_visit_updates === 1} onChange={(e) => handleChange(e, "pre_visit_updates")} name="pre_visit_updates" value={settingsData?.pre_visit_updates} />
                  <div className="slider"></div>
                </label>
              </div>

              <div className="notificationRow">
                <div>Post-Visit Updates</div>
                <label className="switch">
                  <input type="checkbox" id="togBtn3" checked={settingsData?.post_visit_updates === 1} onChange={(e) => handleChange(e, "post_visit_updates")} name="post_visit_updates" value={settingsData?.post_visit_updates} />
                  <div className="slider"></div>
                </label>
              </div>

              <div className="notificationRow border-0 mb-0 pb-0">
                <div>Knowledge Base</div>
                <label className="switch">
                  <input type="checkbox" id="togBtn4" checked={settingsData?.knowledge_base === 1} onChange={(e) => handleChange(e, "knowledge_base")} name="knowledge_base" value={settingsData?.knowledge_base} />
                  <div className="slider"></div>
                </label>
              </div>

            </div>
          </ModalBody>

        </Modal>
        <Sidebar activeMenu="profile" data={userData} />
        <div className="right_content_col">
          <main>
            <Header
              heading={"Profile"}
              subHeading={"Here we can edit your information"}
              hasBtn={true}
              btnTitle={"Edit Profile"}
              btnName={"edit"}
              onClick={"edit-profile"}
            />
            <div className="articleOuter">
              <div className="box d-sm-flex">
                <div className="settingLeft">
                  <div className="profilePic">
                  

              {!userData?.user_image && <img  src={DEFAULT_USER_IMG} />}
              {userData?.user_image && <img  src={`${process.env.REACT_APP_MEDIA_URL}${userData?.user_image}`} />}
                    
                  </div>
                  <div className="userName">{userData?.firstname} {userData?.lastname}</div>
                  <div className="userLocation"><img src={USER_LOCATION_IMG} />{ (userData?.city) ? userData?.city+"," : ""} {userData?.country}</div>

                  <section>
                    <div className="settingLinkTitle">Settings</div>
                    <Link to="/edit-profile">Edit Profile</Link>
                    <a onClick={toggle}>Notification Settings</a>
                  </section>
                  <section>
                    <a href={`${process.env.REACT_APP_BOOKING_PORTAL_URL}pages/privacy-policy`} target="_blank">Privacy Policy</a>
                    <a href={`${process.env.REACT_APP_BOOKING_PORTAL_URL}pages/refund-policy`} target="_blank">Refund Policy</a>
                    <a href={`${process.env.REACT_APP_BOOKING_PORTAL_URL}pages/terms-and-conditions`} target="_blank">Terms And Conditions</a>
                  </section>
                </div>


                <div className="settingRight">
                  <div className="formSubtitle">Profile Information</div>

                  <div className="row">
                    <div className="col-sm-6">
                      <div className="dataOuter">
                        <label>First Name</label>
                        <span>{userData?.firstname} </span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="dataOuter">
                        <label>Last Name</label>
                        <span>{userData?.lastname}</span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="dataOuter">
                        <label>Email Address</label>
                        <span>{userData?.email}</span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="dataOuter">
                        <label>Mobile Number</label>
                        <span>{userData?.phone_code}</span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="dataOuter">
                        <label>Gender</label>
                        {userData?.gender && userData?.gender == "male" && <span>Male</span>}
                        {userData?.gender && userData?.gender == "female" && <span>Female</span>}
                      </div>
                    </div>
                  </div>

                  <div className="border-top mb-3"></div>

                  <div className="formSubtitle">Secondary Contact</div>


                  <div className="row">
                    <div className="col-sm-6">
                      <div className="dataOuter">
                        <label>Contact Name</label>
                        <span> {userData?.nick_name}</span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="dataOuter">
                        <label>Mobile Number</label>
                        <span>{userData?.phone_code2} </span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="dataOuter">
                        <label>Email Address</label>
                        <span>{userData?.email_2}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-top mb-3"></div>

                  <div className="formSubtitle">Additional Details</div>

                  <div className="row">
                    <div className="col-sm-6">
                      <div className="dataOuter">
                        <label>Address</label>
                        <span>{userData?.address}</span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="dataOuter">
                        <label>Pincode</label>
                        <span>{userData?.pincode}</span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="dataOuter">
                        <label>City</label>
                        <span>{userData?.city}</span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="dataOuter">
                        <label>State</label>
                        <span>{userData?.state}</span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="dataOuter">
                        <label>Country</label>
                        <span>{userData?.country}</span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="dataOuter">
                        <label>GSTIN</label>
                        <span>{userData?.gst_no}</span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="dataOuter">
                        <label>Preferred Clinic</label>
                        <span>{userData?.clinic?.clinic_name}</span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="dataOuter">
                        <label>Company</label>
                        <span>{userData?.company}</span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="dataOuter">
                        <label>Source</label>
                        <span>{userData?.source}</span>
                      </div>
                    </div>
                  </div>
                </div>



              </div>
            </div>


          </main>


        </div>
      </div>



    </React.Fragment>
  );
};

export default Profile;
