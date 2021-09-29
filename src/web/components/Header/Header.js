import React, { useState, useEffect } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Link, useHistory, useLocation } from "react-router-dom";
import GO_BACK_IMAGE from "patient-portal-images/goBack.svg";
import { getProfileCompleted } from "patient-portal-utils/Service";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import Button from "patient-portal-components/Button/Button.js";
import { PROFILE_SETUP, PROFILE_COMPLETE, PET_PROFILE_COMPLETE, PET_PROFILE_COMPLETE_DASHBOARD } from "patient-portal-message";

const Header = (props) => {
  const history = useHistory();
  const location = useLocation();
  const isProfileAndPetCompleted = useStoreState((state) => state.dashboard.isProfileAndPetCompleted);
  const [showWelcome, setWelcomeText] = useState(false);
  const goToUrl = () => {
    history.push("/profile");
  };

  useEffect(() => {
    console.log(location.pathname);
    if (isProfileAndPetCompleted) {
      let isCompleted = getProfileCompleted();
      if (isCompleted?.isPetCompleted == 0 || isCompleted?.isProfileCompleted == 0) {
        if (location.pathname === "/dashboard") {
          setWelcomeText(true);
        }
      }
      else {
        setWelcomeText(false);
      }
    }

  }, [isProfileAndPetCompleted]);
  const handleNav = (type) => {
    console.log("Type", type);
    if (type == "book-appointment") {
      let isCompleted = getProfileCompleted();
      if (isCompleted && (isCompleted?.isPetCompleted == 0 || isCompleted?.isProfileCompleted == 0)) {

        if (isCompleted.isProfileCompleted == 0) {
          toast.success(<ToastUI message={PROFILE_COMPLETE} type={"Success"} />);
          history.push(`/edit-profile`);
        }
        else if (isCompleted.isPetCompleted == 0) {
          toast.success(<ToastUI message={PET_PROFILE_COMPLETE} type={"Success"} />);
          history.push(`/create-pet`);
        }

      }
      else {
        history.push(`/${type}`);
      }
    }
    else {
      if (type == "treatments") {
        props.rerender();
      }
      else {
        history.push(`/${type}`);
      }

    }

  }
  const handleDashboardNoti = () => {
    let isCompleted = getProfileCompleted();
      if (isCompleted && (isCompleted?.isPetCompleted == 0 || isCompleted?.isProfileCompleted == 0)) {

        if (isCompleted.isProfileCompleted == 0) {
          toast.success(<ToastUI message={PROFILE_COMPLETE} type={"Success"} />);
          history.push(`/edit-profile`);
        }
        else if (isCompleted.isPetCompleted == 0) {
          toast.success(<ToastUI message={PET_PROFILE_COMPLETE_DASHBOARD} type={"Success"} />);
          history.push(`/create-pet`);
        }

      }
  }
  return (
    <React.Fragment>
      {props.backEnabled && (!props.backTitle || !props.backAction) && (
        <a className="backTo" onClick={() => goToUrl()}>
          <img src={GO_BACK_IMAGE} /> Back to Profile
        </a>
      )}
      {props.backEnabled && props.backTitle && props.backAction && (
        <a className="backTo" onClick={() => handleNav(props.backAction)}>
          <img src={GO_BACK_IMAGE} /> {props.backTitle}
        </a>
      )}
      <div className="titleBtn">
        <h1 className="title">{props.heading}</h1>
        <div className="titleDiscription">{props.subHeading}</div>
        {props.hasBtn && (
          <Button
            type="primary"
            label={props.btnTitle}
            extraClasses=""
            onClick={() => handleNav(props.onClick)}
            icon={props.btnName}
          />
        )}
      </div>
      {showWelcome && <div className="box mb-4 welcomeText onHover" onClick={() => handleDashboardNoti()}>
        <span>Welcome to DCC PetConnect!</span>
        <p >Please set up your & your pet's profiles to have a better experience</p>
      </div>}

    </React.Fragment>
  );
};

export default Header;
