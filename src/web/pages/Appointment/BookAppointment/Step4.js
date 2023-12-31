import React, { useState, useRef, forwardRef, useEffect } from "react";
import DOWN_ARROW_IMAGE from "patient-portal-images/down-arrow.svg";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate, appointmentDateFormat } from "patient-portal-utils/Service";
import moment from "moment";
import Other from "patient-portal-pages/Appointment/BookAppointment/Other.js"
import I_IMAGE from "patient-portal-images/i.svg";
import Service from "patient-portal-components/Appointment/Service";
import { useStoreActions, useStoreState } from "easy-peasy";


const Step4 = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAccordian, setIsOpenAccordian] = useState(false);
    const [openTimePopup, setOpenTimePopup] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const calendarRef = useRef();
    const [serviceModal, setServiceModal] = useState(false);
    const [serviceDetail, setServiceDetail] = useState({});
    const setOtherLoader = useStoreActions((actions) => actions.appointment.setOtherLoader);

    const showServiceDetail = async (e) => {
        setServiceModal(!serviceModal);
        setServiceDetail(e);
    }

    const handleClick = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
        calendarRef.current.setOpen(!isOpen)
    };
    const showTime = (e) => {
        if (props.formData.date) {
            setOpenTimePopup(!openTimePopup);
        }
        else if (props?.enabledDates[0]) {
            setOpenTimePopup(!openTimePopup);
        }
    }
    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => {
        return (<React.Fragment>
            <span onClick={onClick} ref={ref}>

                <div className="highlightDate">
                    {props.formData.date && appointmentDateFormat(props.formData.date, "MMM")}
                    <br />
                    {props.formData.date && appointmentDateFormat(props.formData.date, "DD")}
                </div>
                <label >
                    {props.formData.date && appointmentDateFormat(props.formData.date, "dddd")}
                    <br />

                    {props.formData.date && appointmentDateFormat(props.formData.date, "MMMM Do YYYY")}
                </label>

            </span>
        </React.Fragment>)
    });

    const handleTimeSelect = (e, name, val) => {
        props.checkDoctor(val)
        showTime();
        setSelectedTimeSlot(val);
        props.onSubmit(e, name, val);
    }
    const handleAccordian = (index) => {
        setIsOpenAccordian(index);
    }
    useEffect(() => {
        console.log("Date Changed For Child ", !props.formData.date, props.formData.date == "" ? "empty" : 'not');
        if (props.formData.date == "") {
            setSelectedTimeSlot("");
        }

    }, [props.formData.date]);

    useEffect(() => {
        if (props.slot) {
            let val = Object.values(props.slot);
            if (val.length > 0 && selectedTimeSlot) {
                setSelectedTimeSlot(val[0]);
            }

        }
    }, [props.slot]);
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
        setOpenTimePopup(false);
    });

    const getSelectedClass = (val, selectedVal) => {
        let currentValue = moment(val, 'HH:mm:ss: a').diff(moment().startOf('day'), 'seconds');
        let selectedValue = moment(selectedVal, 'HH:mm:ss: a').diff(moment().startOf('day'), 'seconds');
        if (currentValue === selectedValue) {
            return "active";
        }
        else {
            return "";
        }
    }
    return (
        <div className="row mt-3">
            <div className="col-md-8">

                {props?.providers && props?.providers.length > 0 && <React.Fragment> <div id="doctor" className="subtitle mt-4 mb-3">Select Doctor</div>
                    <p className="p-text">
                        We recommend selecting “Any” doctor to give you the most
                        available options for dates &amp; timeslots. Please select a
                        specific doctor only if you specifically need to meet them.
                        If you are unable to find a suitable timeslot for your
                        selected doctor, please try “Any” or another doctor.
                    </p>

                    <div className="row my-3">
                        <div className="col-xl-4 col-md-6">
                            <div className="fieldOuter mb-0">
                                <div className="fieldBox providerSelectBox">
                                    <Select
                                        placeholder={"Select provider"}
                                        className={"customSelectBox"}
                                        isSearchable={true}
                                        id="provider_id"
                                        name="provider_id"
                                        options={props?.providers.length > 1 ?props?.providers:[]}
                                        value={props?.providers.length > 1 ? props?.formData?.provider_id:"Select provider"}
                                        onChange={(e) => {
                                            props.onSubmit(e, "provider_id")
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div></React.Fragment>
                }

                {/* Date-  
                Slot-{JSON.stringify(props.formData.slot)}<br /><br />
                Selected-{JSON.stringify(selectedTimeSlot)}<br /><br /> */}
                {/*State-{JSON.stringify(openTimePopup)}<br />
                enabledDates-{JSON.stringify(props?.enabledDates[0])}<br />
                providers-{JSON.stringify(props?.providers.length)}<br /> */}
                {/* {JSON.stringify(props.formData.date)} */}


                {(props?.enabledDates.length > 0 || props?.providers.length > 0 && props.formData.provider_id) && <div className="dateTimeOuter">
                    {props?.enabledDates.length > 0 && <React.Fragment><div id="datePicker" className="AppointmentDate">
                        <DatePicker
                            wrapperClassName={props?.formData?.date ? "" : "appointmentDatePicker"}
                            placeholderText="Select Date"
                            includeDates={props.enabledDates}
                            selected={props?.formData?.date}
                            onChange={(e) => {props.onSubmit(e, 'date', props.formData?.date) 
                            setOtherLoader(true)}}
                            customInput={<ExampleCustomInput />}
                        />
                    </div>

                        <div className="AppointmentDate timeSlot" >

                            <label ref={innerRef} onClick={(e) => showTime(e)}>{(selectedTimeSlot) ? selectedTimeSlot : (props.formData.date) ? props.formData.slot : ""}</label>
                            {props.formData && (props.formData.date != undefined || props?.enabledDates[0]) && <div className={(openTimePopup == false) ? "timeslotPopup d-none" : "timeslotPopup"}>

                                {props.slot && Object.values(props.slot).map((val, index) => (
                                    <span className={getSelectedClass(val, (selectedTimeSlot) ? selectedTimeSlot : props.formData.slot)} key={index} onClick={(e) => handleTimeSelect(e, "slot", val)}>{val}</span>
                                ))}
                            </div>
                            }
                        </div></React.Fragment>}
                </div>
                }

                {props.enabledDates.length == 0 && <p className="p-text mt-3">
                    No slots available. Kindly select another doctor or "Any" or another service.
                </p>}
                <div className="appointmentBtns">
                    <button className="button secondary mr-2" onClick={() => props.onBack(3)}>Back</button>
                    <button className="button primary ml-auto" onClick={() => props.onNext(5)}>Continue</button>
                </div>

            </div>

            <Other other={props.other} />
        </div>
    );
};
export default Step4;
