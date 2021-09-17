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
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const tabsData = [
    { name: "Upcoming Appointments", handler: "upcoming" },
    { name: "Past Appointments", handler: "past" },
  ];

  const tabsHandler = (tab) => {
    setSelectedTab(tab.handler);
  };
  
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
            <AppointmentCard type={selectedTab} />
          </main>
        </div>
      </div>


    </React.Fragment>
  );
};

export default Appointment;
