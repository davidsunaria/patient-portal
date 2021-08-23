import React, { useState, useEffect } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Link, useHistory, useLocation } from "react-router-dom";
import GO_BACK_IMAGE from "patient-portal-images/goBack.svg";
import { getProfileCompleted } from "patient-portal-utils/Service";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import Button from "patient-portal-components/Button/Button.js";

const Header = (props) => {
  const history = useHistory();

  const goToUrl = () => {
    history.push("/profile");
  };

  const handleNav = (type) => {
    console.log("Type", type);
    if (type == "book-appointment") {
      let isCompleted = getProfileCompleted();
      if (isCompleted.isPetCompleted == 0 || isCompleted.isProfileCompleted == 0) {
        toast.error(<ToastUI message={"Please set up yout and you pet\'s profile to have a better experience"} type={"Error"} />);
        history.push(`/create-pet`);
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
    </React.Fragment>
  );
};

export default Header;
