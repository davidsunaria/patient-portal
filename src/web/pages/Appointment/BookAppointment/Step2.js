import React, { useState, useEffect } from "react";
import Other from "patient-portal-pages/Appointment/BookAppointment/Other.js"
import I_IMAGE from "patient-portal-images/i.svg";
import { useStoreActions, useStoreState } from "easy-peasy";
import Contact from "patient-portal-components/Appointment/Contact";
const Step2 = (props) => {
    const [contactModal, setContactModal] = useState(false);
    const [clinicData, setClinicData] = useState({});
    const getClinicInfo = useStoreActions((actions) => actions.appointment.getClinicInfo);
    const response = useStoreState((state) => state.appointment.response);

    const showContact = async (e) => {
        if (!e.target) {
            await getClinicInfo(e);
        }
        setContactModal(!contactModal);
    }
    useEffect(() => {
        if (response) {
            let { status, statuscode, data } = response;
            if (statuscode && statuscode === 200) {
                if (data?.clinic) {
                    setClinicData(data?.clinic);
                }
            }
        }
    }, [response]);

    return (
        <div className="row">
            <Contact data={clinicData} modal={contactModal} toggle={showContact} />
            <div className="col-md-8">
                {/* {JSON.stringify(props)} */}
                <div className="box">
                    <div className="checkboxOuter">
                        {
                            props.data && props.data.length > 0 && props.data.map((val, index) => (
                                <label key={index} className="customCheckbox">
                                    <input type="radio" checked={(val?.id == props.formData?.clinic_id) ? true : false} onChange={(e) => props.onSubmit(e, val)} name="client_id" value={val?.id} /> {val?.clinic_name}
                                    <img onClick={() => showContact(val?.id)} className="infoIcon" src={I_IMAGE} />
                                </label>
                            ))
                        }
                    </div>
                </div>
                <div className="appointmentBtns">
                    <button className="button secondary mr-2" onClick={() => props.onBack(1)}>Back</button>
                    <button className="button primary ml-auto" onClick={() => props.onNext(3)}>Continue</button>
                </div>
            </div>
            <Other other={props.other} />

        </div>
    );
};
export default Step2;
