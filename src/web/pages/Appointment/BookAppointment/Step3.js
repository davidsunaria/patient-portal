import React, { useState, useRef, forwardRef, useEffect } from "react";
import DOWN_ARROW_IMAGE from "patient-portal-images/down-arrow.svg";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from "patient-portal-utils/Service";
import moment from "moment";
import Other from "patient-portal-pages/Appointment/BookAppointment/Other.js"


const Step3 = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAccordian, setIsOpenAccordian] = useState(false);
    const [openTimePopup, setOpenTimePopup] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const calendarRef = useRef();

    const handleClick = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
        calendarRef.current.setOpen(!isOpen)
    };
    const showTime = () => {
        if (props.formData.date) {
            setOpenTimePopup(!openTimePopup);
        }

    }

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <React.Fragment>
            <span onClick={onClick} ref={ref}>
                <div className="highlightDate">
                    {props.formData.date && moment(value).format('MMM')}
                    <br />
                    {props.formData.date && moment(value).format('DD')}
                </div>
                <label >
                    {props.formData.date && moment(value).format('dddd')}
                    <br />

                    {props.formData.date && moment(value).format('MMMM Do YYYY')}
                </label>
            </span>
        </React.Fragment>
    ));

    const handleTimeSelect = (e, name, val) => {
        setSelectedTimeSlot(val);
        props.onSubmit(e, name, val);
        showTime();
    }
    const handleAccordian = (index) => {
        setIsOpenAccordian(index);
    }
    useEffect(() => {
        if (!props.formData.date) {
            setSelectedTimeSlot("");
        }
    }, [props.formData.date]);

    return (
        <div className="row">
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
                                                <span className="serviceTime">{value?.duration} Minutes</span>
                                            </label>

                                        ))
                                    }

                                </div>
                            </div>
                        </div>
                    ))
                }


                {props?.providers && props?.providers.length > 0 && <React.Fragment> <div className="subtitle mt-4 mb-3">Select Doctor</div>
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
                                <div className="fieldBox">

                                    <Select
                                        className={"customSelectBox"}
                                        isSearchable={true}
                                        id="provider_id"
                                        name="provider_id"
                                        options={props?.providers}
                                        value={props.formData.provider_id}
                                        onChange={(e) => props.onSubmit(e, "provider_id")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div></React.Fragment>
                }


                <div className="dateTimeOuter">
                    <div className="AppointmentDate">

                        <DatePicker
                            includeDates={props.enabledDates}
                            selected={props.formData.date}
                            onChange={(e) => props.onSubmit(e, 'date', props.formData?.date)}
                            customInput={<ExampleCustomInput />}
                        />
                    </div>

                    <div className="AppointmentDate timeSlot" >
                        <label onClick={() => showTime()}>{ (selectedTimeSlot) ? selectedTimeSlot : props.formData.slot}</label>
                        {props.formData && props.formData.date != undefined && <div className={(openTimePopup == false) ? "timeslotPopup d-none" : "timeslotPopup"}>
                            {props.slot && props.slot.length > 0 && props.slot.map((val, index) => (
                                <span key={index} onClick={(e) => handleTimeSelect(e, "slot", val)}>{val}</span>
                            ))}
                        </div>
                        }
                    </div>
                </div>
               
                {props.enabledDates.length == 0 && <p className="p-text">
                    No slots available. Kindly select another doctor or "Any" or another service.
                </p>}
                <div className="appointmentBtns">
                    <button className="button default mr-2" onClick={() => props.onBack(2)}>Back</button>
                    <button className="button primary ml-auto" onClick={() => props.onNext(4)}>Continue</button>
                </div>

            </div>

            <Other other={props.other} />
        </div>
    );
};
export default Step3;
