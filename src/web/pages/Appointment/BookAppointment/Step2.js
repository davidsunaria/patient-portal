import React, { useState } from "react";

const Step2 = (props) => {
    return (
        <div className="row">
            <div className="col-md-8">
                {/* {JSON.stringify(props)} */}
                <div className="box">
                    <div className="checkboxOuter">
                        {
                            props.data && props.data.length > 0 && props.data.map((val, index) => (
                                <label key={index} className="customCheckbox">
                                    <input type="radio" onChange={(e) => props.onSubmit(e)} name="client_id" value={val?.id} /> {val?.clinic_name}
                                </label>
                            ))
                        }
                    </div>
                </div>
                <div className="appointmentBtns">
                    <button className="button default mr-2" onClick={() => props.onBack(1)}>Back</button>
                    <button className="button primary ml-auto" onClick={() => props.onNext(3)}>Continue</button>
                </div>
            </div>
            <div className="col-md-4">
                <div className="box appointmentDetail">
                    <section>
                        <label>Location</label>
                        <p>DCC Animal Hospital - Delhi Ms. Deepika</p>
                    </section>
                    <section>
                        <label>Services</label>
                        <p>
                            <span>Teleconsultation</span> - 30 minutes
                            Telehealth Consultation
                        </p>
                    </section>
                    <section>
                        <label>Date &amp; Time</label>
                        <p className="d-flex mb-2 mt-2 align-items-start">
                            <img src="assets/img/calendar.svg" />{" "}
                            <span className="ml-1">
                                Wednesday, June 30th 2021
                            </span>
                        </p>
                        <p className="d-flex align-items-start">
                            <img src="assets/img/time.svg" />{" "}
                            <span className="ml-1">10:00 am</span>
                        </p>
                    </section>
                    <section>
                        <label>Select Pet</label>
                        <p>
                            <span>Rolly</span> - Cat
                        </p>
                    </section>
                    <section>
                        <label>Your Info</label>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
export default Step2;
