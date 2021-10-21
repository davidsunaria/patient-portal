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


const Step3 = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAccordian, setIsOpenAccordian] = useState(false);
    const [openTimePopup, setOpenTimePopup] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const calendarRef = useRef();
    const [serviceModal, setServiceModal] = useState(false);
    const [serviceDetail, setServiceDetail] = useState({});

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
            <Service data={serviceDetail} modal={serviceModal} toggle={showServiceDetail} />
            <div className="col-md-8">
                {
                    props.data && props.data.length > 0 && props.data.map((val, index) => (
                        <div key={index} className="box accordionOuter" >
                            <div className={"accordionHeader"} onClick={() => handleAccordian(index)}>
                                {val?.service_category} <img src={DOWN_ARROW_IMAGE} />
                            </div>
                            <div className={"accordionContent"}>
                                <div className="checkboxOuter">

                                    {
                                        val.services && val.services.length > 0 && val.services.map((value, innerIndex) => (
                                            <label key={innerIndex} className="customCheckbox d-flex justify-content-between">
                                                <input type="radio" checked={value?.id == props.formData.service_id ? true : false} onChange={(e) => props.onSubmit(e, "service_id", value)} name="service_id" value={value?.id} />
                                                <span className="serviceName">
                                                    {value?.name}
                                                </span>
                                                <span className="serviceTime"><span className="mr-3">{value?.duration || value?.custom_duration} Minutes</span>
                                                    <img onClick={() => showServiceDetail(value)} className="infoIcon" src={I_IMAGE} />
                                                </span>
                                            </label>

                                        ))
                                    }

                                </div>
                            </div>
                        </div>
                    ))
                }

                {props.data && props.data.length == 0 && <div className="box text-center">No service available</div>}



                <div className="appointmentBtns">
                    <button className="button secondary mr-2" onClick={() => props.onBack(2)}>Back</button>
                    <button className="button primary ml-auto" disabled={props.data && props.data.length == 0} onClick={() => props.onNext(4)}>Continue</button>
                </div>

            </div>

            <Other other={props.other} />
        </div>
    );
};
export default Step3;
