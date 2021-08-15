import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Header from "patient-portal-components/Header/Header.js";
import Divider from "patient-portal-components/Divider/Divider.js";
import AppointmentCard from "patient-portal-components/AppointmentCard/AppointmentCard.js";
import "react-toastify/dist/ReactToastify.css";

import Tabs from "patient-portal-components/Tabs/Tabs.js";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import { useStoreActions, useStoreState } from "easy-peasy";
import { getLoggedinUserId } from "patient-portal-utils/Service";

const Appointment = (props) => {
  const history = useHistory();
  const getUpcomingAppointments = useStoreActions((actions) => actions.appointment.getUpcomingAppointments);
  const getPastAppointments = useStoreActions((actions) => actions.appointment.getPastAppointments);
  const cancelAppointment = useStoreActions((actions) => actions.appointment.cancelAppointment);
  const response = useStoreState((state) => state.appointment.response);
  const isRescheduled = useStoreState((state) => state.appointment.isRescheduled);
  const isCancelled = useStoreState((state) => state.appointment.isCancelled);
  
  const [appointments, setAppointments] = useState([]);
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const tabsData = [
    { name: "Upcoming Appointments", handler: "upcoming" },
    { name: "Past Appointments", handler: "past" },
  ];

  const tabsHandler = (tab) => {
    setSelectedTab(tab.handler);
  };
  useEffect(async () => {
    if (selectedTab == "upcoming") {
      await getUpcomingAppointments(getLoggedinUserId());
    }
    if (selectedTab == "past") {
      await getPastAppointments(getLoggedinUserId());
    }
  }, [selectedTab]);

  useEffect(() => {
    if (response) {
      let { status, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        if (data?.appointments && data.appointmentType == "future") {
          setAppointments(data?.appointments);
        }
        if (data?.appointments && data.appointmentType == "past") {
          setAppointments(data?.appointments);
        }
      }
    }
  }, [response]);

  useEffect(async () => {
    if (isRescheduled || isCancelled) {
      if (selectedTab == "upcoming") {
        await getUpcomingAppointments(getLoggedinUserId());
      }
    }
  }, [isRescheduled, isCancelled]);

  const onCancelAppointment = async(id) => {
    await cancelAppointment({ id: id, clientId: getLoggedinUserId() });
  }
  return (
    <React.Fragment>
      <div className="content_outer">
        <Sidebar activeMenu="appointment" />
        <div className="right_content_col">
          <main>
          
            <Header
              heading={"Appointments"}
              subHeading={"Here we can book or reschedule your appointments"}
              hasBtn={true}
              btnName={"calendar"}
              btnTitle="Book an appointment"
              onClick={"book-appointment"}
            />
            <Divider showIcon={false} />
            <Tabs
              tabsData={tabsData}
              selectedTab={selectedTab}
              tabsHandler={(tab) => tabsHandler(tab)}
            />
            <AppointmentCard onCancelAppointment={onCancelAppointment} data={appointments} type={selectedTab} />
          </main>
        </div>
      </div>


    </React.Fragment>
  );
};

export default Appointment;
