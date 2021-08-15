import React, { useState } from "react";

const Step5 = (props) => {
    return (
        <div className="row">
            <div className="col-md-12">
                <div className="box confirmAppointment">
                    <div className="ConfirmSubtitle">
                        Your appointment has been confirmed.
                    </div>

                    <div className="row">
                        <div className="col-xl-4 col-md-6">
                            <div className="appointmentConfirmSection">
                                <div className="appointmentConfirmTitle">
                                    Facility
                                </div>
                                <div className="appointmentConfirmClinic">
                                    DCC Animal Hospital - Delhi
                                </div>
                                <div className="appointmentConfirmText">
                                    Vasant Vihar, Street no 8, Near Apollo
                                    Munich,
                                </div>

                                <div className="appointmentConfirmIcons">
                                    <a>
                                        <img src="assets/img/appointment-calendar.svg" />
                                    </a>
                                    <a>
                                        <img src="assets/img/appointment-contact.svg" />
                                    </a>
                                    <a>
                                        <img src="assets/img/appointment-location.svg" />
                                    </a>
                                </div>
                            </div>
                            <div className="appointmentConfirmSection">
                                <div className="appointmentConfirmTitle">
                                    Service
                                </div>
                                <div className="appointmentConfirmText">
                                    <b>Teleconsultation</b> - 30 minutes
                                    Telehealth Consultation
                                </div>
                            </div>
                            <div className="appointmentConfirmSection">
                                <div className="appointmentConfirmTitle">
                                    Client Info
                                </div>
                                <div className="appointmentConfirmText">
                                    Name: Prince Kumar
                                </div>
                                <div className="appointmentConfirmText">
                                    Email: prince.16565@gmail.com
                                </div>
                                <div className="appointmentConfirmText">
                                    Phone: +919876104457
                                </div>
                            </div>
                            <div className="appointmentConfirmSection">
                                <div className="appointmentConfirmTitle">
                                    Pet Info
                                </div>
                                <div className="appointmentConfirmText">
                                    Name: Rolly
                                </div>
                                <div className="appointmentConfirmText">
                                    Breed: American Cat
                                </div>
                                <div className="appointmentConfirmText">
                                    Age: 4M
                                </div>
                            </div>
                            <div className="appointmentConfirmSection border-0">
                                <div className="appointmentConfirmTitle">
                                    Date & Time
                                </div>
                                <div className="appointmentConfirmText">
                                    Wednesday, June 30th 2021 <br />
                                    10:00 am
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="appointmentBtns m-0">
                        <button className="button primary mr-2" onClick={() => props.onBack(1)}>Back</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Step5;
