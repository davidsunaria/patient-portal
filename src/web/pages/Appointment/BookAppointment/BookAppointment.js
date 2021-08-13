import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import Overlay from "patient-portal-components/Overlay/Overlay.js";
import PetList from "patient-portal-components/Pets/PetList.js";
import Header from "patient-portal-components/Header/Header.js";
import Divider from "patient-portal-components/Divider/Divider.js";
import ProfileInfo from "patient-portal-pages/Profile/ProfileInfo.js";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Tabs from "patient-portal-components/Tabs/Tabs.js";
import Table from "patient-portal-components/Table/Table.js";
import Input from "patient-portal-components/Input/Input.js";
import Button from "patient-portal-components/Button/Button.js";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";

const BookAppointment = (props) => {
  const history = useHistory();
  const [tableData, setTableData] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [userData, setUserData] = useState(null);


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
            />
            
            <Step1 />
            <Step2 />
            <Step3 />
            <Step4 />
            <Step5 />
          </main>
        </div>
      </div>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </React.Fragment>
  );
};

export default BookAppointment;
