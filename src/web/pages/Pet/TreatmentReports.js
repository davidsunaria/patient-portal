import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import REPORT_DOWNLOAD from "patient-portal-images/report-download.svg";
import REPORT_SHARE from "patient-portal-images/report-share.svg";
import Header from "patient-portal-components/Header/Header.js";
import Divider from "patient-portal-components/Divider/Divider.js";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import { formatDate } from "patient-portal-utils/Service";
import GO_BACK_IMAGE from "patient-portal-images/goBack.svg";

const TreatmentReports = () => {
  const history = useHistory();
  const { id } = useParams();
  const [isBottom, setIsBottom] = useState(false);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const getReportsByVisit = useStoreActions((actions) => actions.pet.getReportsByVisit);
  const response = useStoreState((state) => state.pet.response);
  const isLoading = useStoreState((state) => state.common.isLoading);
  const lastScrollTop = useRef(0);
  const [petData, setPetData] = useState({});

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

  useEffect(async () => {
    if (id) {
      let formData = {
        page: process.env.REACT_APP_FIRST_PAGE, pagesize: process.env.REACT_APP_PER_PAGE
      }
      await getReportsByVisit({ id: id, query: formData });
      window.addEventListener('scroll', (e) => handleScroll(e), true);
      return () => {
        window.removeEventListener('scroll', (e) => handleScroll(e))
      };
    }
  }, [id]);

  useEffect(() => {
    if (response) {
      let { status, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        if (data && data.files !== undefined) {
          const { current_page, next_page_url, per_page } = data.files;

          setCurrentPage(current_page);
          setNextPageUrl(next_page_url);
          setPerPage(per_page);

          let serverRespone = data.files.data;
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
    }
  }, [response]);

  useEffect(() => {
    if (isBottom) {
      if (nextPageUrl) {
        setPage(parseInt(currentPage + 1));
      }
    }
  }, [isBottom, nextPageUrl]);
  //Get data on when scrolled
  useEffect(async () => {
    if (page && page > 1 && id) {
      console.log('Get next page ', page)
      let formData = {
        page: page,
        pagesize: perPage,
      }
      console.log('Get next page payload ', formData)
      await getReportsByVisit({ id: id, query: formData });
    }
  }, [page, id]);

  const downloadFile = (val) => {
    window.open(val.file_full_url, "_blank");
  }
  return (
    <React.Fragment>

      <div className="content_outer">

        <Sidebar activeMenu="pets" />
        <div className="right_content_col">
          <main>
            <a className="backTo" onClick={() => history.push("/pets")}>
              <img src={GO_BACK_IMAGE} /> Back to pets
            </a>
            <Header heading={"Reports"} subHeading={"Here we can view all reports related to visit"} />
            <Divider />

            {records && records.length > 0 ? (
              records.map((val, index) => (
                <div key={index} className="box recordCard">
                  <div className="reportAction onHover">
                    <img src={REPORT_DOWNLOAD} onClick={() => downloadFile(val)} />
                    {/* <Link><img src={REPORT_SHARE}/></Link> */}
                  </div>
                  <div className="recordDate">
                    <span>{(val.created) ? formatDate(val?.created, 1, false) : ''}</span>
                    <p>{(val.created) ? formatDate(val?.created, 2, false) : ''}</p>
                  </div>
                  <p className="reportType"><label>{val?.title}</label></p>
                </div>


              ))

            ) : (
              <div className="noRecord">
                <p><label>No record found:</label></p>
              </div>
            )}
          </main>
        </div>
      </div>
    </React.Fragment>
  );
}
export default TreatmentReports;