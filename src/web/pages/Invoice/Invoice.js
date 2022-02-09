import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import Rating from "patient-portal-components/Rating/Rating";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Header from "patient-portal-components/Header/Header.js";

import INVOICE_PET from "patient-portal-images/invoicePet.svg";
import INVOICE_HOSPITAL_PET from "patient-portal-images/invoiceHospital.svg";
import CALENDER_IMAGE from "patient-portal-images/appointment.svg";
import { Formik, ErrorMessage } from "formik";
import { useStoreActions, useStoreState } from "easy-peasy";
import _, { set } from "lodash";
import { getLoggedinUserId, showFormattedDate, formatDate } from "patient-portal-utils/Service";
import NoRecord from "patient-portal-components/NoRecord";
import { subDays } from "date-fns";
import { filter } from "lodash";


const Invoice = (props) => {
    const calendarRef = useRef();
    const calendarRefto = useRef();
    const history = useHistory();
    const [isBottom, setIsBottom] = useState(false);
    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPageUrl, setNextPageUrl] = useState(null);

    const [isOpen, setIsOpen] = useState(false);
    const [dateRange, setDateRange] = useState([]);//[subDays(new Date(), 15), new Date()]
    const [dateRangeto, setDateRangeto] = useState([]);
    const [startDate, endDate] = dateRange;
    const [startDateto, endDateto] = dateRangeto;
    const [petId, setPetId] = useState([]);
    const [selectedID, setselectedID] = useState([]);
    const [clinicId, setClinicId] = useState([{ value: "", label: "Select clinics" }]);
    const [allClinics, setAllClinics] = useState([]);
    const [allPets, setAllPets] = useState([]);
    const [filterID, setfilterID] = useState([]);
    const [eventTrigger, seteventTrigger] = useState(false);
    const [selectedPets, setSelectedPets] = useState([]);
    const [emptyArray, setemptyArray] = useState(false);

    const getInvoices = useStoreActions((actions) => actions.invoice.getInvoices);
    const getAllClinics = useStoreActions((actions) => actions.invoice.getAllClinics);
    const response = useStoreState((state) => state.invoice.response);

    const getPets = useStoreActions((actions) => actions.pet.getPets);
    const responsePet = useStoreState((state) => state.pet.response);
    // const setSelectedPet = useStoreActions((actions) => actions.pet.setSelectedPet);
    // const getSelectedPet = useStoreState((state) => state.pet.getSelectedPet);

    const [formData, setFormData] = useState({
        pet_id: '',
        clinic_id: '',
        startDate: '',
        endDate: ''
    });
    useEffect(async () => {
        await getAllClinics();
        await getPets(getLoggedinUserId());
    }, []);

    const selectedPet = (event) => {
        // console.log("event", event)
        // setPetId(event)
        // event.forEach((val) => {
        //     filterID.push(val.value)
        // })
        // let selectedID = [...new Set(filterID)];
        // console.log("selectedid", selectedID)
        // let filterpetID = selectedID.join()
        // localStorage.setItem("filterpetID", filterpetID)
        setSelectedPets(event)
    }

    // useEffect(() => {
    //     //let filterpetID = localStorage.getItem("filterpetID")
    //      let filterID = localStorage.getItem("eventID")
    //     console.log("eventID id", filterID)
    //    // setselectedID(filterID)
    // }, [eventTrigger])

    // console.log("selectedID", selectedID)

    // console.log("petid", petId)
    useEffect(() => {
        if (responsePet) {
            let { status, statuscode, data } = responsePet;
            if (statuscode && statuscode === 200) {
                if (data?.pets) {
                    let result = [];
                    result.push({
                        value: "", label: "All"
                    });
                    _.forOwn(data?.pets, function (value, key) {
                        result.push({
                            value: value.id, label: value.name
                        });
                    });
                    setAllPets(result);
                }
            }
        }
    }, [responsePet]);

    useEffect(() => {
        if (response) {
            let { status, statuscode, data } = response;
            if (statuscode && statuscode === 200) {
                if (data?.clinics) {
                    let result = [];
                    result.push({
                        value: "", label: "All"
                    });
                    _.forOwn(data?.clinics, function (value, key) {
                        result.push({
                            value: value.id, label: value.clinic_name
                        });
                    });
                    setAllClinics(result);
                }

                if (data && data.invoices !== undefined) {
                    const { current_page, next_page_url, per_page } = data.invoices;

                    setCurrentPage(current_page);
                    setNextPageUrl(next_page_url);
                    setPerPage(per_page);

                    let serverRespone = data.invoices.data;
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

    const goTo = (id) => {
        history.push(`/invoice-detail/${id}`);
    }

    const handleClick = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
        calendarRef.current.setOpen(!isOpen)
    };
    const handleClickto = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
        calendarRefto.current.setOpen(!isOpen)
    };
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

    // if (window.performance) {
    //     console.info("window.performance work's fine on this browser");
    //   }
    //     if (performance.navigation.type == 1) {
    //       console.info( "This page is reloaded" );
    //     } else {
    //       console.info( "This page is not reloaded");
    //     }



    useEffect(async () => {
        let filterID = selectedPets
        let filterpet = []
        if (filterID != null && filterID.length > 0) {
            filterID.forEach((val) => {
                    filterpet.push(val.value)

            })
        }
        let filterpetID = filterpet.join()

    

        let formData;
        if (startDate && endDate) {
            formData = { ...formData, startDate: moment(startDate).format("YYYY-MM-DD"), endDate: moment(endDate).format("YYYY-MM-DD") };
        }
        if (filterpetID) {
            // console.log("welcome")
            formData = { ...formData, pet_id: filterpetID };
        }
        if (clinicId.value) {
            formData = { ...formData, clinic_id: clinicId.value };
        }
        //if (formData !== undefined) {
        formData = { ...formData, page: process.env.REACT_APP_FIRST_PAGE, pagesize: process.env.REACT_APP_PER_PAGE };
        await getInvoices({ clientId: getLoggedinUserId(), query: formData });
        //}
        window.addEventListener('scroll', (e) => handleScroll(e), true);
        return () => {
            window.removeEventListener('scroll', (e) => handleScroll(e))
        };
    }, [startDate, endDate, petId, clinicId, selectedPets]);

    useEffect(() => {
            // if (emptyArray) {
            //   let  filterpet = []
            //     localStorage.setItem("eventID", filterpet)
            // }
    }, [emptyArray]);


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
            console.log('Get next page payload ', formData)
            await getInvoices({
                clientId: getLoggedinUserId(), query: {
                    ...formData, page: page,
                    pagesize: perPage,
                }
            });
        }
    }, [page]);

    const getStatus = (value, type) => {
        let status, cls;
        if (value === "paid") {
            status = "Paid";
            cls = "";
        }
        if (value === "partial") {
            status = "Partially Paid";
            cls = "";
        }
        if (value === "cancel") {
            status = "Cancelled";
            cls = "red";
        }

        if (value === "ready") {
            status = "Awaiting Payment";
            cls = "orange";
        }
        if (type == 1) {
            return cls;
        }
        else {
            return status;
        }
    }
    return (
        <React.Fragment>
            <div className="content_outer">
                <Sidebar activeMenu="invoices" />
                <div className="right_content_col">
                    <main>
                        <Header
                            heading={"My Invoices"}
                            subHeading={"Here you can your invoices list"}
                            hasBtn={false}
                        />

                        <form>
                            <div className="box mb-3">
                                <div className="fieldOuter d-sm-inline-block mr-sm-2 mb-2 mb-lg-0">
                                    <div className="fieldBox fieldIcon">

                                        <DatePicker
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="Start Date"
                                            ref={calendarRef}
                                            className="fieldInput calendarFilter expandCalender"
                                            selectsRange={true}
                                            startDate={startDate}
                                            endDate={endDate}
                                            onChange={(update) => {
                                                setDateRange(update);
                                            }}
                                            isClearable={false}
                                            maxDate={new Date()}

                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select" />
                                        <img src={CALENDER_IMAGE} onClick={(e) => handleClick(e)} />
                                    </div>
                                </div>

                                <div className="fieldOuter d-sm-inline-block mr-sm-2 mb-2 mb-lg-0">
                                    <div className="fieldBox fieldIcon">

                                        <DatePicker
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText=" End Date"
                                            ref={calendarRefto}
                                            className="fieldInput calendarFilter expandCalender"
                                            selectsRange={true}
                                            startDate={startDateto}
                                            endDate={endDateto}
                                            onChange={(update) => {
                                                setDateRangeto(update);
                                            }}
                                            onSelect={(e) => { console.log("end", e) }}
                                            isClearable={false}
                                            maxDate={new Date()}
                                            minDate={startDateto}
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select" />
                                        <img src={CALENDER_IMAGE} onClick={(e) => handleClickto(e)} />
                                    </div>
                                </div>

                                <div className="fieldOuter d-inline-block mr-2 mb-2 mb-lg-0">
                                    <div className="fieldBox">

                                        <Select
                                            defaultValue={{ label: "All Pets", value: "" }}
                                            className={"customSelectBox petSelect"}
                                            placeholder={"Select pet"}
                                            isSearchable={true}
                                            id="petId"
                                            name="petId"
                                            value={emptyArray?[ {value: "", label: "All"}]:selectedPets}
                                            options={allPets}
                                            isMulti
                                            onChange={(e) =>{ 
                                                if(e.findIndex(_=>_.label=="All")>-1){
                                                selectedPet([])
                                                }else
                                                selectedPet(e)
                                            }}
                                        //onChange={(e) => setPetId(e)}

                                        />
                                    </div>
                                </div>

                                <div className="fieldOuter d-inline-block mb-sm-0">
                                    <div className="fieldBox">
                                        <Select
                                            defaultValue={{ label: "All Clinics", value: "" }}
                                            className={"customSelectBox petSelect"}
                                            placeholder={"Select clinic"}
                                            isSearchable={true}
                                            id="clinicId"
                                            name="clinicId"
                                            value={clinicId}
                                            options={allClinics}
                                            isMulti
                                            onChange={(e) => setClinicId(e)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {records && records.length > 0 ? (
                                records.map((val, index) => (
                                    <div key={index} className="box recordCard onHover" onClick={() => goTo(val.id)}>

                                        <div className={`dueDate ${getStatus(val.status, 1)}`}>{getStatus(val.status, 2)}</div>
                                        <div className="recordDate">
                                            <span>{(val.created) ? formatDate(val?.created, 1, false) : ''}</span>
                                            <p>{(val.created) ? formatDate(val?.created, 2, false) : ''}</p>
                                        </div>
                                        <p><label className="InvoiceList"><img src={INVOICE_PET} /> {val?.pet?.name}</label></p>
                                        <p><label className="InvoiceList"><img src={INVOICE_HOSPITAL_PET} /> {val?.clinic?.clinic_name}</label></p>
                                    </div>
                                ))

                            ) : (
                                    <NoRecord />
                                )}
                        </form>
                    </main>
                </div>
            </div>
        </React.Fragment >
    );
};
export default Invoice;
