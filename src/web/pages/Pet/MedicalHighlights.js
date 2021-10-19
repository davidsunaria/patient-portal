import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { getLoggedinUserId, showFormattedDate, formatDate } from "patient-portal-utils/Service";
import { Link, useHistory, useParams } from "react-router-dom";
import moment from "moment";
import NoRecord from "patient-portal-components/NoRecord";

const MedicalHighlights = (props) => {
  const [isBottom, setIsBottom] = useState(false);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const getMedicalRecords = useStoreActions((actions) => actions.pet.getMedicalRecords);
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
    if (props.petId) {
      let formData = {
        page: process.env.REACT_APP_FIRST_PAGE, pagesize: process.env.REACT_APP_PER_PAGE
      }
      await getMedicalRecords({ clientId: getLoggedinUserId(), petId: props.petId, query: formData });
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
        if (data && data.medical_records !== undefined) {
          const { current_page, next_page_url, per_page } = data.medical_records;

          setCurrentPage(current_page);
          setNextPageUrl(next_page_url);
          setPerPage(per_page);

          let serverRespone = data.medical_records.data;
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
  }, [isBottom]);

  //Get data on when scrolled
  useEffect(async () => {
    if (page && page > 1) {
      console.log('Get next page ', page)
      let formData = {
        page: page,
        pagesize: perPage,
      }
      console.log('Get next page payload ', formData)
      await getMedicalRecords({ clientId: getLoggedinUserId(), petId: props.petId, query: formData });
    }
  }, [page]);

  return (
    <React.Fragment>
      <div className="box mb-2">
      <div className={records && records.length > 0 ? "timeline" : ""}>
          {records && records.length > 0 ? (
            records.map((val, index) => (

              <div className="timelineSection" key={index}>
                <div className="timelineTime">{(val.d_date) ? formatDate(val?.d_date, 1, false) : ''} {(val.d_date) ? formatDate(val?.d_date, 2, false) : ''}</div>
                <div className="timelineDetail">
                  <div>
                    <p><span>{val?.treatment}</span></p>
                    <p className="mt-2">{val?.description}</p>
                  </div>
                </div>
              </div>
            ))

          ) : (
            <NoRecord />
          )}
        </div>
      </div>
    </React.Fragment>
  );

};

export default MedicalHighlights;
