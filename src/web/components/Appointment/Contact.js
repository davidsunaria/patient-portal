import React, { useState, useEffect, useCallback, useMemo, forwardRef, useRef } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from "moment";
import CROSS_IMAGE from "patient-portal-images/cross.svg";
import ADDRESS_IMAGE from "patient-portal-images/address.svg";
import MAP_IMAGE from "patient-portal-images/map.png";
import TEL_IMAGE from "patient-portal-images/telephone.svg";
import WHATSAPP_IMAGE from "patient-portal-images/whatsapp.svg";
import EMAIL_IMAGE from "patient-portal-images/emailGreen.svg";
import CLOCK_IMAGE from "patient-portal-images/clock.svg";
import { formatDate } from "patient-portal-utils/Service";
import Select from 'react-select';

const Contact = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clnicOpen, setClinicOpen] = useState(false);

  useEffect(() => {
    if (props.data.business_hours) {
      props.data.business_hours && props.data.business_hours.length > 0 && props.data.business_hours.map((val, index) => {
        if (val?.day == moment().day()) {
          let format = 'HH:mm:ss';
          let beforeTime = moment(val?.from_time, format);
          let time = moment();
          let afterTime = moment(val?.to_time, format);
          if (time.isBetween(beforeTime, afterTime)) {
            setClinicOpen(true);
          } else {
            setClinicOpen(false);
          }
        }
      });
    }
  }, [props.data.business_hours]);
  return (
    <React.Fragment>
      <Modal isOpen={props.modal}  >
        <ModalBody className="p-0">
          <div className="popupWrapper">
            <div className="popupTitle">{props.data?.clinic_name}
              <a onClick={props.toggle} className="cross">
                <img src={CROSS_IMAGE} />
              </a>

            </div>
            <p className="p-text mb-4">Hospital - <span className={clnicOpen == true ? "openStatus" : "colorRed" }>{clnicOpen == true ? "Open" : "Close"}</span></p>

            <div className="addressRow mapImg">
              <div className="addressIcon">
                <img src={ADDRESS_IMAGE} className="map" />
              </div>
              <div className="addressInfo">
                <label>Address</label>
                <p>{props.data?.address}</p>
                <a className="onHover" target="_blank" href={`${props.data?.business_link}`}><img src={MAP_IMAGE} className="map" /></a>
              </div>
            </div>

            <div className="addressRow">
              <div className="addressIcon">
                <img src={TEL_IMAGE} className="map" />
              </div>
              <div className="addressInfo">
                <label>Contact Number</label>
                <p> {props.data?.phone_no_code}</p>
              </div>
            </div>

            <div className="addressRow">
              <div className="addressIcon">
                <img src={EMAIL_IMAGE} className="map" />
              </div>
              <div className="addressInfo">
                <label>Email</label>
                <p> {(props?.data.contact_email) ? props?.data.contact_email : 'info@dccpets.in' }</p>
              </div>
            </div>


            <div className="addressRow">
              <div className="addressIcon">
                <img src={CLOCK_IMAGE} className="map" />
              </div>
              <div className="addressInfo">
                <label>Operating hours</label>

                {props.data.business_hours && props.data.business_hours.length > 0 ? (
                  props.data.business_hours.map((val, index) => (
                    <div key={index} className={val?.day == moment().day() ? "operationalHours todayHours" : "operationalHours"}>
                      <label>{formatDate(val?.day, 6, false)}</label>
                      <span>{formatDate(val?.from_time, 5, false)} - {formatDate(val?.to_time, 5, false)}</span>
                    </div>
                  ))
                ) : (
                  <div className="operationalHours">
                    No timeslot found
                  </div>

                )}
              </div>
            </div>

          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

export default Contact;