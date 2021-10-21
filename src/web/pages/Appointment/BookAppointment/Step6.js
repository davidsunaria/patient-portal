import React, { useState, useEffect } from "react";
import { getLoggedinUserId, showFormattedDate, formatDate, setLastPetId } from "patient-portal-utils/Service";
import { useStoreActions, useStoreState } from "easy-peasy";
import Other from "patient-portal-pages/Appointment/BookAppointment/Other.js"
import EDIT_PROFILE_IMG from "patient-portal-images/edit-profile.svg";

const Step6 = (props) => {
   
    return (
        <div>
           
            <div className="row">
                <div className="col-md-8">
                    
                    <div className="subtitle mt-4 mb-3">
                        Add Appointment Note
                    </div>
                    <div className="box">
                        <textarea
                        placeholder="Optional"
                            value={props.formData?.appointment_notes}
                            name="appointment_notes"
                            className="appointmentNote"
                            onChange={(e) => props.onSubmit(e)}
                        />
                    </div>


                    <div className="appointmentBtns">
                        <button className="button secondary mr-2" onClick={() => props.onBack(5)}>Back</button>
                        <button className="button primary ml-auto" onClick={() => props.onNext(7)}>
                            Continue
                        </button>
                    </div>
                </div>
                <Other other={props.other} />
            </div>
        </div>
    );
};
export default Step6;
