import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Header from "patient-portal-components/Header/Header.js";
import Divider from "patient-portal-components/Divider/Divider.js";
import "react-toastify/dist/ReactToastify.css";
import Tabs from "patient-portal-components/Tabs/Tabs.js";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import TreatmentInstruction from "patient-portal-components/TreatmentInstruction/TreatmentInstruction.js";
import TreatmentDetail from "patient-portal-pages/Pretreatment/TreatmentDetail.js";
import { useStoreActions, useStoreState } from "easy-peasy";
import { getLoggedinUserId } from "patient-portal-utils/Service";

import NoRecord from "patient-portal-components/NoRecord";

const Treatment = (props) => {
  const history = useHistory();
  const { id } = useParams();
  const [title, setTitle] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showId, setShowId] = useState(null);
  const [selectedTab, setSelectedTab] = useState('before-treatment');
  const tabsData = [{ name: "Before Treatment", handler: "before-treatment" }, { name: "After Treatment", handler: "after-treatment" }];
  const tableHeaders = ["Name", "Date & Time"];
 
  const tabsHandler = (tab) => {
    setSelectedTab(tab.handler);
  }

  useEffect(async () => {
    //console.log("Hiooks", selectedTab, id);
    if (selectedTab && !id) {
      setShowDetail(false);
    }
  }, [selectedTab, id]);
 
  const onTreatmentDetail = (id) => {
    setShowId(id);
    setShowDetail(true);
  }

  useEffect(() => {
    if (id) {
      setShowId(id);
      setShowDetail(true);
    }
  }, [id]);

  const onRenderDetail = (type) => {
    //console.log("sdsdsd", type)
    if(type == "pre"){
      setTitle("before");
      setSelectedTab('before-treatment');
    }
    else{
      setTitle("after");
      setSelectedTab('after-treatment');
    }
    
  }
  const resetTab = async() => {
    let tab;
    if(title == "before"){
      tab = "before-treatment";
    }
    else{
      tab = "after-treatment";
    }
    history.push(`/treatments`);
    setShowDetail(false);
    setSelectedTab(tab);
  } 
  const onLoad = ()  => {
    setShowDetail(false);
  }
  return (
    <React.Fragment>
      <div className="content_outer">
        <Sidebar activeMenu="treatments" />
        <div className="right_content_col">
          <main>
            <Header
              rerender={resetTab}
              backEnabled={showDetail == true ? true : false}
              backTitle={`Back to ${ (title) ? title +'-' : ''}treatment`}
              backAction={"treatments"}
              heading={"Treatment Instructions"}
              subHeading={"Please go through these treatment instructions to take care of your pet before & after a procedure with DCC"}
              hasBtn={false} />
            <Divider showIcon={false} />
            <Tabs key={1} tabsData={tabsData} selectedTab={selectedTab} tabsHandler={(tab) => tabsHandler(tab)} />
            
            {!showDetail && <TreatmentInstruction selectedTab={selectedTab} id={id} onLoad={onLoad} onTreatmentDetail={onTreatmentDetail} />}
            {showDetail && <TreatmentDetail onRender={onRenderDetail} id={showId} />}
          </main>
        </div>
      </div>

    </React.Fragment>
  );
};

export default Treatment;
