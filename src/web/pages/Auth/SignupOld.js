import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import ReactDOM from "react-dom";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";

import Input from "patient-portal-components/Input/Input.js";
import Button from "patient-portal-components/Button/Button.js";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import Header from "patient-portal-components/Header/Header.js";
import Question from "patient-portal-components/Question/Question.js";
import Overlay from "patient-portal-components/Overlay/Overlay.js";

import QuestionDetail from "patient-portal-components/Question/QuestionDetail.js";
import { useStoreActions, useStoreState } from "easy-peasy";
import {} from "patient-portal-message";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = (props) => {
  const history = useHistory();
  const [allQuestions, setAllQuestions] = useState([]);

  //const intake = useStoreState((state) => state.doctor.intake);
  //const getIntake = useStoreActions((actions) => actions.doctor.getIntake);
  let { id } = useParams();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [validPassword, setValidPassword] = useState(true);
  const [btnClicked, setBtnClicked] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const [numberError, setNumberError] = useState(false);
  const [lowerCaseError, setLowerCaseError] = useState(false);
  const [upperCaseError, setUpperCaseError] = useState(false);
  const [specialCharError, setSpecialCharError] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  //const createUser = useStoreActions((actions) => actions.doctor.createUser);

  const signupUser = async () => {};

  const handlePasswordChange = (val) => {
    setValidPassword(true);
    setLengthError(false);
    setNumberError(false);
    setSpecialCharError(false);
    setUpperCaseError(false);
    setLowerCaseError(false);
    setPassword(val);
    if (val != "") {
      if (val.length < 8) {
        setLengthError(true);
        setValidPassword(false);
      }

      let re = /[0-9]/;
      if (!re.test(val)) {
        setNumberError(true);
        setValidPassword(false);
      }
      re = /[^A-Za-z 0-9]/g;
      if (!re.test(val)) {
        setSpecialCharError(true);
        setValidPassword(false);
      }
      re = /[A-Z]/;
      if (!re.test(val)) {
        setUpperCaseError(true);
        setValidPassword(false);
      }
      re = /[a-z]/;
      if (!re.test(val)) {
        setLowerCaseError(true);
        setValidPassword(false);
      }
    }
  };

  return (
    <React.Fragment>
      <div className="loginMain">
        <div className="loginOuter">
          <div className="loginLogo">
            <img src="images/logo.png" />
          </div>
          <div className="loginTitle">Signup</div>

          <div className="row">
            <div className="col-sm-12 ">
              <div className={emailError ? "fieldOuter error" : "fieldOuter"}>
                <label className="fieldLabel">Email Address</label>
                <div className="inputOuter pr-4">
                  <input
                    className="inputField"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email Address"
                  />
                  <i className="fa fa-envelope fieldIcon" />
                </div>
              </div>
            </div>
            <div className="col-sm-12 ">
              <div
                className={
                  emailError ? "fieldOuter mb-4 error" : "fieldOuter mb-4"
                }
              >
                <label className="fieldLabel">Enter Password</label>
                <div className="inputOuter pr-4">
                  <input
                    className="inputField"
                    type="password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="Enter Password"
                  />
                  <i className="fa fa-eye-slash fieldIcon" />
                  {password != "" && !validPassword && (
                    <div className="customDrop">
                      <p>Password must meet the following things:</p>
                      <div
                        className={
                          lengthError ? "dropMsg error" : "dropMsg success"
                        }
                      >
                        <i
                          className={
                            lengthError ? "fa fa-times" : "fa fa-check"
                          }
                        ></i>{" "}
                        Must contain at least 8 characters!
                      </div>
                      <div
                        className={
                          numberError ? "dropMsg error" : "dropMsg success"
                        }
                      >
                        <i
                          className={
                            numberError ? "fa fa-times" : "fa fa-check"
                          }
                        ></i>{" "}
                        Must contain at least one number (0-9)!.
                      </div>
                      <div
                        className={
                          specialCharError ? "dropMsg error" : "dropMsg success"
                        }
                      >
                        <i
                          className={
                            specialCharError ? "fa fa-times" : "fa fa-check"
                          }
                        ></i>{" "}
                        Must contain at least one special character!.
                      </div>
                      <div
                        className={
                          upperCaseError ? "dropMsg error" : "dropMsg success"
                        }
                      >
                        <i
                          className={
                            upperCaseError ? "fa fa-times" : "fa fa-check"
                          }
                        ></i>{" "}
                        Must contain at least one uppercase letter (A-Z)!.
                      </div>
                      <div
                        className={
                          lowerCaseError ? "dropMsg error" : "dropMsg success"
                        }
                      >
                        <i
                          className={
                            lowerCaseError ? "fa fa-times" : "fa fa-check"
                          }
                        ></i>{" "}
                        Must contain at least one lowercase letter (a-z)!.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              confirmPasswordError ? "fieldOuter mb-4 error" : "fieldOuter mb-4"
            }
          >
            {" "}
            <label className="fieldLabel">Confirm Password</label>
            <div className="inputOuter pr-4">
              <input
                className="inputField"
                type="password"
                placeholder="Enter Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <i className="fa fa-eye-slash fieldIcon" />
            </div>
          </div>
          <button
            className={btnClicked ? "themeBtn disabled" : "themeBtn"}
            onClick={() => (!btnClicked ? signupUser() : {})}
            disabled={btnClicked}
          >
            Sign Up
            {btnClicked && (
              <div className="ml-10 spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </button>
          <div className="alreadyAccount">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </div>
      </div>

      {/*{showDelete && (
        <Overlay
          title={"Are you sure?"}
          subTitle={"Are you sure you want to delete this questionnaire?"}
          closeOverlay={() => setShowDelete(false)}
          cancelOverlay={() => setShowDelete(false)}
          submitOverlay={() => deleteFormCall()}
          disableBtn={disableButton}
          isDelete={true}
        ></Overlay>
      )}*/}
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

export default Signup;
