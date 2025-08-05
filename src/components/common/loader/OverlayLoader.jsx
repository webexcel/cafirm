import React from 'react';
import { Spinner } from 'react-bootstrap';

const OverlayLoader = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="overlay-loader d-flex justify-content-center align-items-center">
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default OverlayLoader;
