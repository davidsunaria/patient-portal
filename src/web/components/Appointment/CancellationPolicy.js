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

const CancellationPolicy = (props) => {

  return (
    <React.Fragment>
      <Modal isOpen={props.modal} >
        <ModalBody className="p-0" >
          <div className="popupWrapper">
            <div className="popupTitle">Cancellation Policy
              <a onClick={props.toggle} className="cross">
                <img src={CROSS_IMAGE} />
              </a>
            </div>
            <div className="addressRow">
              {props.data?.cancellation_policy}
            </div>
            <button className="button primary mr-2" onClick={() => props.onCancelAppointment(props.id)}>Accept</button>
            <button className="button secondary" onClick={props.toggle}>Decline</button>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

export default CancellationPolicy;