import { useStoreActions, useStoreState } from "easy-peasy";
import React from "react";
import reactDom from "react-dom";
import LoadingOverlay from 'react-loading-overlay'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Layout = (props) => {
  const isLoading = useStoreState((state) => state.common.isLoading);
  return (
    <React.Fragment>
      {isLoading && <LoadingOverlay
        active={isLoading}
        spinner
        text='Please wait...'
      >
      </LoadingOverlay>}
      {props.children}
      {/* top-right */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </React.Fragment>);
}




export default Layout;