import React, { useState, useEffect } from "react";
import CALENDAR_IMG from "patient-portal-images/calendar.svg";
import ADD_IMG from "patient-portal-images/add.svg";
import EDIT_IMAGE_BTN from "patient-portal-images/editProfileBtn.svg";

const Button = (props) => {
  const [btnClass, setBtnClass] = useState("blueBtn");
  const [loadingMsg, setLoadingMsg] = useState("Processing...");

  useEffect(() => {
    let className = props.type;

    if (props.extraClasses) {
      className = className + " " + props.extraClasses;
    }
    setBtnClass(className);
  }, [props]);

  return (
    <React.Fragment>
      <button
        type="button"
        className={`button ${btnClass}`}
        onClick={() => props.onClick()}
      >
        {props.icon && props.icon === "calendar" && <img src={CALENDAR_IMG} />}
        {props.icon && props.icon === "plus" && <img src={ADD_IMG} />}
        {props.icon && props.icon === "edit" && <img src={EDIT_IMAGE_BTN} />}
        {props.label}
        {props.disableBtn && (
          <div className="spinner-border " role="status">
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </button>
    </React.Fragment>
  );
};

export default Button;
