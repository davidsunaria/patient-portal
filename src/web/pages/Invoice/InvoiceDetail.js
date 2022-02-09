import React, { useState, useEffect } from "react";
import Table from "patient-portal-components/Table/Table.js";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import Header from "patient-portal-components/Header/Header.js";
import GO_BACK from "patient-portal-images/goBack.svg";
import { getLoggedinUserId, getUser, getLoggedinPreferredClinic, getLastPetId } from "patient-portal-utils/Service";
import DCCLOGO from "patient-portal-images/dcc-logo.svg";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { SELECT_CLINIC, SELECT_SERVICE, SELECT_PROVIDER, SELECT_PET, SELECT_APPOINTMENT_NOTES, SELECT_DATE, SELECT_TIME, RAZORPAY_ERROR } from "patient-portal-message";
import { useHistory, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import { getAge, numberFormat, formatDate } from "patient-portal-utils/Service";

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
    const payInvoice = useStoreActions((actions) => actions.invoice.payInvoice);
    const createAppointment = useStoreActions((actions) => actions.appointment.createAppointment);

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

                if (data?.redirect_url) {
                    window.open(data?.redirect_url, "_self");
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

    const payNow = async (invoice) => {
        let payload = {
            id: invoice.id,
            type: 'Web',
            remaining_amount: invoice.remaining_amount,
            invoice_number: invoice.invoice_number
        }
        // await payInvoice(payload)
        await displayRazorpay(payload);
    }

    const loadScript = async (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    const displayRazorpay = async (payload) => {
        let userData = getUser();
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            toast.error(<ToastUI message={RAZORPAY_ERROR} type={"Error"} />);
            return;
        }
        let currency = 'INR';
        let amount = (payload.remaining_amount) * 100;

        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
            amount: amount,
            currency: currency,
            name: `${userData?.firstname} ${userData?.lastname}`,
            description: `PAYMENT FOR:${payload?.invoice_number}`,
            image: DCCLOGO,
            handler: async function (response) {
                try {
                    if (response.razorpay_payment_id) {
                        payload.razorpay_payment_id = response.razorpay_payment_id
                        await payInvoice(payload)
                    }
                    else {
                        alert("payment error")
                    }
                } catch (err) {
                    console.log(err);
                }
            },

            prefill: {
                name: `${userData?.firstname} ${userData?.lastname}`,
                email: `${userData?.email}`,
                contact: `${userData?.phone_code}`,
            },
            theme: {
                color: '#2EAD5A',
            },
        };
        const paymentObject = new window.Razorpay(options);

        paymentObject.open();
    }
    return (
        <React.Fragment>
            <div className="content_outer">
                <Sidebar activeMenu="invoices" />
                <div className="right_content_col">
                    <main>


                        <Header
                            key={1}
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
                                        <span>{formatDate(invoiceData?.payment_date, 7, false)}</span>
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
                                        <span>{invoiceData?.pet?.name} ({getAge(invoiceData?.pet?.dob)})</span>
                                    </div>
                                </div>
                            </div>

                            <div className="formSubtitle  mb-2">Product Details</div>
                            <Table key={1} headers={tableHeaders} tableData={tableData} />

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
                                                {numberFormat(invoiceData?.grand_total, 'currency', 2, 2)}
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
                                        <button className="button primary mr-2" onClick={() => download(invoiceData?.id)}>
                                            Download
                                        </button>
                                        {(invoiceData?.status == "ready" || invoiceData?.status == "partial") && <button className="button primary" onClick={() => payNow(invoiceData)}>
                                            Pay Now
                                        </button>}
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
