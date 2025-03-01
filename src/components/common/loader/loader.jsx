// This is a simple Loader component that displays a spinner for indicating loading states.

import React from 'react';
import PropTypes from 'prop-types';

const Loader = ({ size = '4rem', color = 'rgb(142 84 233)', fontSize = '1.5rem', message = 'Loading...' }) => {
    return (
        <div className="loader-container">
            <div
                className="spinner-border"
                role="status"
                style={{
                    width: size,
                    height: size,
                    color: color,
                    fontSize: fontSize
                }}
            >
                <span className="visually-hidden">{message}</span>
            </div>
        </div>
    );
};

// Prop validation
Loader.propTypes = {
    size: PropTypes.string,
    color: PropTypes.string,
    message: PropTypes.string,
    fontSize: PropTypes.string
};

export default Loader;
