import React, { useState } from "react";

import Tabs from "patient-portal-components/Tabs/Tabs.js";
import Table from "patient-portal-components/Table/Table.js";
import Input from "patient-portal-components/Input/Input.js";
import Button from "patient-portal-components/Button/Button.js";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import Rating from "patient-portal-components/Rating/Rating";

const Feedback = (props) => {
    return (<React.Fragment>
    <div className="content_outer">
      <Sidebar activeMenu="appointment" />
        <div className="right_content_col">
            <main>
                {/*a className="backTo"><img src="assets/img/goBack.svg"/> Back to Pre-Treatment</a*/}
                <div className="titleBtn">
                    <h1 className="title">Feedback</h1>
                    <div className="titleDiscription">
                        Please share your valuable feedback with us.
                    </div>
                </div>
                <div className="box">
                    <div className="formSubtitle">Visit Details</div>
                    <div className="row">
                        <div className="col-xl-2 col-lg-2 mb-4">
                            <div className="profileDetailCol">
                                <label>Time</label>
                                <span>2019/06/11</span>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-5 mb-4">
                            <div className="profileDetailCol">
                                <label>Clinic</label>
                                <span>DCC-Animal Hospital Gurgaon</span>
                            </div>
                        </div>
                        <div className="col-xl-7 col-md-4 mb-4">
                            <div className="profileDetailCol">
                                <label>Doctor</label>
                                <span>Jaspreet Kaur</span>
                            </div>
                        </div>
                    </div>
                    <div className="fieldOuter mb-2">
                        <label className="fieldLabel">
                            How would you rate your experience with DCC?
                        </label>
                        <Rating />
                    </div>
                    <div className="fieldOuter mb-2">
                        <label className="fieldLabel">
                            How would you rate the staff who took care of your
                            pet?
                        </label>
                        <Rating />
                    </div>
                    <div className="fieldOuter mb-3">
                        <label className="fieldLabel">
                            How would you rate the DCC PetConnect application?
                        </label>
                       <Rating />
                    </div>
                    <div className="fieldOuter mb-3">
                        <label className="fieldLabel">
                            Can you describe your experience with DCC?
                        </label>
                        <div className="fieldBox">
                            <input type="text" className="fieldInput" />
                        </div>
                    </div>
                    <div className="fieldOuter mb-3">
                        <label className="fieldLabel">
                            Can you tell us how we can improve?
                        </label>
                        <div className="fieldBox">
                            <input type="text" className="fieldInput" />
                        </div>
                    </div>
                    <div className="mt-2 mb-3">
                        <button className="button primary">Submit</button>
                    </div>
                </div>
            </main>
        </div>
        </div>
        </React.Fragment>
    );
};
export default Feedback;
