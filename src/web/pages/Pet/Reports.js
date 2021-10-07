import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { getLoggedinUserId, showFormattedDate, formatDate } from "patient-portal-utils/Service";
import { Link, useHistory, useParams } from "react-router-dom";
import moment from "moment";
import REPORT_DOWNLOAD from "patient-portal-images/report-download.svg";
import REPORT_SHARE from "patient-portal-images/report-share.svg";
import NoRecord from "patient-portal-components/NoRecord";


const Reports = (props) => {
  const [isBottom, setIsBottom] = useState(false);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const getReports = useStoreActions((actions) => actions.pet.getReports);
  const getReportDetail = useStoreActions((actions) => actions.pet.getReportDetail);

  const response = useStoreState((state) => state.pet.response);
  const isLoading = useStoreState((state) => state.common.isLoading);
  const lastScrollTop = useRef(0);

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
    let formData = {
      page: process.env.REACT_APP_FIRST_PAGE, pagesize: process.env.REACT_APP_PER_PAGE
    }
    await getReports({ clientId: getLoggedinUserId(), petId: props.petId, query: formData });
    window.addEventListener('scroll', (e) => handleScroll(e), true);
    return () => {
      window.removeEventListener('scroll', (e) => handleScroll(e))
    };
  }, []);

  useEffect(() => {
    if (response) {
      let { status, statuscode, data } = response;

      if (statuscode && statuscode === 200) {
        if (data && data.file !== undefined) {
          let serverRespone = [];
          serverRespone.push(data?.file);
          setRecords(serverRespone);
        }

        if (data && data.files !== undefined) {
          const { current_page, next_page_url, per_page } = data.files;

          setCurrentPage(current_page);
          setNextPageUrl(next_page_url);
          setPerPage(per_page);

          let serverRespone = data.files.data;
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
    if (page && page > 1) {
      console.log('Get next page ', page)
      let formData = {
        page: page,
        pagesize: perPage,
      }
      console.log('Get next page payload ', formData)
      await getReports({ clientId: getLoggedinUserId(), petId: props.petId, query: formData });
    }
  }, [page]);
  const getDuedate = (val) => {
    let status = 'orange';
    const { due_date } = val;
    let start = moment(due_date).format("YYYY-MM-DD");
    let end = moment().format("YYYY-MM-DD");
    let difference = moment(start).diff(end, 'days')
    if (difference >= 14) {
      status = ""
    } else if (difference < 0) {
      status = "red"
    }
    return status;
  }
  const downloadFile = (val) => {
    window.open(val.file_full_url, "_blank");
  }

  useEffect(async () => {
    if (props.petId && props.visitId) {
      await getReportDetail(props.visitId);
    }
  }, [props.petId, props.visitId]);

  return (
    <React.Fragment>

      {records && records.length > 0 ? (
        records.map((val, index) => (
          <div key={index} className="box recordCard">
            <div className="reportAction onHover">
              <img src={REPORT_DOWNLOAD} onClick={() => downloadFile(val)} />
            </div>
            <div className="recordDate">
              <span>{(val.created) ? formatDate(val?.created, 1, false) : ''}</span>
              <p>{(val.created) ? formatDate(val?.created, 2, false) : ''}</p>
            </div>
            <p className="reportType"><label>{val?.title}</label></p>
          </div>
        ))
      ) : (
        <NoRecord />
      )}





    </React.Fragment>
  );

};

export default Reports;
