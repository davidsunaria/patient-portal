import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Header from "patient-portal-components/Header/Header.js";
import Divider from "patient-portal-components/Divider/Divider.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tabs from "patient-portal-components/Tabs/Tabs.js";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import { useStoreActions, useStoreState } from "easy-peasy";
import { formatDate } from "patient-portal-utils/Service";

const TreatmentDetail = (props) => {
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState('before-treatment');
  const tabsData = [{ name: "Before Treatment", handler: "before-treatment" }, { name: "After Treatment", handler: "after-treatment" }];
  const tableHeaders = ["Name", "Date & Time"];
  const [instruction, setInstruction] = useState([]);

  const getInstructionDetail = useStoreActions((actions) => actions.treatment.getInstructionDetail);
  const response = useStoreState((state) => state.treatment.response);

  const tabsHandler = (tab) => {
    setSelectedTab(tab.handler);
  }
  useEffect(async () => {
    if (props.id) {
      await getInstructionDetail(props.id);
    }
  }, [props.id]);
  useEffect(() => {
    if (response) {
      let { message, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        if (data?.treatment_instruction) {
          setInstruction(data.treatment_instruction);
          props.onRender(data?.treatment_instruction?.instruction.type);
        }
      }
    }
  }, [response]);

 
 

 
  return (
    <React.Fragment>
      <div className="box">
        
        <div className="teatmentTitle">{instruction?.instruction?.title}</div>
        <div className="treatmentDate">{formatDate(instruction?.appointment?.appointment_datetime, 3)} | {formatDate(instruction?.appointment?.appointment_datetime, 4)} </div>
        <p className="p-text" dangerouslySetInnerHTML={{ __html: instruction?.instruction?.instructions }} />
      </div>
    </React.Fragment>
  );
};

export default TreatmentDetail;
