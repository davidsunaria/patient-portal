import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { getLoggedinUserId, showFormattedDate, formatDate } from "patient-portal-utils/Service";
import NoRecord from "patient-portal-components/NoRecord";
import { useStoreActions, useStoreState } from "easy-peasy";

const TreatmentInstruction = (props) => {
  const history = useHistory();
  const lastScrollTop = useRef(0);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [isBottom, setIsBottom] = useState(false);
  const [formData, setFormData] = useState({});
  const getInstructions = useStoreActions((actions) => actions.treatment.getInstructions);
  const response = useStoreState((state) => state.treatment.response);

  useEffect(async () => {
    if (props.selectedTab && !props.id) {
      setNextPageUrl(null);
      setCurrentPage(1);
      setPage(1);
      let type;
      if (props.selectedTab === "pre-treatment") {
        type = 'pre';
      }
      if (props.selectedTab === "post-treatment") {
        type = 'post';
      }
      await getInstructions({ clientId: getLoggedinUserId(), type: type, query: { page: process.env.REACT_APP_FIRST_PAGE, pagesize: process.env.REACT_APP_PER_PAGE } });
      props.onLoad();
    }
    window.addEventListener('scroll', (e) => handleScroll(e), true);
    return () => {
      window.removeEventListener('scroll', (e) => handleScroll(e))
    };
  }, [props.selectedTab, props.id]);

  useEffect(() => {
    if (response) {
      let { status, statuscode, data } = response;
      if (statuscode && statuscode === 200) {

        if (data?.treatmentInstructions) {

          const { current_page, next_page_url, per_page } = data.treatmentInstructions;

          setCurrentPage(current_page);
          setNextPageUrl(next_page_url);
          setPerPage(per_page);

          let serverRespone = data.treatmentInstructions.data;
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
    if (isBottom && nextPageUrl) {
      console.log("Setting Page", isBottom, nextPageUrl, currentPage,parseInt(currentPage + 1) )
      setPage(parseInt(currentPage + 1));
    }
  }, [isBottom, nextPageUrl]);

  //Get data on when scrolled
  useEffect(async () => {
    if (page && parseInt(page) > 1) {
      console.log('Get next page ', page, props.selectedTab)
      console.log('Get next page payload ', formData)
      let type;
      if (props.selectedTab === "pre-treatment") {
        type = 'pre';
      }
      if (props.selectedTab === "post-treatment") {
        type = 'post';
      }
      await getInstructions({
        clientId: getLoggedinUserId(), type: type, query: {
          ...formData, page: page,
          pagesize: perPage,
        }
      });
    }
  }, [page]);

  return (
    <React.Fragment>
      Testt
      {records && records.length > 0 ? (
        records.map((result, index) => (

          <div key={index} className="box treatmentInstruction onHover" onClick={() => props.onTreatmentDetail(result.treatment_instruction_id)}>
           <div className="instrutionName">{result?.title}</div>
            <div className="instrutionDate">{result?.treatment_date} | {result?.treatment_time}</div>
          </div>
        ))
      ) : (
        <NoRecord />
      )}
     

    </React.Fragment>
  );
}

export default TreatmentInstruction;