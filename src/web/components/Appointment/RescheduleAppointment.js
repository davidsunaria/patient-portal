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
import { SELECT_DATE, SELECT_TIME, SELECT_PROVIDER } from "patient-portal-message";
import CROSS_IMAGE from "patient-portal-images/cross.svg";
import Select from 'react-select';

const RescheduleAppointment = (props) => {
  const calendarRef = useRef();
  const [isProviderChanged, setIsProviderChanged] = useState(false);
  const [formData, setFormData] = useState({});
  const [allProviders, setAllProviders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [enabledDates, setEnabledDates] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const getDates = useStoreActions((actions) => actions.appointment.getDates);
  const getTimeSlot = useStoreActions((actions) => actions.appointment.getTimeSlot);
  const updateAppointment = useStoreActions((actions) => actions.appointment.updateAppointment);
  const getProviders = useStoreActions((actions) => actions.appointment.getProviders);
  const getProviderSchedule = useStoreActions((actions) => actions.appointment.getProviderSchedule);
  const getProviderSlots = useStoreActions((actions) => actions.appointment.getProviderSlots);

  const response = useStoreState((state) => state.appointment.response);

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
    calendarRef.current.setOpen(!isOpen)
  };

  useEffect(async () => {
    if (props.data) {
      let appointment
      setId(props.data.id);
      let appointmentDatetime = props?.data?.appointment_datetime?.split(" ");
      if (appointmentDatetime) {
        setDate(new Date(appointmentDatetime[0]));
        setTime(props?.data?.time_format);
      }


      //If service is available for doctor then show provider dropdown
      // Get enabled date for the selected doctor
      if (props?.data?.service_id && props?.data?.service?.service_for === "provider") {
        let formData = { clinic_id: props?.data?.clinic_id }
        await getProviders({ formData: formData, type: props?.data?.service_id });
        await getDates(props?.data?.id);
      }
      // If service is for clinic
      if (props?.data?.id && props?.data?.service?.service_for == "clinic") {
        await getDates(props?.data?.id);
      }

      // Set first provider autoselected and get date and slots
      if (props?.data?.doctor) {
        setFormData({
          ...formData,
          provider_id: { value: props?.data?.doctor_id, label: `${props?.data?.doctor?.title} ${props?.data?.doctor?.firstname} ${props?.data?.doctor?.lastname}` },
          type: props?.data?.appointment_type,
          service_id: props?.data?.service_id,
          clinic_id: props?.data?.clinic_id,
        });
      }


    }
  }, [props.data]);

  useEffect(async () => {
    //console.log("Fire APi", formData.provider_id)
    if (formData?.provider_id?.value && isProviderChanged == true) {

      let request = {
        clinicId: formData.clinic_id,
        serviceId: formData.service_id,
        providerId: formData.provider_id.value,
        appType: formData.type
      }
      //console.log("Doctor Selected", request, formData.provider_id);
      await getProviderSchedule(request);
      setIsProviderChanged(false);
    }
  }, [formData.provider_id]);
  useEffect(() => {
    if (response) {
      let { message, statuscode, data } = response;
      if (statuscode && statuscode === 200) {

        //Set Providers Data
        let resultSet = [];
        if (data?.providers) {
          resultSet.push({
            value: "any", label: "Any", doctor_profile: ""
          });
          _.forOwn(data.providers, function (value, key) {
            resultSet.push({
              value: value.user_id, label: `${value.title} ${value.firstname} ${value.lastname}`, doctor_profile: value?.doctor_profile
            });
          });
          setAllProviders(resultSet);

        }

        // Set Dates Data
        if (data?.enabledDates !== undefined) {
          let enabledDatesArray = [];
          _.forOwn(data?.enabledDates, function (value, key) {
            enabledDatesArray.push(new Date(value));
          });
          setEnabledDates(enabledDatesArray);


        }
        // Set Time Slots Data
        if (data?.timeSlots) {
          setTimeslots(data?.timeSlots);
          //console.log(data.timeSlots[0]);
          if (data?.timeSlots.length > 0) {

          }
        }
      }
    }
  }, [response]);

  useEffect(async () => {
    if (date && id && props?.data?.service?.service_for == "clinic") {
      console.log("Clinic get slots", date);
      let newDate = moment(date).format("YYYY-MM-DD");
      await getTimeSlot({ id: id, date: newDate });
    }
    if (date && props?.data?.service?.service_for == "provider") {

      let payload = {
        clinicId: props?.data?.clinic_id,
        serviceId: props?.data?.service_id,
        providerId: (formData.provider_id?.value) ? formData.provider_id?.value : "",
        date: moment(date).format("YYYY-MM-DD"),
        appType: props?.data?.appointment_type
      }
      //console.log("Date changed from provider", payload);
      await getProviderSlots(payload);
    }
  }, [date, props?.data]);
  const selectTime = (val) => {
    setTime(val);
  }
  const rescheduleApp = async () => {
    let formDataPayload = {
      id: id,
      date: moment(date).format("YYYY-MM-DD"),
      slot: time,
      doctor_id: (formData?.provider_id?.value) ?? ""
    };
    if (props?.data?.service_id && !formData?.provider_id?.value && props?.data?.service?.service_for == "provider") {
      toast.error(<ToastUI message={SELECT_PROVIDER} type={"Error"} />);
    }
    else if (!formDataPayload.date) {
      toast.error(<ToastUI message={SELECT_DATE} type={"Error"} />);
    }
    else if (!formDataPayload.slot) {
      toast.error(<ToastUI message={SELECT_TIME} type={"Error"} />);
    }
    else {
      await updateAppointment(formDataPayload);
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
            {/* {JSON.stringify(formData)} */}
            {props?.data?.service?.service_for === "provider" && allProviders && allProviders.length > 0 && <div className="fieldOuter">
              <label className="fieldLabel">Select Provider</label>
              <div className="fieldBox providerSelectBox">

                <Select
                  placeholder={"Select provider"}
                  className={"customSelectBox"}
                  isSearchable={true}
                  id="provider_id"
                  name="provider_id"
                  options={allProviders}
                  value={formData?.provider_id}
                  onChange={(e) => {
                    setIsProviderChanged(true);
                    setFormData({ ...formData, provider_id: { value: e.value, label: e.label } });
                  }}
                />
              </div>
            </div>}

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
                  {date && timeslots ? (
                    Object.values(timeslots).map((val, index) => (
                      <span className={(val == time) ? "active" : ''} key={index} onClick={() => selectTime(val)}>{val}</span>
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