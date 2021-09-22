import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Header from "patient-portal-components/Header/Header.js";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import LOCATION_IMAGE from "patient-portal-images/app-location.svg";
import CONTACT_IMAGE from "patient-portal-images/app-contact.svg";
import CALENDER_IMAGE from "patient-portal-images/app-calendar.svg";
import { useStoreActions, useStoreState } from "easy-peasy";
import moment from "moment";
import { getAge } from "patient-portal-utils/Service";

const AppointmentDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const [appointmentData, setAppointmentData] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const [otherData, setOtherData] = useState({});
  const [petData, setPetData] = useState({});
  const [accountInfo, setAccountInfo] = useState({});

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
          setAccountInfo(data.accountInfo);
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
              hasBtn={false}
            />

            <div className="row">
              <div className="col-md-12">

                <div className="box confirmAppointment">
                  <div className="ConfirmSubtitle">Your appointment has been {appointmentData?.status == "canceled" ? "canceled" : "confirmed"}.</div>

                  <div className="row">
                    <div className="col-xl-4 col-md-6">
                      <div className="appointmentConfirmSection">
                        <div className="appointmentConfirmTitle">Facility</div>

                        {appointmentData?.appointment_type == "in_person" && <>
                          <div className="appointmentConfirmClinic">{appointmentData?.clinic?.clinic_name}</div>
                          <div className="appointmentConfirmText">{appointmentData?.clinic?.address}</div></>
                        }

                        {appointmentData?.appointment_type == "virtual" && <>
                          <div className="appointmentConfirmClinic">{accountInfo?.name}</div>
                          <div className="appointmentConfirmText">{accountInfo?.address}</div></>
                        }
                        <div className="appointmentConfirmIcons">
                          {appointmentData?.status == "canceled" && <spanc className="appointmentConfirmText colorRed">Canceled</spanc>}

                          {appointmentData?.appointment_type == "in_person" && appointmentData?.status != "canceled" && <React.Fragment><a target="_blank" href={`http://maps.google.com/?${appointmentData?.clinic?.address}`}><img src={LOCATION_IMAGE} /></a>
                            <a href={`tel:${appointmentData?.phone_code}`}><img src={CONTACT_IMAGE} /></a></React.Fragment>
                          }

                          {appointmentData?.appointment_type == "virtual" && appointmentData?.status != "canceled" && <React.Fragment><a target="_blank" href={`http://maps.google.com/?${accountInfo?.address}`}>
                            <img src={LOCATION_IMAGE} /></a>
                          </React.Fragment>
                          }

                        </div>
                      </div>
                      <div className="appointmentConfirmSection">
                        <div className="appointmentConfirmTitle">Service</div>
                        <div className="appointmentConfirmText"><b>{appointmentData?.service?.name}</b> - {appointmentData?.service?.duration || appointmentData?.service?.custom_duration} minutes {categoryData?.service_category}</div>
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
                        <div className="appointmentConfirmText">Age: {getAge(petData?.dob)}</div>
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