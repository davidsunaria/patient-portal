import React, { useState } from "react";

const Step4 = (props) => {
    return (
        <div>
            <div className="subtitle mt-4 mb-3">Select Pet</div>
            <div className="row">
                <div className="col-md-8">
                    <div className="box">
                        <div className="checkboxOuter">
                            <label className="customCheckbox d-flex justify-content-between">
                                <input type="checkbox" name />
                                <span className="serviceName">
                                    Browno
                                    <label className="appointmentSpecies">
                                        Dog
                                    </label>
                                </span>
                            </label>
                            <label className="customCheckbox d-flex justify-content-between">
                                <input type="checkbox" name />
                                <span className="serviceName">
                                    Rolly
                                    <label className="appointmentSpecies">
                                        Cat
                                    </label>
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className="subtitle mt-4 mb-3">
                        Add Appointment Note
                    </div>
                    <div className="box">
                        <textarea
                            className="appointmentNote"
                            defaultValue={""}
                        />
                    </div>
                    <div className="appointmentBtns">
                        <button className="button default mr-2">Back</button>
                        <button className="button primary ml-auto">
                            Continue
                        </button>
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
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Step4;
