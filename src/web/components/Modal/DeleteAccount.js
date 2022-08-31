import React, { useState, useRef, forwardRef, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CROSS_IMAGE from "patient-portal-images/cross.svg";
import { useStoreActions, useStoreState } from "easy-peasy";

const DeleteAccount = (props) => {

  const [confirmModal, setConfirmModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const logout = useStoreActions((actions) => actions.auth.logout);

  const deleteConfirmation = () => {
    setConfirmModal(true)
  }
  const openDeleteModal = () => {
    setConfirmModal(false)
    setDeleteModal(true)
  }
  const handleChange = (e) => {
    setPassword(e?.target?.value)
    if (password !== "") {
      setError("")
    }
  }
  const deleteAccount = async() => {
    console.log("password", password)
    if (password === "") {
      setError("please enter empty field")
    }
    else {
      await logout();
      setError("")
      setPassword("")
      setDeleteModal(false)
    }
  }
  const deleteModalClose = () => {
    setError("")
    setPassword("")
    setDeleteModal(false)
  }
  return (
    <React.Fragment>
      <p className="deleteAccount" onClick={deleteConfirmation}>Delete Account</p>
      <Modal isOpen={confirmModal}  >
        <ModalBody className="p-0">
          <div className="popupWrapper">
            <div className="popupTitle mb-3">Confirmation required
              <a className="cross" onClick={() => setConfirmModal(false)}>
                <img src={CROSS_IMAGE} />
              </a>
            </div>
            <div>
              <p className="p-text mt-4">Are you sure you want to delete your account ? This process cannot be undone. </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="button primary" onClick={openDeleteModal}>Yes</Button>{' '}
          <Button className="button secondary" onClick={() => setConfirmModal(false)}>No</Button>
        </ModalFooter>
      </Modal>


      <Modal isOpen={deleteModal}  >
        <ModalBody className="p-0">
          <div className="popupWrapper">
            <div className="popupTitle"><span className="deletedTitle">Please re-enter your password to confirm:</span>
              <a className="cross deletedTitle"  onClick={deleteModalClose}>
                <img src={CROSS_IMAGE} />
              </a>
            </div>
           

            <div className={
              "fieldBox"
            }>
              <input
                placeholder="Enter your password"
                className="fieldInput"
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handleChange}
                autoComplete="off"
              />
              <p className="deleteAccount text-danger ml-1">{error}</p>
            </div>

          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="button bg-danger" onClick={deleteAccount}>Delete Account</Button>{' '}
        </ModalFooter>
      </Modal>



    </React.Fragment>
  );
}
export default DeleteAccount