import React from 'react'
import { IoChevronForwardOutline } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";
import DateLabel from './DateLabel';
const WeeklyCalenderLabel = ({ dateList }) => {
    return (
        <div>

            <div className='d-flex align-items-center ps-4 pe-2 py-2'>
                {/* header */}
                <div className='d-flex gap-3' style={{ width: '30%' }}>
                     <div className='fs-18 fw-bolder'>
                        March 2022
                    </div>
                    {/* <div className='d-flex align-items-center'>
                        <IoChevronBackOutline size={17} style={{ cursor: 'pointer' }} />
                        <IoChevronForwardOutline size={17} style={{ cursor: 'pointer' }} />
                    </div>  */}
                </div>
                {/* dates */}

                <div className='d-flex py-2 gap-1' style={{ width: '70%',paddingLeft:'1%'}}>
                    {
                        dateList.map((data) => (
                            <DateLabel {...data} />
                        ))
                    }
                </div>

            </div>
            {/* 
            <div className='d-flex ps-4'>
                <div className='w-50 d-flex justify-content-between'>
                    <div>Client 1</div>
                    <div>Task 1</div>
                    <div>Description 1</div>
                </div>
                <div className='w-50 d-flex'>
                    <div>1</div>
                    <div>3</div>
                    <div>3</div>
                </div>
            </div> 
            */}

        </div>

    )
}

export default WeeklyCalenderLabel
