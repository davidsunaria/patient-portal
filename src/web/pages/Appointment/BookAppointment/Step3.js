import React, { useState } from "react";

const Step3 = (props) => {
    return (
        <div className="row">
            <div className="col-md-8">
                <div className="box accordionOuter">
                    <div className="accordionHeader">
                        Helping Hands <img src="assets/img/down-arrow.svg" />
                    </div>
                    <div className="accordionContent">
                        <div className="checkboxOuter">
                            <label className="customCheckbox d-flex justify-content-between">
                                <input type="checkbox" name />
                                <span className="serviceName">
                                    DCC Animal Hospital - Gurgaon
                                </span>
                                <span className="serviceTime">30 Minutes</span>
                            </label>
                            <label className="customCheckbox d-flex justify-content-between">
                                <input type="checkbox" name />
                                <span className="serviceName">
                                    DCC Animal Hospital - Delhi
                                </span>
                                <span className="serviceTime">30 Minutes</span>
                            </label>
                            <label className="customCheckbox d-flex justify-content-between">
                                <input type="checkbox" name />
                                <span className="serviceName">DCC Japan</span>
                                <span className="serviceTime">30 Minutes</span>
                            </label>
                            <label className="customCheckbox d-flex justify-content-between">
                                <input type="checkbox" name />
                                <span className="serviceName">DCC Japan</span>
                                <span className="serviceTime">30 Minutes</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="box accordionOuter">
                    <div className="accordionHeader">
                        Helping Hands <img src="assets/img/down-arrow.svg" />
                    </div>
                    <div className="accordionContent">
                        <div className="checkboxOuter">
                            <label className="customCheckbox d-flex justify-content-between">
                                <input type="checkbox" name />
                                <span className="serviceName">
                                    DCC Animal Hospital - Gurgaon
                                </span>
                                <span className="serviceTime">30 Minutes</span>
                            </label>
                            <label className="customCheckbox d-flex justify-content-between">
                                <input type="checkbox" name />
                                <span className="serviceName">
                                    DCC Animal Hospital - Delhi
                                </span>
                                <span className="serviceTime">30 Minutes</span>
                            </label>
                            <label className="customCheckbox d-flex justify-content-between">
                                <input type="checkbox" name />
                                <span className="serviceName">DCC Japan</span>
                                <span className="serviceTime">30 Minutes</span>
                            </label>
                            <label className="customCheckbox d-flex justify-content-between">
                                <input type="checkbox" name />
                                <span className="serviceName">DCC Japan</span>
                                <span className="serviceTime">30 Minutes</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="subtitle mt-4 mb-3">Select Doctor</div>
                <p className="p-text">
                    We recommend selecting “Any” doctor to give you the most
                    available options for dates &amp; timeslots. Please select a
                    specific doctor only if you specifically need to meet them.
                    If you are unable to find a suitable timeslot for your
                    selected doctor, please try “Any” or another doctor.
                </p>
                <div className="row my-3">
                    <div className="col-xl-4 col-md-6">
                        <div className="fieldOuter mb-0">
                            <div className="fieldBox">
                                <select type="text" className="fieldInput">
                                    <option>Any</option>
                                    <option>Ms. Kiranjot kaur</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dateTimeOuter">
                    <div className="AppointmentDate">
                        <div className="highlightDate">
                            Jun
                            <br />
                            30
                        </div>
                        <label>
                            Wednesday
                            <br />
                            June 30th 2021
                        </label>
                    </div>
                    <div className="AppointmentDate timeSlot">
                        <label>10:00 am</label>
                        <div className="timeslotPopup">
                            <span>10:00 am</span>
                            <span>10:05 am</span>
                            <span>10:15 am</span>
                            <span>10:20 am</span>
                            <span>10:30 am</span>
                            <span>10:45 am</span>
                            <span>11:15 am</span>
                            <span>11:30 am</span>
                            <span>11:45 am</span>
                            <span>12:00 pm</span>
                            <span>12:15 pm</span>
                            <span>12:30 pm</span>
                        </div>
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
export default Step3;
