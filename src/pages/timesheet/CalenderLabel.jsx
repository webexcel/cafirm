import React from 'react'
import { IoChevronForwardOutline } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";
import DateLabel from './DateLabel';
const WeeklyCalenderLabel = ({ dateList }) => {
    const today = new Date();
    const currentMonthName = today.toLocaleString('en-US', { month: 'long' });
    const currentYear = today.getFullYear();
    return (

            <div className='d-flex align-items-center ps-4 pe-2 py-2'>
                {/* header */}
                <td colspan="2" width="15%" className='d-flex gap-3' >
                    <div className='fs-18 fw-bolder d-flex gap-2'>
                        <span>{currentMonthName}</span>
                        <span>{currentYear}</span>
                    </div>
                   </td>
                <td className='d-flex py-2 gap-1' style={{ width: '70%', paddingLeft: '1%' }}>
                    {
                        dateList.map((data) => (
                            <DateLabel {...data} />
                        ))
                    }
                </td>
                <td >Test</td>

            </div>

    )
}

export default WeeklyCalenderLabel
