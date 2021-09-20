import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Header from "patient-portal-components/Header/Header.js";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import { useStoreActions, useStoreState } from "easy-peasy";
import _ from "lodash";
import moment from "moment";
import { getLoggedinUserId, getUser } from "patient-portal-utils/Service";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { SELECT_CLINIC, SELECT_SERVICE, SELECT_PROVIDER, SELECT_PET, SELECT_APPOINTMENT_NOTES, SELECT_DATE, SELECT_TIME } from "patient-portal-message";

const BookAppointment = (props) => {
  const { id } = useParams();
  let { firstname, lastname, email, phone_code } = getUser();
  const history = useHistory();
  const [formData, setFormData] = useState({ type: "", client_id: getLoggedinUserId(), provider_id: "", service_id: "", clinic_id: "", date: "", slot: "", pet_id: "", appointment_notes: "", duration: "", service_for: "",telehealth_clinic_id: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [allClinics, setAllClinics] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [allProviders, setAllProviders] = useState([]);
  const [calenderData, setCalenderData] = useState([]);
  const [timeSlot, setTimeSlot] = useState([]);
  const [timeSlotClinic, setTimeSlotClinic] = useState([]);
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
  const getPet = useStoreActions((actions) => actions.appointment.getPet);

  const response = useStoreState((state) => state.appointment.response);
  const isBooked = useStoreState((state) => state.appointment.isBooked);
  useEffect(async () => {
    if (id) {
      let formPayload = { ...formData };
      formPayload.pet_id = id;
      setFormData(formPayload);
      await getPet(id);
    }
  }, [id]);
  //Set First Step Data
  const handleStepOne = (payload) => {
    let formPayload = { ...formData };
    formPayload.type = payload;
    formPayload.client_id = getLoggedinUserId();
    setFormData(formPayload);
    //Reset Page For Virtual
    if (payload == "virtual") {
      setCurrentPage(3);
    }
    else {
      setCurrentPage(2);
    }
    setOtherData({...otherData, type: payload});
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
      if(formPayload.type == "virtual" && timeSlotClinic){
        formPayload["telehealth_clinic_id"] = timeSlotClinic[val];
      }
    }
    // else if(name && name !== undefined && name == "telehealth_clinic_id"){
    //   formPayload[name] = val;
    // }
    else if (name == undefined && e?.target !== undefined && e?.target?.name && e?.target?.value) {
      formPayload[e.target.name] = e?.target?.value;
    }
    console.log("Setting Payload", formPayload);
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
 
  useEffect(async () => {
    await getAllClinics();
  }, []);

  useEffect(() => {
    if (response) {
      let { statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        if(data?.timeSlotsClinic){
          setTimeSlotClinic(data.timeSlotsClinic);
        }

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
              value: value.user_id, label: `${value.title} ${value.firstname} ${value.lastname}`
            });
          });
          setAllProviders(resultSet);
        }
        // Set Providers Schedule
        if (data?.enabledDates) {
          let enabledDatesArray = [];
          if (data.enabledDates.length > 0) {
            _.forOwn(data.enabledDates, function (value, key) {
              enabledDatesArray.push(new Date(value));
            });
          }

          setCalenderData(enabledDatesArray);
          if (data.enabledDates.length > 0) {
            setTimeout(
              () => {
                setFormData({ ...formData, date: new Date(data.enabledDates[0]) })
                updateOther(data.enabledDates[0], 3, "date");
              },
              0
            );
          }
          else {

            setTimeout(
              () => {
                setFormData({ ...formData, date: "" });
                updateOther("", 3, "date");
              },
              0
            );

          }

        }

       
        // Set Timeslot 
        if (data?.timeSlots) {
          if (data.timeSlots) {
            setTimeSlot(data.timeSlots);
            if (data.timeSlots) {
              let teleClinicId;
              let val = Object.values(data.timeSlots);
              if(timeSlotClinic && val.length > 0){
                teleClinicId = timeSlotClinic[val[0]];
              }
              setFormData({ ...formData, slot: val[0], telehealth_clinic_id: teleClinicId ?? "" });
              updateOther(val[0], 3, "slot");
            }
            else {
              setFormData({ ...formData, slot: "", telehealth_clinic_id: "" });
              updateOther("", 3, "slot");
            }
          }
        }
        

        //Appointment Created
        if (data?.appointmentId) {
          history.push(`/appointment-detail/${data?.appointmentId}`);
        }

        // Set Timeslot 
        if (data?.doctorData) {
          setDoctorData(data.doctorData);
        }

        //Set Pet name
        if (data?.pet) {
          setOtherData({ ...otherData, pet_name: data?.pet.name, species: data?.pet.speciesmap?.species });
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
    if (page === 2) {
      let request = { ...formData };
      let requestOther = { ...otherData };

      request.service_for = "";
      request.service_id = "";
      request.duration = "";
      request.date = "";
      request.slot = "";
      request.provider_name = "";
      request.provider_id = "";
      request.telehealth_clinic_id = "";

      requestOther.date = "";
      requestOther.slot = "";
      requestOther.service_name = "";
      requestOther.service_description = "";
      requestOther.service_duration = "";
      requestOther.provider_name = "";
      //setAllServices([]);
      setAllProviders([]);
      setCalenderData([]);
      setTimeSlot([]);
      setFormData(request);
      setOtherData(requestOther);
    }
    //Reset Page For Virtual
    if(formData.type == "virtual" && page == 2){
      setCurrentPage(1);
    }
    else{
      setCurrentPage(page);
    }
    
  }
  // Get Services For The Selected Clinic for in person, for virtual skip clinic and get all virtual services
  useEffect(async () => {
   
    if (formData.type == "in_person" && formData.clinic_id) {
      await getClinicServices(formData);
    }
    if (formData.type == "virtual"){ 
      let req = {
        type: formData.type,
      }
      await getClinicServices(req);
    }
    
  }, [formData.type, formData.clinic_id]);

  // Get Provider Based On Service Selected
  useEffect(async () => {
    if (formData.service_id) {
      console.log("Service selected and ", formData);
      setAllProviders([]);
      setCalenderData([]);
      setTimeSlot([]);
      setFormData({ ...formData, date: "", slot: "", provider_name: "",telehealth_clinic_id: ""  });
      setOtherData({ ...otherData, date: "", slot: "" });
      await getProviders({ formData: formData, type: formData.service_id });
    }
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
      //setFormData({ ...formData, slot: "" });
      await getProviderSchedule(request);
    }
  }, [formData.provider_id]);

  // Get Provider Slots By Date
  useEffect(async () => {
    if (formData.date) {
      console.log("on date selection", );
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
        if(payload){
          finalPayload = { ...otherData, date: moment(payload).format('dddd, MMMM Do YYYY') };
        }
        else{
          finalPayload = { ...otherData, date: "" };
        }
        
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
    //console.log("Final Other Data Is", finalPayload);
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
      if (!formData.clinic_id && formData.type == "in_person") {
        toast.error(<ToastUI message={SELECT_CLINIC} type={"Error"} />);
      }
      else if (!formData.telehealth_clinic_id && formData.type == "virtual") {
        toast.error(<ToastUI message={SELECT_CLINIC} type={"Error"} />);
      }
      else {
        response = true;
      }
    }
    if (page == 4) {
      if (!formData.service_id) {
        toast.error(<ToastUI message={SELECT_SERVICE} type={"Error"} />);
      }
      else if (formData.service_for == "provider" && !formData.provider_id?.value) {
        toast.error(<ToastUI message={SELECT_PROVIDER} type={"Error"} />);
      }

      else if (!formData.date) {
        toast.error(<ToastUI message={SELECT_DATE} type={"Error"} />);
      }
      else if (!formData.slot) {
        toast.error(<ToastUI message={SELECT_TIME} type={"Error"} />);
      }
      else {
        response = true;
      }
    }
    if (page == 5) {
      if (!formData.pet_id) {
        toast.error(<ToastUI message={SELECT_PET} type={"Error"} />);
      }
      else if (!formData.appointment_notes) {
        toast.error(<ToastUI message={SELECT_APPOINTMENT_NOTES} type={"Error"} />);
      }
      else {
        response = true;
      }
    }
    return response;
  }

  useEffect(() => {
      if(timeSlotClinic){
        let val = Object.values(timeSlotClinic);
        if(val.length > 0){
          setFormData({ ...formData, telehealth_clinic_id: val[0] });
        }
        
      }
  }, [timeSlotClinic]);
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
            {currentPage == 2 && <Step2 other={otherData} formData={formData} data={allClinics} page={currentPage} onSubmit={handleStepTwo} onNext={handleNext} onBack={handleBack} />}
            {currentPage == 3 && <Step3 timeSlotClinic={timeSlotClinic} other={otherData} data={allServices} slot={timeSlot} enabledDates={calenderData} formData={formData} providers={allProviders} page={currentPage} onSubmit={handleStepThree} onNext={handleNext} onBack={handleBack} />}
            {currentPage == 4 && <Step4 other={otherData} page={currentPage} formData={formData} onSubmit={handleStepFour} onNext={handleNext} onBack={handleBack} />}
          </main>
        </div>
      </div>

    </React.Fragment>
  );
};

export default BookAppointment;
