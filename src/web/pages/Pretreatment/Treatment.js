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
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import TreatmentInstruction from "patient-portal-components/TreatmentInstruction/TreatmentInstruction.js";
import TreatmentDetail from "patient-portal-pages/Pretreatment/TreatmentDetail.js";


import { useStoreActions, useStoreState } from "easy-peasy";
import { getLoggedinUserId } from "patient-portal-utils/Service";


const Treatment = (props) => {
  const history = useHistory();
  const [showDetail, setShowDetail] = useState(false);
  const [showId, setShowId] = useState(null);
  const [instructions, setInstructions] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('pre-treatment');
  const tabsData = [{ name: "Pre-Treatment", handler: "pre-treatment" }, { name: "Post-Treatment", handler: "post-treatment" }];
  const tableHeaders = ["Name", "Date & Time"];
  const getInstructions = useStoreActions((actions) => actions.treatment.getInstructions);
  const response = useStoreState((state) => state.treatment.response);

  const tabsHandler = (tab) => {
    setSelectedTab(tab.handler);
  }


  useEffect(async () => {

    let type;
    if (selectedTab === "pre-treatment") {
      type = 'pre';
    }
    if (selectedTab === "post-treatment") {
      type = 'post';
    }
    await getInstructions({ clientId: getLoggedinUserId(), type: type });
    setShowDetail(false);
  }, [selectedTab]);

  useEffect(() => {
    if (response) {
      let { message, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        if (data?.treatmentInstructions) {
          setInstructions(data.treatmentInstructions);
        }
      }
    }
  }, [response]);
  const onTreatmentDetail = (id) => {
    setShowId(id);
    setShowDetail(true);
  }
  return (
    <React.Fragment>
      <div className="content_outer">
        <Sidebar activeMenu="treatments" />
        <div className="right_content_col">
          <main>
            <Header heading={"Treatment Instructions"} subHeading={"Please go through these treatment instructions to take care of your pet before & after a procedure with DCC"} hasBtn={false} />
            <Divider showIcon={false} />
            <Tabs key={1} tabsData={tabsData} selectedTab={selectedTab} tabsHandler={(tab) => tabsHandler(tab)} />
            {/* <Table headers={tableHeaders} tableData={tableData} /> */}
            {!showDetail && <TreatmentInstruction data={instructions} onTreatmentDetail={onTreatmentDetail} />}
            {showDetail && <TreatmentDetail id={showId} />}
          </main>
        </div>
      </div>

    </React.Fragment>
  );
};

export default Treatment;
