import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Overlay from "patient-portal-components/Overlay/Overlay.js";
import Header from "patient-portal-components/Header/Header.js";
import Divider from "patient-portal-components/Divider/Divider.js";
import PetProfile from "patient-portal-components/Pets/PetProfile.js";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";

import TreatmentRecord from "patient-portal-pages/Pet/TreatmentRecord.js";
import VaccinationRecord from "patient-portal-pages/Pet/VaccinationRecord.js";
import AntiParasiticRecord from "patient-portal-pages/Pet/AntiParasiticRecord.js";
import Reports from "patient-portal-pages/Pet/Reports.js";
import MedicalHighlights from "patient-portal-pages/Pet/MedicalHighlights.js";
import { useStoreActions, useStoreState } from "easy-peasy";

const ProfileView = (props) => {
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState('treatment_record');
  const [petData, setPetData] = useState({});
  const getPet = useStoreActions((actions) => actions.pet.getPet);
  const response = useStoreState((state) => state.pet.response);
  const { id, visitId, type } = useParams();

  useEffect(async () => {
    await getPet(id);
  }, []);

  useEffect(() => {
    if (response) {
      let { status, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        if (data?.pet) {
          setPetData(data?.pet);
        }
      }
    }
  }, [response]);
  const selectedTab = (type) => {
    setCurrentTab(type)
  }

  useEffect(() => {
    if (type) {
      if (type == "antiparasitic-record" || type == "deworming") {
        setCurrentTab("antiparasitic_record");
      }
      if (type == "vaccination-record") {
        setCurrentTab("vaccination_record");
      }
      if (type == "report") {
        setCurrentTab("reports_record");
      }
    }
  }, [type]);
  return (
    <React.Fragment>
      <div className="content_outer">
        <Sidebar activeMenu="pets" />
        <div className="right_content_col">
          <main>
            <Header backEnabled={true}
              backTitle={"Back to profile"}
              backAction={"pets"} heading={"Profile"} subHeading={"Here we can add or edit pet information"} />
            <PetProfile data={petData} />
            <Divider />

            <ul className="customTabs">
              <li><a className={` ${currentTab && currentTab == "treatment_record" ? "active" : ""}`} onClick={() => selectedTab('treatment_record')}>Treatment Record</a></li>
              <li><a className={` ${currentTab && currentTab == "vaccination_record" ? "active" : ""}`} onClick={() => selectedTab('vaccination_record')}>Vaccination Record</a></li>
              <li><a className={` ${currentTab && currentTab == "antiparasitic_record" ? "active" : ""}`} onClick={() => selectedTab('antiparasitic_record')}>Anti-Parasitic Record</a></li>
              <li><a className={` ${currentTab && currentTab === "reports_record" ? "active" : ""}`} onClick={() => selectedTab('reports_record')}>Reports</a></li>
              <li><a className={` ${currentTab && currentTab == "medical_highlights_record" ? "active" : ""}`} onClick={() => selectedTab('medical_highlights_record')}>Medical Highlights</a></li>
            </ul>

            {currentTab && currentTab == "treatment_record" && <TreatmentRecord petId={id} visitId={visitId} />}
            {currentTab && currentTab == "vaccination_record" && <VaccinationRecord petId={id} visitId={visitId} />}
            {currentTab && currentTab == "antiparasitic_record" && <AntiParasiticRecord petId={id} visitId={visitId} />}
            {currentTab && currentTab == "reports_record" && <Reports petId={id} visitId={visitId} />}
            {currentTab && currentTab == "medical_highlights_record" && <MedicalHighlights petId={id} />}
          </main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProfileView;
