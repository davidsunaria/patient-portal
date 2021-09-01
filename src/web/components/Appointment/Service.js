import React, { useState, useEffect, useCallback, useMemo, forwardRef, useRef } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CROSS_IMAGE from "patient-portal-images/cross.svg";

const Service = (props) => {
  return (
    <React.Fragment>
      <Modal isOpen={props.modal}  >
        <ModalBody className="p-0">
          <div className="popupWrapper">
            <div className="popupTitle mb-3">{props?.data?.name}
              <a onClick={props.toggle} className="cross">
                <img src={CROSS_IMAGE} />
              </a>
            </div>
            <div className="servicesDetail">
              <div className="serviceDetailRow">
                <label>Description</label>
                <div>{props?.data?.description}</div>
              </div>

              <div className="serviceDetailRow">
                <label>Price</label>
                <div>{props?.data?.price}</div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
export default Service;