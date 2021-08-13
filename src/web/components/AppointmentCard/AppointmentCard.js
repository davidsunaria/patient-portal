import React, { useState, useEffect } from "react";
import CALENDER_IMAGE from "patient-portal-images/calendarDrop.svg";
import CANCEL_IMAGE from "patient-portal-images/cancelDrop.svg";
import CONTACT_IMAGE from "patient-portal-images/contactDrop.svg";
import JOIN_IMAGE from "patient-portal-images/joinDrop.svg";
import DIRECTION_IMAGE from "patient-portal-images/directionDrop.svg";
import { useStoreActions, useStoreState } from "easy-peasy";
import { formatDate } from "patient-portal-utils/Service";
import RescheduleAppointment from "patient-portal-components/Appointment/RescheduleAppointment";

const AppointmentCard = (props) => {
    const [modal, setModal] = useState(false);
    const [modalData, setModalData] = useState({});
    const [clinicData, setClinicData] = useState({});
    const getClinicInfo = useStoreActions((actions) => actions.appointment.getClinicInfo);
    const isRescheduled = useStoreState((state) => state.appointment.isRescheduled);
    const response = useStoreState((state) => state.appointment.response);

    const toggle = (val) => {
        setModal(!modal);
        setModalData(val);
    };
    useEffect(() => {
        if(isRescheduled){
            setModal(!modal);
        }
    }, [isRescheduled]);
    const showContact = async(clinicId) => {
        await getClinicInfo(clinicId);
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
        <React.Fragment>
            <RescheduleAppointment data={modalData} modal={modal} toggle={toggle} />

            {props.data && props.data.length > 0 ? (
                props.data.map((val, index) => (
                    <div key={index} className="box mb-2">
                        <div className="appointmentList">
                            <div className="dropdownArrow">
                                <ul className="dropdownOption">
                                
                                    {props.type == "upcoming" && val.status != "canceled" && <li>
                                        <a className="onHover" onClick={() => toggle(val)}>
                                            <img src={CALENDER_IMAGE} />
                                            Reschedule
                                        </a>
                                    </li>
                                    }
                                    {props.type == "upcoming" && <li>
                                        <a>
                                            <img src={CANCEL_IMAGE} />
                                            Cancel
                                        </a>
                                    </li>}
                                    <li>
                                        <a onClick={() => showContact(val?.clinic_id)}>
                                            <img src={CONTACT_IMAGE}  />
                                            Contact
                                        </a>
                                    </li>
                                    {props.type == "upcoming" && <li>
                                        <a>
                                            <img src={JOIN_IMAGE} />
                                            Join
                                        </a>
                                    </li>}
                                    {props.type == "past" && <li>
                                        <a>
                                            <img src={DIRECTION_IMAGE} />
                                            Get Direction
                                        </a>
                                    </li>}
                                </ul>
                            </div>
                            <div className="row">
                                <div className="col pb-2">
                                    <label>Clinic</label>
                                    <h5>{val?.clinic?.clinic_name}</h5>
                                    <span>{formatDate(val.appointment_datetime, 3)}, {formatDate(val.appointment_datetime, 4)}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-3 col-sm-6 py-2">
                                    <label>Services</label>
                                    <p>{val?.service?.name}</p>
                                </div>
                                <div className="col-lg-3 col-sm-6 py-2">
                                    <label>Doctor</label>
                                    <p>{val?.doctor?.firstname} {val?.doctor?.lastname}</p>
                                </div>
                                <div className="col-lg-3 col-sm-6 py-2">
                                    <label>Pet</label>
                                    <p>{val?.pet?.name}</p>
                                </div>
                                <div className="col-lg-3 col-sm-6 py-2">
                                    <label>Type</label>
                                    <p>{val?.appointment_type == "virtual" ? "Telehealth" : 'Clinic'}</p>
                                </div>
                                <div className="col-lg-3 col-sm-6 py-2">
                                    <label>Note</label>
                                    <p>{val?.appointment_notes}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))

            ) : (
                <div>
                    <p>No data found</p>
                </div>
            )}

        </React.Fragment>
    );
};
export default AppointmentCard;
