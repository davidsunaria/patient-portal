import React, { useState } from "react";

const AppointmentCard = (props) => {
    return (
        <div className="box mb-2">
            <div className="appointmentList">
                <div className="dropdownArrow">
                    <ul className="dropdownOption">
                        <li>
                            <a>
                                <img src="assets/img/calendarDrop.svg" />
                                Reschedule
                            </a>
                        </li>
                        <li>
                            <a>
                                <img src="assets/img/cancelDrop.svg" />
                                Cancel
                            </a>
                        </li>
                        <li>
                            <a>
                                <img src="assets/img/contactDrop.svg" />
                                Contact
                            </a>
                        </li>
                        <li>
                            <a>
                                <img src="assets/img/joinDrop.svg" />
                                Join
                            </a>
                        </li>
                        <li>
                            <a>
                                <img src="assets/img/directionDrop.svg" />
                                Get Direction
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="row">
                    <div className="col pb-2">
                        <label>Clinic</label>
                        <h5>DCC Animal Hospital - Delhi</h5>
                        <span>2 June 2021, 3:30 PM</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-3 col-sm-6 py-2">
                        <label>Services</label>
                        <p>Consultation (Re-Visit)</p>
                    </div>
                    <div className="col-lg-3 col-sm-6 py-2">
                        <label>Doctor</label>
                        <p>Dr. Hemant Kumar</p>
                    </div>
                    <div className="col-lg-3 col-sm-6 py-2">
                        <label>Pet</label>
                        <p>Perro</p>
                    </div>
                    <div className="col-lg-3 col-sm-6 py-2">
                        <label>Type</label>
                        <p>Telehealth</p>
                    </div>
                    <div className="col-lg-3 col-sm-6 py-2">
                        <label>Note</label>
                        <p>General Checkup</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AppointmentCard;
