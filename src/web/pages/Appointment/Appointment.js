import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import Overlay from "patient-portal-components/Overlay/Overlay.js";
import PetList from "patient-portal-components/Pets/PetList.js";
import Header from "patient-portal-components/Header/Header.js";
import Divider from "patient-portal-components/Divider/Divider.js";
import AppointmentCard from "patient-portal-components/AppointmentCard/AppointmentCard.js";
import ProfileInfo from "patient-portal-pages/Profile/ProfileInfo.js";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Tabs from "patient-portal-components/Tabs/Tabs.js";
import Table from "patient-portal-components/Table/Table.js";
import Input from "patient-portal-components/Input/Input.js";
import Button from "patient-portal-components/Button/Button.js";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";

const Appointment = (props) => {
  const history = useHistory();
  const [tableData, setTableData] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [loaderText, setLoaderText] = useState("Loading");
  const [showLoader, setShowLoader] = useState(false);
  const tabsData = [
    { name: "Upcoming Appointments", handler: "upcoming" },
    { name: "Past Appointments", handler: "past" },
  ];
  const tableHeaders = [
    "Hospital Name",
    "Date & Time",
    "Services",
    "Doctor",
    "Pet",
    "Actions",
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
            />
            <Divider showIcon={false} />
            <Tabs
              tabsData={tabsData}
              selectedTab={selectedTab}
              tabsHandler={(tab) => tabsHandler(tab)}
            />
            <AppointmentCard headers={tableHeaders} tableData={tableData} />
          </main>
        </div>
      </div>

      {showLoader && (
        <div className="loaderOuter">
          <div className="loaderOuter">
            <div className="loader">
              <div className="spinner-border text-primary" role="status"></div>
              <p>{loaderText} ...</p>
            </div>
          </div>
        </div>
      )}

      {/*{showDelete && (
        <Overlay
          title={"Are you sure?"}
          subTitle={"Are you sure you want to delete this questionnaire?"}
          closeOverlay={() => setShowDelete(false)}
          cancelOverlay={() => setShowDelete(false)}
          submitOverlay={() => deleteFormCall()}
          disableBtn={disableButton}
          isDelete={true}
        ></Overlay>
      )}
      {showImageUploader && (
        <Overlay
          title={"Upload Profile Picture"}
          subTitle={""}
          closeOverlay={() => setShowImageUploader(false)}
          cancelOverlay={() => setShowImageUploader(false)}
          submitOverlay={() => saveFile()}
          disableBtn={disableButton}
          isDelete={false}
        >
          {tmpFile == "" ? (
            <Dropzone onDrop={(file) => uploadFile(file)}>
              {({ getRootProps, getInputProps }) => (
                <div className="container">
                  <div
                    {...getRootProps({
                      className: "dropzone",
                      onDrop: (event) => event.stopPropagation(),
                      style: style,
                    })}
                  >
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                </div>
              )}
            </Dropzone>
          ) : (
            <div className="settingProfilePic dropzone-container-area">
              <img src={tmpFile} />
              <a className="uploadPic" onClick={() => setTmpFile("")}>
                Delete
              </a>
            </div>
          )}
        </Overlay>
      )}*/}
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

export default Appointment;
