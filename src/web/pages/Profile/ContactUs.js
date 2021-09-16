import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useConactUsValidation } from "patient-portal-utils/validations/profile/ContactUsSchema";
import { Formik, ErrorMessage } from "formik";
import { useStoreActions, useStoreState } from "easy-peasy";
import _ from "lodash";
import { getLoggedinUserId, getProfileCompleted } from "patient-portal-utils/Service";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import Header from "patient-portal-components/Header/Header.js";


// https://stackoverflow.com/questions/57594045/validation-using-formik-with-yup-and-react-select
const ContactUs = (props) => {
  const { ContactUsSchema } = useConactUsValidation();
  const history = useHistory();
  const [formData, setFormData] = useState({
    client_id: getLoggedinUserId(),
    title: "",
    body: ""
  });

  const contactUs = useStoreActions((actions) => actions.pet.contactUs);
  const resetContactUs = useStoreActions((actions) => actions.pet.resetContactUs);
  const response = useStoreState((state) => state.pet.response);
  const contact = async (payload) => {
    await contactUs(payload);
  }

  useEffect(() => {
    if (response) {
      let { message, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        resetContactUs();
        history.push("/profile");
      }
    }
  }, [response]);



  return (
    <React.Fragment>
      <div className="content_outer">
        <Sidebar activeMenu="profile" />
        <div className="right_content_col">
          <main>

          <Header
              heading={"Contact Us"}
              subHeading={"Here you can write your queries"}
             
            />
            <div className="box">
              <Formik
                enableReinitialize={true}
                initialValues={formData}
                onSubmit={async (values, { resetForm }) => {
                  //setFormData(JSON.stringify(values, null, 2))
                  contact(values);
                  resetForm({});
                }}
                validationSchema={ContactUsSchema}
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
                    handleReset,
                    setFieldValue
                  } = props;
                  return (
                    <form className="profileForm pl-0" onSubmit={handleSubmit}>

                     

                      <div className="row">
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Subject<span className="required">*</span></label>
                            <div className="fieldBox">
                              <input
                                className={
                                  errors.title && touched.title
                                    ? "fieldInput error"
                                    : "fieldInput"
                                }
                                placeholder="Subject"
                                id="title"
                                name="title"
                                type="text"
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage name="title" component="span" className="errorMsg" />
                            </div>
                          </div>
                        </div>
                        </div>
                        <div className="row">
                        <div className="col-lg-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Message<span className="required">*</span></label>
                            <div className="fieldBox">
                              <textarea
                                className={
                                  errors.body && touched.body
                                    ? "fieldInput contactMessage error"
                                    : "fieldInput contactMessage"
                                }
                                placeholder="Subject"
                                id="body"
                                name="body"
                                type="text"
                                value={values.body}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage name="body" component="span" className="errorMsg" />
                            </div>
                          </div>
                        </div>
                      </div>



                      <div className="">
                        <button type="submit" className="button primary  mr-2">Submit</button>
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

    </React.Fragment>
  );
};
export default ContactUs;
