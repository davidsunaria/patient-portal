import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStoreActions, useStoreState } from "easy-peasy";
import _ from "lodash";
import { getLoggedinUserId, getProfileCompleted } from "patient-portal-utils/Service";
import Header from "patient-portal-components/Header/Header.js";
import referral from "patient-portal-images/referral.png";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { set } from "lodash";


// https://stackoverflow.com/questions/57594045/validation-using-formik-with-yup-and-react-select
const Referral = (props) => {
    const history = useHistory();

    const [isCopy, setCopy] = useState(false)

    const response = useStoreState((state) => state.profile.response);
    const getMyProfile = useStoreActions((actions) => actions.profile.getMyProfile);



    useEffect(async () => {
        await getMyProfile(getLoggedinUserId());
    }, []);

    console.log("response", response?.data?.clientData?.referral_link)

    useEffect(() => {

        if (isCopy) {
            toast.success(<ToastUI message={"Link copied successfully"} type={"Success"} />);
            setCopy(false)
        }

    }, [isCopy])

    const linkCopied = (link) => {
        navigator.clipboard.writeText(link)
        setCopy(true)
    }

    return (
        <React.Fragment>
            <div className="content_outer">
                <Sidebar activeMenu="profile" />
                <div className="right_content_col">
                    <main>
                        <Header
                            backEnabled={true}
                            heading={"Referral Program"}
                            hasBtn={false}

                        />


                        <div className="box text-center">
                            <img src={referral} className="referralImg" />
                            <h5 className="referralTitle">Refer now and get rewarded</h5>
                            <p className="referralContent">Share your referral link with your friends.<br />
                If they book an appointment with us, you will get referral reward.</p>
                            <div className="shareLinkOuter">
                                <label className="shareLinkLabel">Share your referral link</label>
                                <div className="linkOuter">
                                    <p>{response?.data?.clientData?.referral_link}</p>
                                    <span onClick={() => { linkCopied(response?.data?.clientData?.referral_link) }} className="copyLink">Copy</span>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

        </React.Fragment>
    );
};
export default Referral;
