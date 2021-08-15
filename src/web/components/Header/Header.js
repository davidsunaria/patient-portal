import React, { useState, useEffect } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Link, useHistory, useLocation } from "react-router-dom";
import GO_BACK_IMAGE from "patient-portal-images/goBack.svg";

import Button from "patient-portal-components/Button/Button.js";

const Header = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [showSubmenu, setShowSubMenu] = useState(false);
  const [hideLeftSection, setHideLeftSection] = useState(false);
  const [menu, setMenu] = useState("");

  const goToUrl = () => {
    history.push("/profile");
  };

  const handleNav = (type) => {
    history.push(`/${type}`);
  }
  return (
    <React.Fragment>
      {props.backEnabled && (!props.backTitle || !props.backAction ) && (
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
