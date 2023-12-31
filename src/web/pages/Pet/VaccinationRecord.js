import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { getLoggedinUserId, showFormattedDate, formatDate } from "patient-portal-utils/Service";
import { Link, useHistory, useParams } from "react-router-dom";
import moment from "moment";
import NoRecord from "patient-portal-components/NoRecord";

const VaccinationRecord = (props) => {
    const { type, visitId } = useParams();
    const [isBottom, setIsBottom] = useState(false);
    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPageUrl, setNextPageUrl] = useState(null);

    const getVaccinationRecord = useStoreActions((actions) => actions.pet.getVaccinationRecord);
    const getVaccinationDetail = useStoreActions((actions) => actions.pet.getVaccinationDetail);

    const response = useStoreState((state) => state.pet.response);
    const isLoading = useStoreState((state) => state.common.isLoading);

    const lastScrollTop = useRef(0)
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
        if (props.petId && !type && !visitId) {
            console.log("vaccination records", props);
            let formData = {
                page: process.env.REACT_APP_FIRST_PAGE, pagesize: process.env.REACT_APP_PER_PAGE
            }
            await getVaccinationRecord({ clientId: getLoggedinUserId(), petId: props.petId, query: formData });
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
                //console.log(data?.vaccination_details);
                if (data && data.vaccination_details !== undefined) {
                    setRecords(data?.vaccination_details);
                }

                if (data && data.vaccination !== undefined) {
                    const { current_page, next_page_url, per_page } = data.vaccination;
                    let serverRespone = data.vaccination.data || [];

                    setCurrentPage(current_page);
                    setNextPageUrl(next_page_url);
                    setPerPage(per_page);

                    if (serverRespone.length > 0) {
                        if (current_page != 1) {
                            serverRespone = [...records, ...serverRespone]
                        }
                        let dateMap = {
                        }
                        serverRespone.forEach((e, i) => {
                            if (e.due_date) {
                                const date = moment(e.due_date).toDate()
                                const type = e.vaccination_type
                                if (dateMap[type]) {
                                    if (date > dateMap[type]?.date) {
                                        serverRespone[dateMap[type].i].due_date = ""
                                        dateMap[type] = { i, date }
                                    } else {
                                        serverRespone[i].due_date = ""
                                    }
                                } else dateMap[type] = { i, date }
                            }
                        });
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
            await getVaccinationRecord({ clientId: getLoggedinUserId(), petId: props.petId, query: formData });
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

    useEffect(async () => {
        if (props.petId && props.visitId && type && visitId) {
            console.log("get detail");
            await getVaccinationDetail(props.visitId);
        }
    }, [props.petId, props.visitId]);

    const executeScroll = (id) => {
        const element = document.getElementById(id);
        setTimeout(() => {
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
        return { cls: "highlightDiv box recordCard" }
      }
    return (
        <React.Fragment>
            <div>
               
                {records && records.length > 0 ? (
                    records.map((val, index) => (
                        <div key={index} id={val.id} className={(val.id == props.visitId) ? (executeScroll(val.id).cls) : "box recordCard"}>
                            {val.due_date && <div className={`dueDate ${getDuedate(val)}`}> {(val.due_date) ? "Due:" + showFormattedDate(val?.due_date, false) : ''}</div>}
                            <div className="recordDate">
                                <span>{(val.d_date) ? formatDate(val?.d_date, 1, false) : ''}</span>
                                <p>{(val.d_date) ? formatDate(val?.d_date, 2, false) : ''}</p>
                            </div>
                            <p><label>Vaccination:</label><span>{val?.vaccination_type}</span></p>
                            <p><label>Medication:</label><span>{val?.medicine_administered}</span></p>
                        </div>
                    ))

                ) : (
                    <NoRecord />

                )}

            </div>

        </React.Fragment>
    );

};

export default VaccinationRecord;
