import React from 'react';

const DateLabel = ({ day, date, active }) => {
    return (
        <div className='d-flex flex-column justify-content-center align-items-center gap-1'>
            <span className='text-center text-muted'>{day.slice(0, 3)}</span>

            <span
                className='text-center rounded-circle d-flex align-items-center justify-content-center'
                style={{
                    backgroundColor: active ? '#004bffe0' : 'rgb(0 233 0 / 27%)',
                    width: '35px',
                    height: '35px',
                    color: active ? 'white' : 'black',
                    fontWeight: '500',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
            >
                {date}
            </span>
        </div>
    );
};

export default DateLabel;
