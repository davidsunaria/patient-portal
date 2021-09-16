import React, { useState, useEffect } from 'react';
import TOAST_CROSS_IMG from "patient-portal-images/cross1.svg";

const ToastUI = (props) => { 
  
  return (
    <React.Fragment>
      <div className="successMessage">
        <div className={props.type == "Success" ? "successIcon" : "errorIcon"}>
        {props.type == "Success" ? <i className="fa fa-check" /> : <i className="fa fa-times" />}
        </div>
        {/* <h5>{props.type}</h5> */}
        <p>{props.message}</p>
        {/* <a className="alertCross"><img src={TOAST_CROSS_IMG} /></a> */}
      </div>
    </React.Fragment>
  );
};

export default ToastUI;
