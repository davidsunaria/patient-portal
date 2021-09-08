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
import _ from "lodash";
import { getLoggedinUserId, showFormattedDate, formatDate } from "patient-portal-utils/Service";
import NoRecord from "patient-portal-components/NoRecord";
import { subDays } from "date-fns";


const Invoice = (props) => {
    const calendarRef = useRef();
    const history = useHistory();
    const [isBottom, setIsBottom] = useState(false);
    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPageUrl, setNextPageUrl] = useState(null);

    const [isOpen, setIsOpen] = useState(false);
    const [dateRange, setDateRange] = useState([new Date(), subDays(new Date(), 15)]);
    const [startDate, endDate] = dateRange;
    const [petId, setPetId] = useState({ value: "", label: "All Pets" });
    const [clinicId, setClinicId] = useState({ value: "", label: "All Clinics" });
    const [allClinics, setAllClinics] = useState([]);
    const [allPets, setAllPets] = useState([]);

    const getInvoices = useStoreActions((actions) => actions.invoice.getInvoices);
    const getAllClinics = useStoreActions((actions) => actions.invoice.getAllClinics);
    const response = useStoreState((state) => state.invoice.response);

    const getPets = useStoreActions((actions) => actions.pet.getPets);
    const responsePet = useStoreState((state) => state.pet.response);


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
        let formData;
        if (startDate && endDate) {
            formData = { ...formData, startDate: moment(startDate).format("YYYY-MM-DD"), endDate: moment(endDate).format("YYYY-MM-DD") };
        }
        if (petId.value) {
            formData = { ...formData, pet_id: petId.value };
        }
        if (clinicId.value) {
            formData = { ...formData, clinic_id: clinicId.value };
        }
        if(formData !== undefined){
            await getInvoices({ clientId: getLoggedinUserId(), query: formData });
        }
        
    }, [startDate, endDate, petId, clinicId]);

    useEffect(async () => {
        let formData = {
            page: 1, pagesize: 20
        }
        await getInvoices({ clientId: getLoggedinUserId(), query: formData });
        window.addEventListener('scroll', (e) => handleScroll(e), true);
        return () => {
            window.removeEventListener('scroll', (e) => handleScroll(e))
        };
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
                                            placeholderText="Date"
                                            ref={calendarRef}
                                            className="fieldInput calendarFilter expandCalender"
                                            selectsRange={true}
                                            startDate={startDate}
                                            endDate={endDate}
                                            onChange={(update) => {
                                                setDateRange(update);
                                            }}
                                            isClearable={false}
                                        />
                                        <img src={CALENDER_IMAGE} onClick={(e) => handleClick(e)} />
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
                                            value={petId}
                                            options={allPets}
                                            onChange={(e) => setPetId(e)}
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
