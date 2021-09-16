import React from "react";
import CAL_IMAGE from "patient-portal-images/appointment.svg";
import TIME_IMAGE from "patient-portal-images/time.svg";
const Other = (props) => {
  return (
    <React.Fragment>
      <div className="col-md-4">
        <div className="box appointmentDetail">
          {/* {JSON.stringify(props)} */}
          <section>
            <label> {props?.other?.type == "in_person" ? "Location" : "Doctor"}</label>
            <p>{props.other?.clinic_name}</p>
            <p>{props.other?.clinic_address}</p>
            <p>{(props.other?.provider_name != "Any") ? props.other?.provider_name : ""}</p>
            
          </section>
          <section>
            <label>Services</label>
            <p>
              <span>{props.other?.service_name}</span> - {props.other?.service_duration} {props.other?.service_duration && "minutes"} <br/>
              {props.other?.service_description}
            </p>
          </section>
          <section>
            <label>Date &amp; Time</label>
            <p className="d-flex mb-2 mt-2 align-items-start">
              <img src={CAL_IMAGE} />{" "}
              <span className="ml-1">
              {props.other?.date}
              </span>
            </p>
            <p className="d-flex align-items-start">
              <img src={TIME_IMAGE} />{" "}
              <span className="ml-1">{props.other?.slot}</span>
            </p>
          </section>
          <section>
            <label>Selected Pet</label>
            <p>
              <span>{props.other?.pet_name}</span> - {props.other?.species}
            </p>
          </section>
          <section>
            <label>Your Info</label>
            <p>{props.other?.name}</p>
            <p>{props.other?.email}</p>
            <p>{props.other?.phone}</p>
          </section>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Other;