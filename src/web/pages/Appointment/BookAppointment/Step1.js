import React, { useState } from "react";

const Step1 = (props) => {
    return (
        <div className="appointmentOption text-center">
            <div className="subtitle mb-5">
                Would you want to visit one of our clinics with your pet or
                prefer a virtual telehealth appointment?
            </div>
            <div className="appointmentOptionBtn">
                <button className="button primary mr-2">Clinic</button>
                <button className="button secondary">Telehealth</button>
            </div>
        </div> 
    );
};
export default Step1;
