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

const BookAppointment = (props) => {
  const history = useHistory();
  const [formData, setFormData] = useState({ type: "", client_id: "", provider_id: "", service_id: "", clinic_id: "", date: "", slot: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [allClinics, setAllClinics] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [allProviders, setAllProviders] = useState([]);
  const [calenderData, setCalenderData] = useState([]);

  const getAllClinics = useStoreActions((actions) => actions.appointment.getAllClinics);
  const getClinicServices = useStoreActions((actions) => actions.appointment.getClinicServices);
  const getProviders = useStoreActions((actions) => actions.appointment.getProviders);
  const getProviderSchedule = useStoreActions((actions) => actions.appointment.getProviderSchedule);
  
  const response = useStoreState((state) => state.appointment.response);

  const handleStepOne = (payload) => {
    let formPayload = { ...formData };
    formPayload.type = payload;
    setFormData(formPayload);
    setCurrentPage(2);
  }

  const handleStepTwo = (e) => {
    let formPayload = { ...formData };
    formPayload.clinic_id = e?.target?.value;
    setFormData(formPayload);
    setCurrentPage(3);
  }

  const handleStepThree = (e,name) => {
    let formPayload = { ...formData };
    if(e?.target !== undefined && e?.target?.name && e?.target?.value){
      formPayload[e.target.name] = e?.target?.value;
      console.log("1");
    }
    else{
      console.log("2", name, e);
      formPayload[name] = e;
    }
    
    setFormData(formPayload);
  }

  const handleStepFour = () => {

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
        if (data?.clinics) {
          setAllClinics(data?.clinics);
        }
        if (data?.categoryServices) {
          setAllServices(data?.categoryServices);
        }

        let resultSet = [];
        if (data?.providers) {
          resultSet.push({
            value: "any", label: "any"
          });
          _.forOwn(data.providers, function (value, key) {
            resultSet.push({
              value: value.id, label: `${value.title} ${value.firstname} ${value.lastname}`
            });
          });
          setAllProviders(resultSet);
        }
        // Set Providers Schedule
        if(data?.enabledDates){
          setCalenderData(data.enabledDates);
        }
        
      }
    }
  }, [response]);

  const handleNext = (page) => {
    console.log("Next", page);
    setCurrentPage(page);
  }
  const handleBack = (page) => {
    if (page === 1) {
      setFormData({});
      setAllServices([]);
    }
    console.log("Back", page);
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
    if (formData.service_id && formData.clinic_id) {
      await getProviders({ formData: formData, type: 1 });
    }
  }, [formData.service_id, formData.clinic_id]);

 // Get Provider Schedules
 useEffect(async () => {
  if (formData.provider_id) {
    await getProviderSchedule({ formData: formData, type: 2 });
  }
}, [formData.provider_id]);
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
            {JSON.stringify(formData)}
            {currentPage == 1 && <Step1 page={currentPage} onSubmit={handleStepOne} />}
            {currentPage == 2 && <Step2 data={allClinics} page={currentPage} onSubmit={handleStepTwo} onNext={handleNext} onBack={handleBack} />}
            {currentPage == 3 && <Step3 data={allServices} formData={formData} providers={allProviders} page={currentPage} onSubmit={handleStepThree} onNext={handleNext} onBack={handleBack} />}
            {currentPage == 4 && <Step4 page={currentPage} onSubmit={handleStepFour} onNext={handleNext} onBack={handleBack} />}
            {currentPage == 5 && <Step5 page={currentPage} onSubmit={handleStepFive} onNext={handleNext} onBack={handleBack} />}
          </main>
        </div>
      </div>

    </React.Fragment>
  );
};

export default BookAppointment;
