import React, { useState } from "react";

const Step2 = (props) => {
    return (
        <div className="row">
            <div className="col-md-8">
                <div className="box">
                    <div className="checkboxOuter">
                        <label className="customCheckbox">
                            <input type="checkbox" name /> DCC Animal Hospital -
                            Gurgaon
                        </label>
                        <label className="customCheckbox">
                            <input type="checkbox" name /> DCC Animal Hospital -
                            Delhi
                        </label>
                        <label className="customCheckbox">
                            <input type="checkbox" name /> DCC Japan
                        </label>
                        <label className="customCheckbox">
                            <input type="checkbox" name /> DCC Apollo
                        </label>
                        <label className="customCheckbox">
                            <input type="checkbox" name /> Patient Portal Clinic
                        </label>
                    </div>
                </div>
                <div className="appointmentBtns">
                    <button className="button default mr-2">Back</button>
                    <button className="button primary ml-auto">Continue</button>
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
