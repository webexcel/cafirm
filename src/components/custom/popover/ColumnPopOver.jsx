import React, { useEffect } from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

const ColumnPopOver = ({ children, data }) => {
    useEffect(() => { console.log("dataa", data) }, [])
    const check = () => {
        console.log("dataa", data)
    }
     console.log("dataa", data)
    return (
        <>
            <OverlayTrigger rootClose={true} trigger="click" placement={'top'} key={Math.random()} onClick={() => check()}
                overlay={<Popover>
                    <Popover.Header as="h3"> Dismissible Popover</Popover.Header>
                    <Popover.Body >
                        And here's some amazing content. It's very engaging. Right?{data.accessor}
                    </Popover.Body>
                </Popover>}>
                {children}
            </OverlayTrigger>
        </>
    )
}

export default ColumnPopOver
