import React, { useState } from "react";
import Other from "patient-portal-pages/Appointment/BookAppointment/Other.js"

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
                                    <input type="radio" checked={ (val?.id == props.formData?.clinic_id) ? true : false} onChange={(e) => props.onSubmit(e,val)} name="client_id" value={val?.id} /> {val?.clinic_name}
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
            <Other other={props.other}/>

        </div>
    );
};
export default Step2;
