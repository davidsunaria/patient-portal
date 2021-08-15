import React, { useState } from "react";

const Step1 = (props) => {

    const handleSubmit = () => {

    }
    return (
        <div className="appointmentOption text-center">
            <div className="subtitle mb-5">
                Would you want to visit one of our clinics with your pet or
                prefer a virtual telehealth appointment?
            </div>
            <div className="appointmentOptionBtn">
                <button className="button primary mr-2" onClick={() => props.onSubmit('in_person')}>Clinic</button>
                <button className="button secondary" onClick={() => props.onSubmit('virtual')}>Telehealth</button>
            </div>
        </div> 
    );
};
export default Step1;
