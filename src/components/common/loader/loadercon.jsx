// src/components/common/loader/loader.jsx
import React from "react";
import { Spinner } from "react-bootstrap";

const LoaderCon = ({ center = true }) => {
  return (
    <div className={`text-${center ? "center" : "start"} my-3`}>
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default LoaderCon;
