import React, { useState, useEffect, useCallback, useRef } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { getLoggedinUserId, showFormattedDate, formatDate } from "patient-portal-utils/Service";
import { Link, useHistory, useParams } from "react-router-dom";
import PRESCRIPTION_IMAGE from "patient-portal-images/dropPrescription.svg";
import INVOICE_IMAGE from "patient-portal-images/dropInvoice.svg";
import REPORT_IMAGE from "patient-portal-images/dropReport.svg";
import NoRecord from "patient-portal-components/NoRecord";

const TreatmentRecord = (props) => {
  const history = useHistory();
  const [isBottom, setIsBottom] = useState(false);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const getTreatmentRecord = useStoreActions((actions) => actions.pet.getTreatmentRecord);
  const downloadReport = useStoreActions((actions) => actions.pet.downloadReport);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const lastScrollTop = useRef(0);
  const response = useStoreState((state) => state.pet.response);
  const getTreatmentDetail = useStoreActions((actions) => actions.pet.getTreatmentDetail);
  const { id, type, visitId } = useParams();
  useEffect(async () => {
    if (props.petId) {
      console.log("Treatment records", id, type, visitId);
      if (!type && !visitId) {
        let formData = {
          page: process.env.REACT_APP_FIRST_PAGE, pagesize: process.env.REACT_APP_PER_PAGE
        }
        await getTreatmentRecord({ clientId: getLoggedinUserId(), petId: props.petId, query: formData });
      }
      window.addEventListener('scroll', (e) => handleScroll(e), true);
      return () => {
        window.removeEventListener('scroll', (e) => handleScroll(e))
      };
    }
  }, [props.petId, props.forceRender]);

  useEffect(() => {
    if (response) {
      let { status, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        if (data?.visits !== undefined) {
          const { current_page, next_page_url, per_page } = data.visits;

          setCurrentPage(current_page);
          setNextPageUrl(next_page_url);
          setPerPage(per_page);

          let serverRespone = data.visits.data;
          console.log("serverRespone", serverRespone);
          if (current_page == 1) {
            setRecords(serverRespone);
          }
          else {
            serverRespone = [...records, ...serverRespone];
            setRecords(serverRespone);
          }
          setIsBottom(false);
        }
      }
      if (data?.file_url) {
        setDownloadUrl(data?.file_url);
      }

      if (data && data.appointment !== undefined) {
        let serverRespone = [];
        serverRespone.push(data)
        setRecords(serverRespone);
      }
    }
  }, [response]);

  const getDate = (result, type) => {
    return formatDate(result?.visit_date, type, false);
  }
  const downloadData = async (result, type) => {
    if (type == "prescription") {
      await downloadReport({ url: '/prescription/download/', id: result.id });
    }
    if (type == "invoice") {
      await downloadReport({ url: '/download/invoice/', id: result.invoice.id });
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


  const handleScroll = useCallback((e) => {
    const scrollTop = parseInt(Math.max(e?.srcElement?.scrollTop));
    let st = scrollTop;
    if (st > lastScrollTop.current) {
      if (scrollTop + window.innerHeight + 50 >= e?.srcElement?.scrollHeight) {
        setIsBottom(true);
      }
    } else {
      setIsBottom(false);
    }
    setTimeout(() => {
      lastScrollTop.current = st <= 0 ? 0 : st;
    }, 0)
  }, []);

  useEffect(() => {
    if (isBottom) {
      if (nextPageUrl) {
        setPage(parseInt(currentPage + 1));
      }
    }
  }, [isBottom, nextPageUrl]);
  //Get data on when scrolled
  useEffect(async () => {
    if (page && page > 1 && props.petId) {
      console.log('Get next page ', page)
      let formData = {
        page: page,
        pagesize: perPage,
      }
      console.log('Get next page payload ', formData)
      await getTreatmentRecord({ clientId: getLoggedinUserId(), petId: props.petId, query: formData });
    }
  }, [page, props.petId]);

  useEffect(async () => {
    if (props.petId && props.visitId && type && visitId) {
      await getTreatmentDetail(props.visitId);
    }
  }, [props.petId, props.visitId]);

  return (
    <React.Fragment>
      <div className="box mb-2">
        <div className={records && records.length > 0 ? "timeline" : ""}>

          {records && records.length > 0 ? (
            records.map((result, index) => (
              <div key={index} className={"timelineSection"} >

                <div className="timelineTime">{getDate(result, 3)} | {getDate(result, 4)}</div>
                {/* className={(result.id == props.visitId) ? (executeScroll(result.id).cls) : "timelineDetail"} */}
                <div id={result.id} className={"timelineDetail"}>

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
            <NoRecord extraClass={"text-center"} />
          )}
        </div>
      </div>
    </React.Fragment>
  );

};

export default TreatmentRecord;
