import React, { useState, useEffect, useCallback, useMemo, forwardRef, useRef } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import CALENDER_IMAGE from "patient-portal-images/app-calendar.svg";
import { useStoreActions, useStoreState } from "easy-peasy";
import _ from "lodash";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { SELECT_DATE,SELECT_TIME } from "patient-portal-message";
import CROSS_IMAGE from "patient-portal-images/cross.svg";

const RescheduleAppointment = (props) => {
  const calendarRef = useRef();
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [enabledDates, setEnabledDates] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const getDates = useStoreActions((actions) => actions.appointment.getDates);
  const getTimeSlot = useStoreActions((actions) => actions.appointment.getTimeSlot);
  const updateAppointment = useStoreActions((actions) => actions.appointment.updateAppointment);
  const response = useStoreState((state) => state.appointment.response);
  
  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
    calendarRef.current.setOpen(!isOpen)
  };
  
  useEffect(async () => {
    if (props.data.id) {
      setId(props.data.id);
      await getDates(props.data.id);
    }
  }, [props.data.id]);
  useEffect(() => {
    if (response) {
      let { message, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        if (data.enabledDates) {
          let enabledDatesArray = [];
          _.forOwn(data.enabledDates, function (value, key) {
            enabledDatesArray.push(new Date(value));
          });
          setEnabledDates(enabledDatesArray);
        }
        if (data.timeSlots) {
          setTimeslots(data.timeSlots);
        }
      }
    }
  }, [response]);

  useEffect(async () => {
    if (date) {
      let newDate = moment(date).format("YYYY-MM-DD");
      await getTimeSlot({ id: id, date: newDate });
    }
  }, [date]);
  const selectTime = (val) => {
    setTime(val);
  }
  const rescheduleApp = async() => {
    let formData = {
      id: id,
      date: moment(date).format("YYYY-MM-DD"),
      slot: time
    };
    //console.log('formData', formData);
    if(!formData.date){
      toast.error(<ToastUI message={SELECT_DATE} type={"Error"} />);
    }
    else if(!formData.slot){
      toast.error(<ToastUI message={SELECT_TIME} type={"Error"} />);
    }
    else{
      await updateAppointment(formData);
    }
  }
  
  return (
    <React.Fragment>
      <Modal isOpen={props.modal}  >
        <ModalBody className="p-0">
          <div className="popupWrapper">
            <div className="popupTitle mb-3">Reschedule Appointment
              <a className="cross" onClick={props.toggle}>
                <img src={CROSS_IMAGE} />
              </a>
            </div>
        
            <div className="fieldOuter">
              <label className="fieldLabel">Select Date</label>
              <div className="fieldBox fieldIcon">
                <DatePicker
                dateFormat="yyyy-MM-dd"
                  includeDates={enabledDates}
                  ref={calendarRef}
                  className="fieldInput"
                  selected={date}
                  onChange={dateSelected => {
                    setDate(dateSelected);
                  }}
                />
                <img src={CALENDER_IMAGE} onClick={(e) => handleClick(e)} />
              </div>
            </div>
                 
            <div className="fieldOuter">
              <label className="fieldLabel">Select Timeslot</label>
              <div className="fieldBox">
                <div className="timeslotPopup">
                  {date && timeslots  ? (
                    Object.values(timeslots).map((val, index) => (
                      <span className={ (val == time) ? "active" : ''} key={index} onClick={() => selectTime(val)}>{val}</span>
                    ))
                  ) : (
                    <div className="noRecord">
                      <p>No timeslot found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button className="button primary mr-2" onClick={() => rescheduleApp()}>Submit</button>
            <button className="button secondary" onClick={props.toggle}>Close</button>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

export default RescheduleAppointment;