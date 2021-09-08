import React, { useState, useEffect } from "react";
import CALENDER_IMAGE from "patient-portal-images/calendarDrop.svg";
import CANCEL_IMAGE from "patient-portal-images/cancelDrop.svg";
import CONTACT_IMAGE from "patient-portal-images/contactDrop.svg";
import JOIN_IMAGE from "patient-portal-images/joinIcon.svg";
import DIRECTION_IMAGE from "patient-portal-images/directionDrop.svg";
import { useStoreActions, useStoreState } from "easy-peasy";
import { formatDate } from "patient-portal-utils/Service";
import RescheduleAppointment from "patient-portal-components/Appointment/RescheduleAppointment";
import CancellationPolicy from "patient-portal-components/Appointment/CancellationPolicy";

import Contact from "patient-portal-components/Appointment/Contact";
import { join } from "lodash-es";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useHistory } from "react-router-dom";
import NoRecord from "patient-portal-components/NoRecord";

const AppointmentCard = (props) => {
    const history = useHistory();
    const style = { color: 'red' };
    const [appointmentId, setAppointmentId] = useState(null);
    const [modal, setModal] = useState(false);
    const [contactModal, setContactModal] = useState(false);
    const [policyModal, setPolicyModal] = useState(false);

    const [modalData, setModalData] = useState({});
    const [policyData, setPolicyData] = useState({});
    const [contactModalData, setContactModalData] = useState({});
    const [clinicData, setClinicData] = useState({});
    const getClinicInfo = useStoreActions((actions) => actions.appointment.getClinicInfo);
    const getCancellationPolicy = useStoreActions((actions) => actions.appointment.getCancellationPolicy);

    const isRescheduled = useStoreState((state) => state.appointment.isRescheduled);
    const isCancelled = useStoreState((state) => state.appointment.isCancelled);
    const response = useStoreState((state) => state.appointment.response);

    const toggle = (val) => {
        setModal(!modal);
        if (val) {
            setModalData(val);
        }
    };

    useEffect(() => {
        if (isRescheduled) {
            setModal(!modal);
        }
    }, [isRescheduled]);
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
                if (data.cancellationPolicy) {
                    setPolicyData(data.cancellationPolicy);
                }
            }
        }
    }, [response]);
    const cancelApp = async (e) => {
        if (!e.target) {
            await getCancellationPolicy();
        }
        setAppointmentId(e);
        setPolicyModal(!policyModal);
        // confirmAlert({
        //   message: 'Are you sure to cancel this appointment?',
        //   buttons: [
        //     {
        //       label: 'Yes',
        //       onClick: () => props.onCancelAppointment(id)
        //     },
        //     {
        //       label: 'No',
        //       onClick: () => {}
        //     }
        //   ]
        // });
    };
    useEffect(() => {
        if (isCancelled) {
            setPolicyModal(false);
        }
    }, [isCancelled]);

    const joinMeeting = (meetingId) => {
        window.open(`${process.env.REACT_APP_MEETING_URL}${meetingId}`, "_blank");
    }
    return (
        <React.Fragment>
            <RescheduleAppointment data={modalData} modal={modal} toggle={toggle} />
            <Contact data={clinicData} modal={contactModal} toggle={showContact} />
            <CancellationPolicy onCancelAppointment={props.onCancelAppointment} id={appointmentId} data={policyData} modal={policyModal} toggle={cancelApp} />


            {props.data && props.data.length > 0 ? (
                props.data.map((val, index) => (
                    // 
                    <div key={index} className="box mb-2 onHover" >
                        <div className="appointmentList">
                             {(props.type == "upcoming" && val.status != "canceled" && val.appointment_type == "virtual") && 
                                        <a onClick={() => joinMeeting(val?.meetingId)}>
                                             <div className="joinBtn"><img src={JOIN_IMAGE}/> Join</div>
                                        </a>
                                   }

                           
                            <div className="dropdownArrow">
                                <ul className="dropdownOption">
                                
                                    {(props.type == "upcoming" && val.status != "canceled") && <li>
                                        <a className="onHover" onClick={() => toggle(val)}>
                                            <img src={CALENDER_IMAGE} />
                                            Reschedule
                                        </a>
                                    </li>
                                    }
                                    {(props.type == "upcoming" && val.status != "canceled") && <li>
                                        <a onClick={() => cancelApp(val?.id)} >
                                            <img src={CANCEL_IMAGE} />
                                            Cancel
                                        </a>
                                    </li>}
                                    <li>
                                        <a onClick={() => showContact(val?.clinic_id)}>
                                            <img src={CONTACT_IMAGE} />
                                            Contact
                                        </a>
                                    </li>
                                   
                                    {(props.type == "past" || val.appointment_type == "in_person") && <li>
                                    <a target="_blank" href={`http://maps.google.com/?${val?.clinic?.address}`}>
                                            <img src={DIRECTION_IMAGE} />
                                            Get Direction
                                        </a>
                                    </li>}
                                </ul>
                            </div>
                            {/* onClick={() => (val.status != "canceled") ? history.push(`/appointment-detail/${val?.id}`)  : ""} */}
                            <div onClick={() =>  history.push(`/appointment-detail/${val?.id}`) }>
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
                                {val?.status == "canceled" && <div className="col-lg-3 col-sm-6 py-2">
                                    <label>Status</label>
                                    <p className="colorRed">Canceled</p>
                                </div>}
                            </div>
                            </div>
                        </div>
                    </div>
                ))

            ) : (
                <NoRecord />
            )}

        </React.Fragment>
    );
};
export default AppointmentCard;
