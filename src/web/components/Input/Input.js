import React, { useState, useEffect } from "react";

const Input = (props) => {
  return (
    <React.Fragment>
      <div className="loginFieldGroup">
        {props.label && props.label != "" && (
          <label>{props.label}</label>
        )}
        <div className={
          props.error
            ? "loginField error"
            : "loginField"
        }>
          {props.img && props.img != "" && (
            <img src={props.img} />
          )}
          <input
            placeholder={props.placeholder}
            name={props.name}
            id={props.id}
            value={props.value}
            type={props.type}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Input;
