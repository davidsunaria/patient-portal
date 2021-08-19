import React, { useState, useEffect, useRef } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { getLoggedinUserId, showFormattedDate, formatDate } from "patient-portal-utils/Service";
import { Link, useHistory, useParams } from "react-router-dom";
import PRESCRIPTION_IMAGE from "patient-portal-images/dropPrescription.svg";
import INVOICE_IMAGE from "patient-portal-images/dropInvoice.svg";
import REPORT_IMAGE from "patient-portal-images/dropReport.svg";


const TreatmentRecord = (props) => {
  const history = useHistory();
  const [data, setData] = useState({});
  const getTreatmentRecord = useStoreActions((actions) => actions.pet.getTreatmentRecord);
  const downloadReport = useStoreActions((actions) => actions.pet.downloadReport);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const response = useStoreState((state) => state.pet.response);
  useEffect(async () => {
    await getTreatmentRecord({ clientId: getLoggedinUserId(), petId: props.petId });
  }, []);

  useEffect(() => {
    if (response) {
      let { status, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        if (data?.pet) {
          setData(data?.pet.visits);
        }
        if (data?.file_url) {
          setDownloadUrl(data?.file_url);
        }
      }
    }
  }, [response]);

  const getDate = (result, type) => {
    if (result.appointment) {
      return formatDate(result?.appointment?.appointment_datetime, type, false);
    }
    else {
      return formatDate(result?.visit_date, type, false);
    }
  }
  const downloadData = async (result, type) => {
    if (type == "prescription") {
      await downloadReport({ url: '/prescription/download/', id: result.id });
    }
    if (type == "invoice") {
      await downloadReport({ url: '/download/invoice/', id: result.id });
    }
    if (type == "file") {
      history.push(`/treatment-record-reports/${result.id}`);
    }
  }
  useEffect(() => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  }, [downloadUrl]);

  const executeScroll = (id) => {
    const element = document.getElementById(id);
    setTimeout(() => {
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
    return { cls: "highlightDiv timelineDetail" }
  }

  return (
    <React.Fragment>
      <div className="box mb-2">
        <div className="timeline">

          {data && data.length > 0 ? (
            data.map((result, index) => (
              <div key={index} className={"timelineSection"} >

                <div className="timelineTime">{getDate(result, 3)} | {getDate(result, 4)}</div>
                <div id={result.id} className={(result.id == props.visitId) ? (executeScroll(result.id).cls) : "timelineDetail"}>

                  {(result.prescription.length > 0 || result.invoice) && <div className="dropdownArrow">
                    <ul className="dropdownOption">
                      {result.prescription[0]?.id && <li className="onHover" onClick={() => downloadData(result, "prescription")}><img src={PRESCRIPTION_IMAGE} />Prescription</li>}
                      {result.invoice?.id && <li className="onHover" onClick={() => downloadData(result, "invoice")}><img src={INVOICE_IMAGE} />Invoice</li>}
                      {result.file && <li className="onHover" onClick={() => downloadData(result, "file")}><img src={REPORT_IMAGE} />Reports</li>}
                    </ul>
                  </div>
                  }
                  <div className="mb-2">
                    <p><span>Clinic: </span> {result?.clinic?.clinic_name}</p>
                    <p><span>Doctor: </span> {result?.doctor?.firstname} {result?.doctor?.lastname}</p>
                    <p><span>Service: </span> {result?.appointment?.service?.name}</p>
                  </div>
                  <div className="mb-2">
                    <span>Summary</span>
                    <p>Reason for visiting:<br /> {result?.short_summary}</p>
                  </div>
                  {/* <div>
                    <span>Follow-up Date</span>
                    <p>{ (result.follow_up_date) ? showFormattedDate(result?.follow_up_date, false) : ''}</p>
                  </div> */}
                </div>
              </div>
            ))
          ) : (
            <div>
              <p>No data found</p>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );

};

export default TreatmentRecord;
