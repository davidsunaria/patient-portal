import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { getLoggedinUserId, showFormattedDate, formatDate } from "patient-portal-utils/Service";
import { Link, useHistory, useParams } from "react-router-dom";
import moment from "moment";
const AntiParasiticRecord = (props) => {
  const [isBottom, setIsBottom] = useState(false);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const getAntiParasiticRecord = useStoreActions((actions) => actions.pet.getAntiParasiticRecord);
  const getDewormingDetail = useStoreActions((actions) => actions.pet.getDewormingDetail);
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
      page: 1, pagesize: 20
    }
    await getAntiParasiticRecord({ clientId: getLoggedinUserId(), petId: props.petId, query: formData });
    window.addEventListener('scroll', (e) => handleScroll(e), true);
    return () => {
      window.removeEventListener('scroll', (e) => handleScroll(e))
    };
  }, []);

  useEffect(() => {
    if (response) {
      let { status, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        if (data && data.deworming_details !== undefined) {
          let serverRespone= [];
          serverRespone.push(data?.deworming_details);
          setRecords(serverRespone);
        }
        if (data && data.deworming !== undefined) {
          const { current_page, next_page_url, per_page } = data.deworming;

          setCurrentPage(current_page);
          setNextPageUrl(next_page_url);
          setPerPage(per_page);

          let serverRespone = data.deworming.data;
          if (current_page != 1) {
            serverRespone = [...records, ...serverRespone]
          }
          let dateMap = {}
          serverRespone.forEach((e, i) => {
            if (e.due_date) {
              const date = moment(e.due_date).toDate()
              const type = e.type;
              if (dateMap[type]) {
                if (date > dateMap[type]?.date) {
                  serverRespone[dateMap[type].i].due_date = "";
                  dateMap[type] = { i, date }
                } else {
                  serverRespone[i].due_date = "";
                }
              } else dateMap[type] = { i, date }
            }
          });
          setRecords(serverRespone);
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
      await getAntiParasiticRecord({ clientId: getLoggedinUserId(), petId: props.petId, query: formData });
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


  useEffect(async() => {
      if(props.petId && props.visitId){
        console.log("heloo");
        await getDewormingDetail(props.visitId);
      }
  }, [props.petId,props.visitId]);
  return (
    <React.Fragment>

      {records && records.length > 0 ? (
        records.map((val, index) => (
          <div key={index} className="box recordCard">
            {val.due_date && <div className={`dueDate ${getDuedate(val)}`}>Due: {(val.due_date) ? showFormattedDate(val?.due_date, false) : ''}</div>}
            <div className="recordDate">
              <span>{(val.d_date) ? formatDate(val?.d_date, 1, false) : ''}</span>
              <p>{(val.d_date) ? formatDate(val?.d_date, 2, false) : ''}</p>
            </div>
            <p><label>Medication:</label><span>{val?.type}</span></p>
            <p><label>Type:</label><span>{val?.medicine_administered}</span></p>
          </div>
        ))

      ) : (
        <div >
          <p><label>No record found:</label></p>
        </div>
      )}



    </React.Fragment>
  );

};

export default AntiParasiticRecord;
