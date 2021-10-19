import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { getLoggedinUserId } from "patient-portal-utils/Service";
import I_IMAGE from "patient-portal-images/i.svg";

const AppointmentCard = (props) => {
    const lastScrollTop = useRef(0);
    const [cancellationPolicyStatus, setCancellationPolicyStatus] = useState("");
    const [serviceId, setServiceId] = useState("");
    const [accountInfo, setAccountInfo] = useState();
    const [appointments, setAppointments] = useState([]);
    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [isBottom, setIsBottom] = useState(false);
    const [formData, setFormData] = useState({});
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
    const getUpcomingAppointments = useStoreActions((actions) => actions.appointment.getUpcomingAppointments);
    const getPastAppointments = useStoreActions((actions) => actions.appointment.getPastAppointments);
    const isRescheduled = useStoreState((state) => state.appointment.isRescheduled);
    const isCancelled = useStoreState((state) => state.appointment.isCancelled);
    const response = useStoreState((state) => state.appointment.response);
    const cancelAppointment = useStoreActions((actions) => actions.appointment.cancelAppointment);
    const getPetByVisit = useStoreActions((actions) => actions.dashboard.getPetByVisit);
    const [currentOpenStack, setCurrentOpenStack] = useState(null);
    const toggle = (val) => {
       
       
        setModal(!modal);
        if (val) {
            setModalData(val);
        }
       
        setTimeout(
            () => {
                setCurrentOpenStack(null);
            },
            100 
          );
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
        setCurrentOpenStack(null);
    }

    useEffect(() => {
        if (response) {
            let { status, statuscode, data } = response;
            if (statuscode && statuscode === 200) {
                if (data?.clinic) {
                    setClinicData(data?.clinic);
                }
                if (data?.accountInfo) {
                    setAccountInfo(data?.accountInfo);
                }
                if (data.cancellationPolicy) {
                    setPolicyData(data.cancellationPolicy);
                    setCancellationPolicyStatus(data.cancellationPolicy.cancellation_policy_status);
                }

                if (data?.appointments) {

                    const { current_page, next_page_url, per_page } = data.appointments;

                    setCurrentPage(current_page);
                    setNextPageUrl(next_page_url);
                    setPerPage(per_page);

                    let serverRespone = data.appointments.data;
                    if (current_page == 1) {
                        setRecords(serverRespone);
                    }
                    else {
                        serverRespone = [...records, ...serverRespone];
                        setRecords(serverRespone);
                    }
                    setIsBottom(false);
                }

            }
        }
    }, [response]);
    const cancelApp = async (e, service_id) => {
        if (!e.target) {
            await getCancellationPolicy(service_id);
        }
        setAppointmentId(e);
        //setPolicyModal(!policyModal);
        setCurrentOpenStack(null);
    };
    useEffect(() => {
        if (isCancelled) {
            setPolicyModal(false);
        }
    }, [isCancelled]);

    const joinMeeting = (meetingId) => {
        window.open(`${process.env.REACT_APP_MEETING_URL}${meetingId}`, "_blank");
    }

    useEffect(async () => {
        setPage(1);
        if (props.type == "upcoming") {
            await getUpcomingAppointments({
                clientId: getLoggedinUserId(), query: {
                    ...formData, page: process.env.REACT_APP_FIRST_PAGE, pagesize: process.env.REACT_APP_PER_PAGE
                }
            });
        }
        if (props.type == "past") {
            await getPastAppointments({
                clientId: getLoggedinUserId(), query: {
                    ...formData, page: process.env.REACT_APP_FIRST_PAGE, pagesize: process.env.REACT_APP_PER_PAGE
                }
            });
        }
        window.addEventListener('scroll', (e) => handleScroll(e), true);
        return () => {
            window.removeEventListener('scroll', (e) => handleScroll(e))
        };
    }, [props.type]);



    useEffect(async () => {
        if (isRescheduled || isCancelled) {
            if (props.type == "upcoming") {
                await getUpcomingAppointments({
                    clientId: getLoggedinUserId(), query: {
                        ...formData, page: process.env.REACT_APP_FIRST_PAGE, pagesize: process.env.REACT_APP_PER_PAGE
                    }
                });
            }
        }
    }, [isRescheduled, isCancelled]);


    const handleScroll = useCallback((e) => {
        const scrollTop = parseInt(Math.max(e?.srcElement?.scrollTop));
        let st = scrollTop;
        if (st > lastScrollTop.current) {
            if (scrollTop + window.innerHeight + 50 >= e?.srcElement?.scrollHeight) {
                setIsBottom(true);
            }
        } else {
            setIsBottom(false);
        }
        setTimeout(() => {
            lastScrollTop.current = st <= 0 ? 0 : st;
        }, 0)
    }, []);

    useEffect(() => {
        if (isBottom) {
            if (nextPageUrl) {
                setPage(parseInt(currentPage + 1));
            }
        }
    }, [isBottom, nextPageUrl]);
    //Get data on when scrolled
    useEffect(async () => {
        if (page && page > 1) {
            console.log('Get next page ', page)
            console.log('Get next page payload ', formData)

            if (props.type == "upcoming") {
                await getUpcomingAppointments({
                    clientId: getLoggedinUserId(), query: {
                        ...formData, page: page,
                        pagesize: perPage,
                    }
                });
            }
            if (props.type == "past") {
                await getPastAppointments({
                    clientId: getLoggedinUserId(), query: {
                        ...formData, page: page,
                        pagesize: perPage,
                    }
                });
            }
        }
    }, [page]);

    const onCancelAppointment = async (id) => {
        await cancelAppointment({ id: id, clientId: getLoggedinUserId() });
    }

    useEffect(() => {
        console.log("Cancel cancellationPolicyStatus", cancellationPolicyStatus);
        if(cancellationPolicyStatus === 1){
            setPolicyModal(true);
        }
        if(cancellationPolicyStatus === 0){
           onCancelAppointment(appointmentId);
        }
    }, [cancellationPolicyStatus]);

    const hideModal = () => {
        setPolicyModal(false);
        setCancellationPolicyStatus("");
    }

    const getDetail = async(val) => {
        await getPetByVisit({ id: val.id, event: "visit", history });
    }
    const showToggle = (index) => {
        setCurrentOpenStack(index);
    }

    const useOuterClick = (callback) => {
        const callbackRef = useRef(); // initialize mutable ref, which stores callback
        const innerRef = useRef(); // returned to client, who marks "border" element

        // update cb on each render, so second useEffect has access to current value 
        useEffect(() => { callbackRef.current = callback; });

        useEffect(() => {
            document.addEventListener("click", handleClick);
            return () => document.removeEventListener("click", handleClick);
            function handleClick(e) {
                if (innerRef.current && callbackRef.current &&
                    !innerRef.current.contains(e.target)
                ) callbackRef.current(e);
            }
        }, []); // no dependencies -> stable click listener

        return innerRef; // convenience for client (doesn't need to init ref himself) 
    }
    const innerRef = useOuterClick(ev => {
        console.log("ev", ev.target.className)
        if(ev.target.className !== "dropdownArrow"){
            setCurrentOpenStack(null);
        }
    });
    return (
        <React.Fragment>
            <RescheduleAppointment data={modalData} modal={modal} toggle={toggle} />
            <Contact data={clinicData} modal={contactModal} toggle={showContact} />
            <CancellationPolicy onCancelAppointment={onCancelAppointment} serviceId={serviceId} id={appointmentId} data={policyData} modal={policyModal} toggle={hideModal} />

            {/* {JSON.stringify(records)} */}
            {records && records.length > 0 ? (
                records.map((val, index) => (
                    // 
                    <div key={index} className="box mb-2 onHover" >
                        <div className="appointmentList">
                            {(props.type == "upcoming" && val.status != "canceled" && val.appointment_type == "virtual") &&
                                <a className="joinBtn" onClick={() => joinMeeting(val?.meetingId)}>
                                    <img src={JOIN_IMAGE} /> Join
                                </a>
                            }

                            
                            <div className="dropdownArrow"  ref={innerRef} onClick={() => showToggle(index)}>
                           
                               {index == currentOpenStack && <ul className={ (index == currentOpenStack) ? "dropdownOption d-block" : ""}>

                                    {(props.type == "upcoming" && val.status != "canceled") && <li>
                                        <a className="onHover" onClick={() => toggle(val)}>
                                            <img src={CALENDER_IMAGE} />
                                            Reschedule
                                        </a>
                                    </li>
                                    }
                                    {(props.type == "upcoming" && val.status != "canceled") && <li>
                                        <a onClick={() => cancelApp(val?.id, val?.service_id)} >
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

                                    {(props.type == "upcoming" && val.appointment_type == "in_person" && val.status != "canceled") && <li>

                                        <a target="_blank" href={`${val?.clinic?.business_link}`}>
                                            <img src={DIRECTION_IMAGE} />
                                            Directions
                                        </a>
                                    </li>}

                                    {(props.type == "past" && val.pet_visit) && <li>

                                        <a onClick={() => getDetail(val.pet_visit)}>
                                        <img src={I_IMAGE} className="appDetail"/>
                                        
                                            Details
                                        </a>
                                    </li>}
                                </ul>}
                            </div>
                            {/* onClick={() => (val.status != "canceled") ? history.push(`/appointment-detail/${val?.id}`)  : ""} */}
                            <div onClick={() => history.push(`/appointment-detail/${val?.id}`)}>
                                <div className="row">
                                    <div className="col pb-2">
                                        {val?.appointment_type == "virtual" &&
                                            <><label>Clinic</label>
                                                <h5>{accountInfo?.name}</h5></>}

                                        {val?.appointment_type == "in_person" &&
                                            <><label>Clinic</label>
                                                <h5>{val?.clinic?.clinic_name}</h5></>}

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
                                     { val?.appointment_notes && <div className="col-lg-3 col-sm-6 py-2">
                                        <label>Note</label>
                                        <p dangerouslySetInnerHTML={{ __html: (val?.appointment_notes && val?.appointment_notes.includes("Follow-up from a")) ? "Follow-up from a previous visit" : val?.appointment_notes }} />

                                    </div>}
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
