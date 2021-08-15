import React, { useState, useEffect } from "react";
import Table from "patient-portal-components/Table/Table.js";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import Header from "patient-portal-components/Header/Header.js";
import GO_BACK from "patient-portal-images/goBack.svg";
import { useHistory, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";

import { numberFormat } from "patient-portal-utils/Service";

const InvoiceDetail = (props) => {
    const history = useHistory();
    const { id } = useParams();
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [invoiceData, setInvoiceData] = useState({});
    const tableHeaders = ["Item", "Quantity", "Rate", "Tax", "Amount"];
    const [tableData, setTableData] = useState([]);
    const [paymentRecords, setPaymentRecords] = useState([]);
    const getInvoice = useStoreActions((actions) => actions.invoice.getInvoice);
    const downloadInvoice = useStoreActions((actions) => actions.invoice.downloadInvoice);

    const response = useStoreState((state) => state.invoice.response);
    useEffect(async () => {
        if (id) {
            await getInvoice(id);
        }
    }, [id]);
    useEffect(() => {
        if (response) {
            let { message, statuscode, data } = response;
            if (statuscode && statuscode === 200) {
                if (data?.invoice_details?.invoiceData) {
                    setInvoiceData(data?.invoice_details?.invoiceData);
                    setTableData(data?.invoice_details?.invoiceData.invoiceproducts);
                    setPaymentRecords(data?.invoice_details?.paymentRecords);
                }
                if (data?.file_url) {
                    setDownloadUrl(data?.file_url);
                }

            }
        }
    }, [response]);

    const download = async (id) => {
        await downloadInvoice(id);
    }
    useEffect(() => {
        if (downloadUrl) {
            window.open(downloadUrl, "_blank");
        }

    }, [downloadUrl]);
    return (
        <React.Fragment>
            <div className="content_outer">
                <Sidebar activeMenu="invoices" />
                <div className="right_content_col">
                    <main>


                        <Header
                            backEnabled={true}
                            backTitle={"Back to Invoices"}
                            backAction={"invoices"}
                            heading={"My Invoices"}
                            subHeading={"Here you can your invoices list"}
                            hasBtn={false}
                        />

                        <div className="box px-4">
                            <div className="row pt-4">
                                <div className="col-xl-2 col-md-4 mb-4">
                                    <div className="profileDetailCol">
                                        <label>Invoice Number</label>
                                        <span>{invoiceData?.invoice_number}</span>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-md-4 mb-4">
                                    <div className="profileDetailCol">
                                        <label>Invoice Date</label>
                                        <span>March 19, 2021</span>
                                    </div>
                                </div>


                                <div className="col-xl-3 col-md-4 mb-4">
                                    <div className="profileDetailCol">
                                        <label>Client</label>
                                        <span>{invoiceData?.client?.firstname} {" "}{invoiceData?.client?.lastname} ({invoiceData?.client?.phone_code})</span>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-md-4 mb-4">
                                    <div className="profileDetailCol">
                                        <label>Pet</label>
                                        <span>{invoiceData?.pet?.name} (2y 11m)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="formSubtitle  mb-2">Product Details</div>
                            <Table headers={tableHeaders} tableData={tableData} />

                            <div className="formSubtitle  mb-2">Payment Details</div>


                            <div className="table-responsive mb-4">
                                <table className="table mb-0 table-striped">
                                    <thead>
                                        <tr>
                                            <th>Payment Date</th>
                                            <th>Paid Amount</th>
                                            <th>Payment Mode</th>
                                            <th>Transaction Number</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentRecords && paymentRecords.length > 0 ? (
                                            paymentRecords.map((val, index) => (
                                                <tr key={index}>
                                                    <td>{val?.payment_date}</td>
                                                    <td>{numberFormat(val?.paid_amount, 'currency', 2, 2)}</td>
                                                    <td>{val?.payment_mode}</td>
                                                    <td>{val?.transaction_number}</td>
                                                    <td>{val?.status}</td>
                                                </tr>

                                            ))

                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="text-center">No Record Found</td>
                                            </tr>
                                        )}


                                    </tbody>
                                </table>
                            </div>
                            <div className="invoiceDetail"><label>Total in Words:</label><span><b>{invoiceData?.words}</b></span></div>
                            <div className="d-sm-flex">
                                <pre className="bankDetail">
                                    {invoiceData?.clinic?.bank_details}
                                </pre>
                                <div className="totalInvoice">
                                    <div className="totalRow">
                                        <div className="totalCol">Sub Total</div>
                                        <div className="totalCol text-right">
                                            {numberFormat(invoiceData?.subtotal, 'currency', 2, 2)}
                                        </div>
                                    </div>
                                    <div className="totalRow">
                                        <div className="totalCol">Tax</div>
                                        <div className="totalCol text-right">
                                            {numberFormat(invoiceData?.tax, 'currency', 2, 2)}
                                        </div>
                                    </div>
                                    <div className="totalRow">
                                        <div className="totalCol">Discount</div>
                                        <div className="totalCol text-right">
                                            {numberFormat(invoiceData?.discount, 'currency', 2, 2)}
                                        </div>
                                    </div>
                                    <div className="totalRow">
                                        <div className="totalCol">
                                            <b>Total</b>
                                        </div>
                                        <div className="totalCol text-right">
                                            <b>
                                                {numberFormat(invoiceData?.paid_amount, 'currency', 2, 2)}
                                            </b>
                                        </div>
                                    </div>
                                    <div className="totalRow">
                                        <div className="totalCol">Payment made</div>
                                        <div className="totalCol text-right">
                                            {numberFormat(invoiceData?.paid_amount, 'currency', 2, 2)}
                                        </div>
                                    </div>
                                    <div className="totalRow border-0">
                                        <div className="totalCol">
                                            <b>Balance Due</b>
                                        </div>
                                        <div className="totalCol text-right">
                                            <b>
                                                {numberFormat(invoiceData?.remaining_amount, 'currency', 2, 2)}
                                            </b>
                                        </div>
                                    </div>
                                    <div className="d-flex mt-3">
                                        <button className="button primary" onClick={() => download(invoiceData?.id)}>
                                            Download
                                        </button>

                                    </div>
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
