import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "patient-portal-components/Button/Button.js";

const Overlay = (props) => {
  const { title, closeOverlay, subTitle, submitOverlay } = props;
  return (
    <React.Fragment>
      <div className="popupOverlay">
        <div className="popupWrapper">
          <div className="popupTitle mb-3">
            Notification Settings
            <a href className="cross">
              <svg
                width={23}
                height={23}
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.25 5.75L5.75 17.25"
                  stroke="#444444"
                  strokeWidth="2.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.75 5.75L17.25 17.25"
                  stroke="#444444"
                  strokeWidth="2.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
          <p className="p-text mb-4">
            We recommend you keep push notifications turned on to keep you
            up-to-date on your pets’ health.
          </p>
          <div className="overlay-body"> 
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Overlay;
