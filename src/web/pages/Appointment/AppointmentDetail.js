import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Header from "patient-portal-components/Header/Header.js";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import LOCATION_IMAGE from "patient-portal-images/app-location.svg";
import CONTACT_IMAGE from "patient-portal-images/app-contact.svg";
import CALENDER_IMAGE from "patient-portal-images/app-calendar.svg";
import { useStoreActions, useStoreState } from "easy-peasy";
import moment from "moment";
const AppointmentDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const [appointmentData, setAppointmentData] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const [otherData, setOtherData] = useState({});
  const [petData, setPetData] = useState({});

  const getAppointmentDetail = useStoreActions((actions) => actions.appointment.getAppointmentDetail);
  const response = useStoreState((state) => state.appointment.response);
  useEffect(async () => {
    if (id) {
      await getAppointmentDetail(id);
    }
  }, [id]);
  useEffect(() => {
    if (response) {
      let { message, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        if (data.appointmentData) {
          setAppointmentData(data.appointmentData);
          setCategoryData(data.categoryData);
          setPetData(data.pet_info);
          setOtherData(data.otherData);
        }
      }
    }
  }, [response]);



  return (
    <>
      <div className="content_outer">
        <Sidebar activeMenu="appointment" />
        <div className="right_content_col">
          <main>
            <Header
              heading={"Book an Appointment"}
              subHeading={"Start your process to book your appointment"}
              hasBtn={false}
            />

            <div className="row">
              <div className="col-md-12">

                <div className="box confirmAppointment">
                  <div className="ConfirmSubtitle">Your appointment has been confirmed.</div>

                  <div className="row">
                    <div className="col-xl-4 col-md-6">
                      <div className="appointmentConfirmSection">
                        <div className="appointmentConfirmTitle">Facility</div>
                        <div className="appointmentConfirmClinic">{appointmentData?.clinic?.clinic_name}</div>
                        <div className="appointmentConfirmText">{appointmentData?.clinic?.address}</div>

                        <div className="appointmentConfirmIcons">
                          <a><img src={LOCATION_IMAGE} /></a>
                          <a><img src={CONTACT_IMAGE} /></a>
                          <a><img src={CALENDER_IMAGE} /></a>
                        </div>
                      </div>
                      <div className="appointmentConfirmSection">
                        <div className="appointmentConfirmTitle">Service</div>
                        <div className="appointmentConfirmText"><b>{appointmentData?.service?.name}</b> - {appointmentData?.service?.duration} minutes {categoryData?.service_category}</div>
                      </div>
                      <div className="appointmentConfirmSection">
                        <div className="appointmentConfirmTitle">Client Info</div>
                        <div className="appointmentConfirmText">Name: {appointmentData?.firstname} {" "} {appointmentData?.lastname}</div>
                        <div className="appointmentConfirmText">Email: {appointmentData?.email}</div>
                        <div className="appointmentConfirmText">Phone: {appointmentData?.phone_code}</div>
                      </div>
                      <div className="appointmentConfirmSection">
                        <div className="appointmentConfirmTitle">Pet Info</div>
                        <div className="appointmentConfirmText">Name: {petData?.name}</div>
                        <div className="appointmentConfirmText">Breed: {petData?.breedmap?.name}</div>
                        <div className="appointmentConfirmText">Age: {petData?.dob}</div>
                      </div>
                      <div className="appointmentConfirmSection border-0">
                        <div className="appointmentConfirmTitle">Date & Time</div>
                        <div className="appointmentConfirmText">{otherData?.date} <br />{otherData?.time}</div>
                      </div>
                    </div>
                  </div>


                  <div className="appointmentBtns m-0">
                    <button className="button primary mr-2" onClick={() => history.push("/appointment")}>Back</button>
                  </div>

                </div>





              </div>

            </div>

          </main>
        </div>
      </div>
    </>
  );
}

export default AppointmentDetail;