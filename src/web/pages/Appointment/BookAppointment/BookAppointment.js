import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Header from "patient-portal-components/Header/Header.js";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import { useStoreActions, useStoreState } from "easy-peasy";
import _ from "lodash";
import moment from "moment";
import { getLoggedinUserId, getUser } from "patient-portal-utils/Service";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
const BookAppointment = (props) => {
  let { firstname, lastname, email, phone_code } = getUser();
  const history = useHistory();
  const [formData, setFormData] = useState({ type: "", client_id: getLoggedinUserId(), provider_id: "", service_id: "", clinic_id: "", date: "", slot: "", pet_id: "", appointment_notes: "", duration: "", service_for: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [allClinics, setAllClinics] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [allProviders, setAllProviders] = useState([]);
  const [calenderData, setCalenderData] = useState([]);
  const [timeSlot, setTimeSlot] = useState([]);
  const [otherData, setOtherData] = useState({
    name: firstname + " " + lastname, email: email, phone: phone_code
  });
  const [doctorData, setDoctorData] = useState({});
  const getAllClinics = useStoreActions((actions) => actions.appointment.getAllClinics);
  const getClinicServices = useStoreActions((actions) => actions.appointment.getClinicServices);
  const getProviders = useStoreActions((actions) => actions.appointment.getProviders);
  const getProviderSchedule = useStoreActions((actions) => actions.appointment.getProviderSchedule);
  const getProviderSlots = useStoreActions((actions) => actions.appointment.getProviderSlots);
  const createAppointment = useStoreActions((actions) => actions.appointment.createAppointment);
  const getProviderName = useStoreActions((actions) => actions.appointment.getProviderName);

  const response = useStoreState((state) => state.appointment.response);
  const isBooked = useStoreState((state) => state.appointment.isBooked);

  //Set First Step Data
  const handleStepOne = (payload) => {
    let formPayload = { ...formData };
    formPayload.type = payload;
    setFormData(formPayload);
    setCurrentPage(2);
  }
  //Set Second Step Data
  const handleStepTwo = (e, otherInfo) => {
    let formPayload = { ...formData };
    formPayload.clinic_id = e?.target?.value;
    setFormData(formPayload);
    updateOther(otherInfo, 2);
  }
  //Set Third Step Data
  const handleStepThree = (e, name, val) => {

    let formPayload = { ...formData };
    if (name && name !== undefined && name == "service_id") {
      formPayload["service_id"] = e?.target?.value;
      formPayload["duration"] = val?.duration;
      formPayload["service_for"] = val?.service_for;

      if (val?.service_for == "clinic") {
        //reset provider list
        setAllProviders([]);
        setCalenderData([]);
        setTimeSlot([]);
        formPayload["date"] = "";
        formPayload["slot"] = "";
        formPayload["provider_name"] = "";
        formPayload["provider_id"] = "";
        let finalOtherPayload = { ...otherData, date: "", slot: "", provider_name: "" };
        setOtherData(finalOtherPayload);
      }

    }
    else if (name && name !== undefined && name == "date") {
      val = e;
      formPayload[name] = e;
    }
    else if (name && name !== undefined && name == "provider_id") {
      val = e;
      formPayload[name] = e;
    }
    else if (name && name !== undefined && name == "slot") {
      formPayload[name] = val;
    }

    else if (name == undefined && e?.target !== undefined && e?.target?.name && e?.target?.value) {
      formPayload[e.target.name] = e?.target?.value;
    }
    
    setFormData(formPayload);
    updateOther(val, 3, name);
  }

  const handleStepFour = (e, name, val) => {
    let formPayload = { ...formData };

    if (e?.target !== undefined && e?.target?.name && e?.target?.value) {
      formPayload[e.target.name] = e?.target?.value;
    }
    setFormData(formPayload);
    updateOther(val, 4, name);
  }
  const handleStepFive = () => {

  }

  useEffect(async () => {
    await getAllClinics();
  }, []);

  useEffect(() => {
    if (response) {
      let { statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        // Set Clinics Data
        if (data?.clinics) {
          setAllClinics(data?.clinics);
        }
        // Set Services Data
        if (data?.categoryServices) {
          setAllServices(data?.categoryServices);
        }
        //Set Providers Data
        let resultSet = [];
        if (data?.providers) {
          resultSet.push({
            value: "any", label: "Any"
          });
          _.forOwn(data.providers, function (value, key) {
            resultSet.push({
              value: value.id, label: `${value.title} ${value.firstname} ${value.lastname}`
            });
          });
          setAllProviders(resultSet);
        }
        // Set Providers Schedule
        if (data?.enabledDates) {
          let enabledDatesArray = [];
          _.forOwn(data.enabledDates, function (value, key) {
            enabledDatesArray.push(new Date(value));
          });
          setCalenderData(enabledDatesArray);
        }

        // Set Timeslot 
        if (data?.timeSlots) {
          if(data.timeSlots){
            setTimeSlot(data.timeSlots);
          }
        }

        //Appointment Created
        if (data?.appointmentId) {
          console.log("data?.appointmentId", data?.appointmentId);
          history.push(`/appointment-detail/${data?.appointmentId}`);
        }

        // Set Timeslot 
        if (data?.doctorData) {
          setDoctorData(data.doctorData);
        }
      }
    }
  }, [response]);

  //Handle next button actions    
  const handleNext = async (page) => {
    console.log("Next", page);
    if (page == 5) {
      let status = validateBookAppointment(page);
      if (status) {
        let request = { ...formData };
        request.date = moment(request.date).format("YYYY-MM-DD");
        request.provider_id = request.provider_id.value;

        if (request && request !== undefined) {
          console.log("Form Submission", request);
          await createAppointment(request);
        }
      }
    }
    else {
      //Validate data Step Wise
      let status = validateBookAppointment(page);
      if (status) {
        setCurrentPage(page);
      }

    }

  }
  const handleBack = (page) => {
    console.log(page);
    if (page === 1) {
      setFormData({});
      setOtherData({});
      setAllServices([]);
    }
    if(page === 2){
      let request = { ...formData };
      let requestOther = { ...otherData };

      request.service_for = "";
      request.service_id = "";
      request.duration = "";
      request.date = "";
      request.slot = "";
      request.provider_name = "";
      request.provider_id = "";

      requestOther.date = "";
      requestOther.slot = "";
      requestOther.service_name= "";
      requestOther.service_description= "";
      requestOther.service_duration = "";
      requestOther.provider_name = "";
      setAllServices([]);
      setAllProviders([]);
      setCalenderData([]);
      setTimeSlot([]);
      setFormData(request);
      setOtherData(requestOther);
    }
    setCurrentPage(page);
  }
  // Get Services For The Selected Clinic

  useEffect(async () => {
    if (formData.type && formData.clinic_id) {
      await getClinicServices(formData);
    }
  }, [formData.type, formData.clinic_id]);

  // Get Provider Based On Service Selected
  useEffect(async () => {
    if (formData.service_id) {
      console.log("Service selected and ", formData);
      setAllProviders([]);
      setCalenderData([]);
      setTimeSlot([]);
      setFormData({...formData, date: "",slot: "", provider_name: "" })
      setOtherData({...otherData, date: "",slot: "" })
      await getProviders({ formData: formData, type: formData.service_id });
    }
    /*if (formData.service_id && formData.clinic_id && formData.service_for == "provider") {
      console.log("Service selected and ", formData);
      await getProviders({ formData: formData, type: formData.service_id });
    } else {
      console.log("Service selected clinic wiase ", formData);
      //reset provider list
      setAllProviders([]);
      setCalenderData([]);
      setTimeSlot([]);
      let finalPayload = { ...formData };
      finalPayload["date"] = "";
      finalPayload["slot"] = "";
      finalPayload["provider_name"] = "";

      let finalOtherPayload = { ...otherData, date: "", slot: "", provider_name: "" };
      setFormData(finalPayload);
      setOtherData(finalOtherPayload);

      let request = {
        clinicId: formData.clinic_id,
        serviceId: formData.service_id,
        providerId: 0,
        appType: formData.type
      }
      await getProviders({ formData: formData, type: formData.service_id });
    }*/
  }, [formData.service_id]);

  // Get Provider Schedules
  useEffect(async () => {
    if (formData.provider_id) {

      let request = {
        clinicId: formData.clinic_id,
        serviceId: formData.service_id,
        providerId: formData.provider_id.value,
        appType: formData.type
      }
      console.log("Doctor Selected", request);
      await getProviderSchedule(request);
    }
  }, [formData.provider_id]);

  // Get Provider Slots By Date
  useEffect(async () => {
    if (formData.date) {
      console.log("on date selection");
      let payload = {
        clinicId: formData.clinic_id,
        serviceId: formData.service_id,
        providerId: (formData.provider_id?.value) ? formData.provider_id?.value : "",
        date: moment(formData.date).format("YYYY-MM-DD"),
        appType: formData.type
      }
      await getProviderSlots(payload);
    }
    
  }, [formData.date]);
  // Get Doctor Name
  useEffect(async () => {
    if (formData.date && formData.provider_id.value == "any") {
      console.log("Any Doctor Selected And Date Changed", formData);

      let timeToBeSent = "";
      _.forOwn(timeSlot, function (value, key) {
        if (key == 0) {
          timeToBeSent = value;
        }
      });
      if (timeToBeSent) {
        let payload = {
          service_id: formData.service_id,
          clinic_id: formData.clinic_id,
          date: moment(formData.date).format("YYYY-MM-DD"),
          slot: timeToBeSent
        }
        await getProviderName(payload);
      }
    }
  }, [formData.date, formData.provider_id]);

  const updateOther = (payload, step, name) => {
    let finalPayload = { ...otherData };
    if (step == 2) {
      finalPayload = { ...otherData, clinic_name: payload.clinic_name, clinic_address: payload.address };
    }
    if (step == 3) {

      if (name && name == "service_id") {
        finalPayload = { ...otherData, service_name: payload?.name, service_duration: payload?.duration, service_description: payload?.description };
      }
      if (name && name == "provider_id") {
        finalPayload = { ...otherData, provider_name: payload?.label };
      }
      if (name && name == "provider_name") {
        finalPayload = { ...otherData, provider_name: payload };
      }
      if (name && name == "date") {
        finalPayload = { ...otherData, date: moment(payload).format('dddd, MMMM Do YYYY') };
      }
      if (name && name == "slot") {
        finalPayload = { ...otherData, slot: payload };
      }
    }
    if (step == 4) {
      if (name && name == "pet") {
        finalPayload = { ...otherData, pet_name: payload?.name, species: payload?.speciesmap?.species };
      }
    }
    setOtherData(finalPayload);
  }

  useEffect(() => {
    if (doctorData?.firstname) {
      let user_name = `${doctorData?.title} ${doctorData?.firstname} ${doctorData?.lastname}`;
      updateOther(user_name, 3, "provider_name");
    }
  }, [doctorData]);


  const validateBookAppointment = (page) => {
    //Validate clinics
    let response = false;
    if (page == 3) {
      if (!formData.clinic_id) {
        toast.error(<ToastUI message={"Please select clinic"} type={"Error"} />);
      }
      else {
        response = true;
      }
    }
    if (page == 4) {
      if (!formData.service_id) {
        toast.error(<ToastUI message={"Please select service"} type={"Error"} />);
      }
      else if (formData.service_for == "provider" && !formData.provider_id.value) {
        toast.error(<ToastUI message={"Please select provider"} type={"Error"} />);
      }

      else if (!formData.date) {
        toast.error(<ToastUI message={"Please select date"} type={"Error"} />);
      }
      else if (!formData.slot) {
        toast.error(<ToastUI message={"Please select time slot"} type={"Error"} />);
      }
      else {
        response = true;
      }
    }
    if (page == 5) {
      if (!formData.pet_id) {
        toast.error(<ToastUI message={"Please select pet"} type={"Error"} />);
      }
      else if (!formData.appointment_notes) {
        toast.error(<ToastUI message={"Please enter appointment notes"} type={"Error"} />);
      }
      else {
        response = true;
      }
    }
    return response;
  }
  return (
    <React.Fragment>
      <div className="content_outer">
        <Sidebar activeMenu="appointment" />
        <div className="right_content_col">
          <main>
            <Header
              heading={"Book an appointment"}
              subHeading={"Start your process to book your appointment"}
              hasBtn={false}
            />
            {/* {JSON.stringify(formData)} */}
            {currentPage == 1 && <Step1 page={currentPage} onSubmit={handleStepOne} />}
            {currentPage == 2 && <Step2 other={otherData} data={allClinics} page={currentPage} onSubmit={handleStepTwo} onNext={handleNext} onBack={handleBack} />}
            {currentPage == 3 && <Step3 other={otherData} data={allServices} slot={timeSlot} enabledDates={calenderData} formData={formData} providers={allProviders} page={currentPage} onSubmit={handleStepThree} onNext={handleNext} onBack={handleBack} />}
            {currentPage == 4 && <Step4 other={otherData} page={currentPage} formData={formData} onSubmit={handleStepFour} onNext={handleNext} onBack={handleBack} />}
            {currentPage == 5 && <Step5 page={currentPage} onSubmit={handleStepFive} onNext={handleNext} onBack={handleBack} />}
          </main>
        </div>
      </div>

    </React.Fragment>
  );
};

export default BookAppointment;
