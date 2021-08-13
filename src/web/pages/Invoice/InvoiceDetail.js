import React, { useState, useEffect } from "react";
import Table from "patient-portal-components/Table/Table.js";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import Header from "patient-portal-components/Header/Header.js";
import GO_BACK from "patient-portal-images/goBack.svg";
import { useHistory, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";

const InvoiceDetail = (props) => {
    const history = useHistory();
    const { id } = useParams();
    const [invoiceData, setInvoiceData] = useState({});
    const tableHeaders = ["Item", "Quantity", "Rate", "Tax", "Amount"];
    const [tableData, setTableData] = useState([]);
    const getInvoice = useStoreActions((actions) => actions.invoice.getInvoice);
    const response = useStoreState((state) => state.invoice.response);
    useEffect(async () => {
        if (id) {
            await getInvoice(id);
        }
    }, [id]);
    useEffect(  () => {
        if (response) {
            let { message, statuscode, data } = response;
            if (statuscode && statuscode === 200) {
                if (data?.invoice_details?.invoiceData) {
                    setInvoiceData(data?.invoice_details?.invoiceData);
                    setTableData(data?.invoice_details?.invoiceData.invoiceproducts);
                }
            }
        }
    }, [response]);


    return (
        <React.Fragment>
            <div className="content_outer">
                <Sidebar activeMenu="invoices" />
                <div className="right_content_col">
                    <main>
                        <a className="backTo" onClick={() => history.push("/invoices")}>
                            <img src={GO_BACK} /> Back to Invoice
                        </a>
                        <Header
                            heading={"My Invoices"}
                            subHeading={"Here you can your invoices list"}
                            hasBtn={false}
                        />


                        <div className="box p-0">
                            <div className="row pt-4 px-4">
                                <div className="col-xl-2 col-md-4 mb-4">
                                    <div className="profileDetailCol">
                                        <label>Invoice Number</label>
                                        <span> {invoiceData?.invoice_number}</span>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-md-4 mb-4">
                                    <div className="profileDetailCol">
                                        <label>Invoice Date</label>
                                        <span>March 19, 2021</span>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-md-4 mb-4">
                                    <div className="profileDetailCol">
                                        <label>Payment Mode</label>
                                        {/* <span>{invoiceData?.payments.payment_mode}</span> */}
                                    </div>
                                </div>
                                <div className="col-xl-3 col-md-4 mb-4">
                                    <div className="profileDetailCol">
                                        <label>Client</label>
                                        <span>
                                        {invoiceData?.client?.firstname} {" "}{invoiceData?.client?.lastname} ({invoiceData?.client?.phone_code})
                                        </span>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-md-4 mb-4">
                                    <div className="profileDetailCol">
                                        <label>Pet</label>
                                        <span>{invoiceData?.pet?.name} (2y 11m)</span>
                                    </div>
                                </div>
                            </div>
                            <Table headers={tableHeaders} tableData={tableData} />
                            
                            <div className="totalInvoice">
                                <div className="totalRow">
                                    <div className="totalCol">Sub Total</div>
                                    <div className="totalCol text-right">
                                        INR {invoiceData?.subtotal}
                                    </div>
                                </div>
                                <div className="totalRow">
                                    <div className="totalCol">Tax</div>
                                    <div className="totalCol text-right">
                                        INR {invoiceData?.tax}
                                    </div>
                                </div>
                                <div className="totalRow">
                                    <div className="totalCol">Discount</div>
                                    <div className="totalCol text-right">
                                        INR {invoiceData?.discount}
                                    </div>
                                </div>
                                <div className="totalRow">
                                    <div className="totalCol">
                                        <b>Total</b>
                                    </div>
                                    <div className="totalCol text-right">
                                        <b>INR {invoiceData?.paid_amount}</b>
                                    </div>
                                </div>
                                <div className="totalRow">
                                    <div className="totalCol">Payment made</div>
                                    <div className="totalCol text-right">
                                        INR {invoiceData?.paid_amount}
                                    </div>
                                </div>
                                <div className="totalRow border-0">
                                    <div className="totalCol">
                                        <b>Balance Due</b>
                                    </div>
                                    <div className="totalCol text-right">
                                        <b>INR {invoiceData?.remaining_amount}</b>
                                    </div>
                                </div>
                                <div className="d-flex mt-3">
                                    <button className="button primary">
                                        Download
                                    </button>
                                   
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </React.Fragment>
    );
};
export default InvoiceDetail;
