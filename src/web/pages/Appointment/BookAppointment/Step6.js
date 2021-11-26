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
                    <p className="p-text mb-3">Please help us understand your case in more detail prior to the appointment. This field can be left blank if not needed</p>
                    <div className="box">
                        <textarea
                            placeholder="Type your answer here"
                            value={props.formData?.appointment_notes}
                            name="appointment_notes"
                            className="appointmentNote"
                            onChange={(e) => props.onSubmit(e)}
                        />
                    </div>
                    {props.formData?.collect_payment_before_booking == 1 && props.formData?.payment_amount > 0 &&
                        <>
                            <div className="subtitle mt-4 mb-3">
                                Payment
                            </div>
                            <div className="box">
                                <p className="p-text mb-3">You will be charged INR {props.formData?.payment_amount} as a prepayment towards booking this appointment.</p>
                            </div>
                        </>
                    }

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
