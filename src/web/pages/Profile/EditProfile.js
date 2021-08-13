import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Header from "patient-portal-components/Header/Header.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import DEFAULT_USER_IMG from "patient-portal-images/default-user.png";
import EDIT_PROFILE_IMG from "patient-portal-images/edit-profile.svg";
import { useStoreActions, useStoreState } from "easy-peasy";
import { getLoggedinUserId } from "patient-portal-utils/Service";
import { Formik, ErrorMessage } from "formik";
import { useProfileValidation } from "patient-portal-utils/validations/profile/ProfileSchema";

import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import * as _ from "lodash";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";

const EditProfile = (props) => {
  const history = useHistory();
  const { ProfileSchema } = useProfileValidation();
  const initvalues = {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    phone_code: '',
    gender: '',
    nick_name: '',
    phone_code2: '',
    email_2: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    country: '',
    gst_no: '',
    source: '',
    preferred_clinic: '',
    company: ''
  };
  const [file, setFile] = useState("");
  const [userData, setUserData] = useState(initvalues);
  const [countries, setCountries] = useState([]);
  const [clinicsList, setClinicsList] = useState([]);
  const [loaderText, setLoaderText] = useState("Loading");
  const [showLoader, setShowLoader] = useState(false);
  const [phone, setPhone] = useState({ iso2: '', dialCode: '', phone: '' });
  const [phone2, setPhone2] = useState({ iso2: '', dialCode: '', phone: '' });

  const getMyProfile = useStoreActions((actions) => actions.profile.getMyProfile);
  const getClinics = useStoreActions((actions) => actions.profile.getClinics);
  const updateMyProfile = useStoreActions((actions) => actions.profile.updateMyProfile);
  const response = useStoreState((state) => state.profile.response);

  useEffect(async () => {
    await getMyProfile(getLoggedinUserId());
    await getClinics();
  }, []);

  useEffect(() => {
    if (response) {
      let { message, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        if(data?.filename){
          let payload = {...userData};
          payload.user_image = `${data.filename}`;
          setUserData(payload);
        }
        if (data?.clientData) {
          setUserData(data?.clientData);
        }
        if (data?.countries) {
          setCountries(data?.countries);
        }
        if (data?.clinics) {
          setClinicsList(data?.clinics);
        }
      }
    }
  }, [response]);


  const editUser = async (payload) => {

    let formData = new FormData();
    formData.append("id", payload?.id);
    formData.append("firstname", payload?.firstname);
    formData.append("lastname", payload?.lastname);
    formData.append("email", payload?.email);
    formData.append("phone", `${(phone.phone) ? phone.phone.replace(/[ `~!@#$%^&*()_|\-=?;:'",.<>\{\}\[\]\\\/]/gi, '') : ''}`);
    formData.append("countryCode", `${(phone.phone) ? "+" + phone.dialCode : ''}`);
    formData.append("gender", payload?.gender);
    formData.append("nick_name", payload?.nick_name);
    formData.append("phone_code2", `${(phone2.phone) ? "+" + phone2.dialCode : ''}`);
    formData.append("phoneNumber_2", `${(phone2.phone) ? phone2.phone.replace(/[ `~!@#$%^&*()_|\-=?;:'",.<>\{\}\[\]\\\/]/gi, '') : ''}`);
    formData.append("email_2", payload?.email_2);
    formData.append("address", payload?.address);
    formData.append("pincode", payload?.pincode);
    formData.append("city", payload?.city);
    formData.append("state", payload?.state);
    formData.append("country", payload.country);
    formData.append("gst_no", payload?.gst_no);
    formData.append("source", payload?.source);
    formData.append("preferred_clinic", payload?.preferred_clinic);
    formData.append("company", payload?.company);
    
    if (file && file !== undefined) {
      formData.append("profile_image", file);
    }
    await updateMyProfile(formData);
  }
  const onFileChange = async event => {
    const imageFile = event.target.files[0];
    if (imageFile) {

      if (!imageFile.name.match(/\.(jpg|jpeg|png|gif)$/)) {
        toast.error(<ToastUI message={'Please select a valid image.'} type={"Error"} />);
        return false;
      }
      setFile(imageFile);
    } else {
      toast.dismiss();
      toast.error(<ToastUI message={'Upload canceled, no files selected.'} type={"Error"} />);
    };
  };
  return (
    <React.Fragment>

      <div className="content_outer">
        <Sidebar activeMenu="profile" />
        <div className="right_content_col">
          <main>
            <Header
              backEnabled={true}
              heading={"Edit Profile"}
              subHeading={"Here we can add or edit pet information"}
              hasBtn={false}

            />

            <div className="box">
              <Formik
                enableReinitialize={true}
                initialValues={userData}
                onSubmit={async values => {
                  editUser(values);
                }}
                validationSchema={ProfileSchema}
              >
                {props => {
                  const {
                    values,
                    touched,
                    errors,
                    dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    handleReset
                  } = props;
                  return (
                    <form onSubmit={handleSubmit} className="profileForm">

                      <div className="editPic">
                        <img src={`${userData?.user_image ? process.env.REACT_APP_MEDIA_URL + userData.user_image : DEFAULT_USER_IMG}`} />
                        <a className="editPicOverlay">
                          <img src={EDIT_PROFILE_IMG} />
                          <input type="file" onChange={onFileChange} />
                        </a>
                      </div>

                      <div className="formSubtitle">Profile Information</div>

                      <div className="row mb-2">
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">First Name<span className="required">*</span></label>
                            <div className="fieldBox">
                              <input
                                className={
                                  errors.firstname && touched.firstname
                                    ? "fieldInput error"
                                    : "fieldInput"
                                }
                                placeholder="Enter first name"
                                id="firstname"
                                name="firstname"
                                type="text"
                                value={values.firstname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage name="firstname" component="span" className="errorMsg" />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Last Name<span className="required">*</span></label>
                            <div className="fieldBox">
                              <input
                                className={
                                  errors.lastname && touched.lastname
                                    ? "fieldInput error"
                                    : "fieldInput"
                                }
                                placeholder="Enter last name"
                                id="lastname"
                                name="lastname"
                                type="text"
                                value={values.lastname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage name="lastname" component="span" className="errorMsg" />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Email Address<span className="required">*</span></label>
                            <div className="fieldBox">
                              <input
                                className={
                                  errors.email && touched.email
                                    ? "fieldInput error"
                                    : "fieldInput"
                                }
                                placeholder="Enter email address"
                                id="email"
                                name="email"
                                type="text"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage name="email" component="span" className="errorMsg" />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="fieldOuter TelInput">
                            <label className="fieldLabel">Mobile Number<span className="required">*</span></label>
                            <div className="fieldBox">

                              {userData.phone_code &&
                                <IntlTelInput
                                disabled
                                  preferredCountries={['IN']}
                                  css={['intl-tel-input']}
                                  defaultValue={`${userData.phone_code}`}
                                  fieldName='phone'
                                  separateDialCode={`true`}
                                  autoComplete={`phone`}
                                  onPhoneNumberChange={(isValidNumber, phone, payload, fullNumber) => {
                                    let input = { ...phone };
                                    input = { iso2: payload.iso2, dialCode: payload.dialCode, phone: phone };
                                    setPhone(input);
                                  }}
                                  onSelectFlag={(inputFieled, phone, payload, isValidNumber) => {
                                    let input = { ...phone };
                                    input = { iso2: phone.iso2, dialCode: phone.dialCode, phone: inputFieled };
                                    setPhone(input);
                                  }}
                                  autoPlaceholder={true}
                                />
                              }
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Gender<span className="required">*</span></label>
                            <div className="fieldBox fieldIcon mt-2">
                              <label className="customRadio d-inline-block mr-3 mb-0">
                                <input type="radio" checked={values.gender === 'male'} name="gender" value={"male"}
                                  onChange={handleChange}
                                  onBlur={handleBlur} /> Male</label>
                              <label className="customRadio d-inline-block mb-0">
                                <input type="radio" checked={values.gender === 'female'} name="gender" value={"female"}
                                  onChange={handleChange}
                                  onBlur={handleBlur} /> Female</label>
                            </div>
                            <ErrorMessage name="gender" component="span" className="errorMsg" />

                          </div>
                        </div>
                      </div>

                      <div className="border-top mb-4"></div>

                      <div className="formSubtitle">Secondary Contact</div>

                      <div className="row mb-2">
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Contact Name</label>
                            <div className="fieldBox">
                              <input
                                className={
                                  errors.nick_name && touched.nick_name
                                    ? "fieldInput error"
                                    : "fieldInput"
                                }
                                id="nick_name"
                                name="nick_name"
                                type="text"
                                value={values.nick_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage name="nick_name" component="span" className="errorMsg" />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="fieldOuter TelInput">
                            <label className="fieldLabel">Mobile number</label>
                            <div className="fieldBox">
                              {userData.phone_code2 &&
                                <IntlTelInput
                                  preferredCountries={['IN']}
                                  css={['intl-tel-input']}
                                  defaultValue={`${userData.phone_code2}`}
                                  fieldName='phone2'
                                  separateDialCode={`true`}
                                  autoComplete={`phone2`}
                                  onPhoneNumberChange={(isValidNumber, phone, payload, fullNumber) => {
                                    let input = { ...phone2 };
                                    input = { iso2: payload.iso2, dialCode: payload.dialCode, phone: phone };
                                    setPhone2(input);
                                  }}
                                  onSelectFlag={(inputFieled, phone, payload, isValidNumber) => {
                                    let input = { ...phone2 };
                                    input = { iso2: phone.iso2, dialCode: phone.dialCode, phone: inputFieled };
                                    setPhone2(input);
                                  }}
                                  autoPlaceholder={true}
                                />
                              }
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Email Address</label>
                            <div className="fieldBox">
                              <input
                                className={
                                  errors.email_2
                                    ? "fieldInput error"
                                    : "fieldInput"
                                }
                                id="email_2"
                                name="email_2"
                                type="text"
                                value={values.email_2}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage name="email_2" component="span" className="errorMsg" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-top mb-4"></div>

                      <div className="formSubtitle">Additional Details</div>


                      <div className="row mb-2">
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Address</label>
                            <div className="fieldBox">
                              <input
                                className="fieldInput"
                                id="address"
                                name="address"
                                type="text"
                                value={values.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Pincode</label>
                            <div className="fieldBox">
                              <input
                                className="fieldInput"
                                id="pincode"
                                name="pincode"
                                type="text"
                                value={values.pincode}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">City</label>
                            <div className="fieldBox">
                              <input
                                className="fieldInput"
                                id="city"
                                name="city"
                                type="text"
                                value={values.city}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">State</label>
                            <div className="fieldBox">
                              <input
                                className="fieldInput"
                                id="state"
                                name="state"
                                type="text"
                                value={values.state}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Country</label>
                            <div className="fieldBox">
                              <select type="text"
                                name="country"
                                id="country"
                                className="fieldInput"
                                value={values.country}
                                onChange={handleChange}
                                onBlur={handleBlur}>
                                <option value="">Select Country</option>
                                {countries && countries.map((val, index) => {
                                  return (<option key={index} value={val.country_name}>{val.country_name}</option>)
                                })}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">GSTIN</label>
                            <div className="fieldBox">
                              <input
                                className="fieldInput"
                                id="gst_no"
                                name="gst_no"
                                type="text"
                                value={values.gst_no}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Preferred Clinic</label>
                            <div className="fieldBox">
                              <select type="text"
                                name="preferred_clinic"
                                id="preferred_clinic"
                                className="fieldInput"
                                value={values.preferred_clinic}
                                onChange={handleChange}
                                onBlur={handleBlur}>
                                <option value="">Select Clinic</option>
                                {clinicsList && clinicsList.map((val, index) => {
                                  return (<option key={index} value={val.id}>{val.clinic_name}</option>)
                                })}
                              </select>


                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Company</label>
                            <div className="fieldBox">
                              <input
                                className="fieldInput"
                                id="company"
                                name="company"
                                type="text"
                                value={values.company}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Source</label>
                            <div className="fieldBox">
                              <input
                                className="fieldInput"
                                id="source"
                                name="source"
                                type="text"
                                value={values.source}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 mb-3">
                        <button type="submit" className="button primary  mr-2">Save</button>
                        <button className="button default " onClick={() => history.push("/profile")}>Cancel</button>
                      </div>

                    </form>
                  );
                }}
              </Formik>


            </div>
          </main>
        </div>
      </div>

      {showLoader && (
        <div className="loaderOuter">
          <div className="loaderOuter">
            <div className="loader">
              <div className="spinner-border text-primary" role="status"></div>
              <p>{loaderText} ...</p>
            </div>
          </div>
        </div>
      )}


      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </React.Fragment>
  );
};

export default EditProfile;
